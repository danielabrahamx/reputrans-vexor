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

  const isActive = phase === "loading" || phase === "proving";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
      {isActive && (
        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-600/20" />
          <div className="absolute inset-0 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      )}
      {phase === "done" && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 animate-in zoom-in duration-200">
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )}
      {phase === "error" && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium tracking-tight text-gray-900">{PHASE_TEXT[phase]}</p>
        {phase === "proving" && (
          <p className="text-xs text-gray-400 mt-0.5">
            Your scores never leave this browser. The proof is generated locally.
          </p>
        )}
        {phase === "done" && provingTimeMs && (
          <p className="text-xs text-gray-400 mt-0.5">
            Completed in {(provingTimeMs / 1000).toFixed(1)}s
          </p>
        )}
        {phase === "error" && (
          <p className="text-xs text-red-400 mt-0.5">
            Please try again. If the issue persists, refresh the page.
          </p>
        )}
      </div>
    </div>
  );
}
