"use client";

import { numericToGrade, type GradeLetter } from "./grades";

export interface BrowserProofResult {
  grades: GradeLetter[];
  proof: string; // hex-encoded
  publicInputs: number[];
  provingTimeMs: number;
}

export type ProvingPhase = "idle" | "loading" | "proving" | "done" | "error";

/**
 * Generate a ZK proof in the browser using Noir/Barretenberg WASM.
 * Raw scores never leave the browser.
 */
export async function generateProofInBrowser(
  scores: number[],
  onPhase?: (phase: ProvingPhase) => void
): Promise<BrowserProofResult> {
  if (scores.length !== 100) {
    throw new Error(`Expected 100 scores, got ${scores.length}`);
  }

  onPhase?.("loading");

  // Dynamic import - only loads WASM on /client-uploads
  const [{ Noir }, { BarretenbergBackend }] = await Promise.all([
    import("@noir-lang/noir_js"),
    import("@noir-lang/backend_barretenberg"),
  ]);

  // Fetch compiled circuit artifact from public/
  const circuit = await fetch("/circuits/batch_grade.json").then((r) => {
    if (!r.ok) throw new Error("Failed to load circuit artifact. Has the circuit been compiled?");
    return r.json();
  });

  const backend = new BarretenbergBackend(circuit);
  const noir = new Noir(circuit);

  // Compute expected grades (same logic as circuit)
  const expectedGrades = scores.map((score) => {
    if (score >= 900) return 5;
    if (score >= 800) return 4;
    if (score >= 650) return 3;
    if (score >= 500) return 2;
    if (score >= 300) return 1;
    return 0;
  });

  onPhase?.("proving");
  const startTime = performance.now();

  // Generate witness + proof
  const input = {
    bureau_scores: scores.map((s) => s.toString()),
    expected_grades: expectedGrades.map((g) => g.toString()),
  };

  const { witness } = await noir.execute(input);
  const proof = await backend.generateProof(witness);

  const provingTimeMs = Math.round(performance.now() - startTime);

  onPhase?.("done");

  // Map numeric grades to letters
  const grades: GradeLetter[] = expectedGrades.map((v) => numericToGrade(v));

  return {
    grades,
    proof: Buffer.from(proof.proof).toString("hex"),
    publicInputs: expectedGrades,
    provingTimeMs,
  };
}
