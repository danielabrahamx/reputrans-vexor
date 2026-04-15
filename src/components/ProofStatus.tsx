"use client";

import type { ProvingPhase } from "@/lib/prover";

interface ProofStatusProps {
  phase: ProvingPhase;
  provingTimeMs?: number;
}

const PHASE_TEXT: Record<ProvingPhase, string> = {
  idle: "",
  loading: "Loading proving engine...",
  proving: "Generating zero-knowledge proof...",
  done: "Proof generated!",
  error: "Proof generation failed",
};

export function ProofStatus({ phase, provingTimeMs }: ProofStatusProps) {
  if (phase === "idle") return null;

  return (
    <div className="flex items-center gap-3 py-4">
      {(phase === "loading" || phase === "proving") && (
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      )}
      {phase === "done" && (
        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">
          &#10003;
        </div>
      )}
      {phase === "error" && (
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
          &#10005;
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-900">{PHASE_TEXT[phase]}</p>
        {phase === "proving" && (
          <p className="text-xs text-gray-500 mt-0.5">
            Your scores never leave this browser. The proof is generated locally.
          </p>
        )}
        {phase === "done" && provingTimeMs && (
          <p className="text-xs text-gray-500 mt-0.5">
            Completed in {(provingTimeMs / 1000).toFixed(1)}s
          </p>
        )}
      </div>
    </div>
  );
}
