import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const { proof, publicInputs } = await request.json();

    if (!proof || !publicInputs) {
      return NextResponse.json({ error: "Missing proof or publicInputs" }, { status: 400 });
    }

    // Load circuit from disk (not self-fetch) to avoid Host header spoofing
    const { BarretenbergBackend } = await import("@noir-lang/backend_barretenberg");
    const circuitPath = join(process.cwd(), "public", "circuits", "batch_grade.json");
    const circuitJson = await readFile(circuitPath, "utf-8");
    const circuit = JSON.parse(circuitJson);
    const backend = new BarretenbergBackend(circuit);

    const proofData = {
      proof: new Uint8Array(Buffer.from(proof, "hex")),
      publicInputs,
    };

    const verified = await backend.verifyProof(proofData);
    return NextResponse.json({ verified });
  } catch (err) {
    return NextResponse.json(
      { error: `Verification failed: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 400 }
    );
  }
}
