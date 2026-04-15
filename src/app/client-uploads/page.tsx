"use client";

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from "react";
import { parseCSV, type ParseResult } from "@/lib/csv-parser";
import { generateProofInBrowser, type BrowserProofResult, type ProvingPhase } from "@/lib/prover";
import { gradeDistribution, filterSentinels, type GradeLetter } from "@/lib/grades";
import { GradeChart } from "@/components/GradeChart";
import { ProofStatus } from "@/components/ProofStatus";
import { PinGate } from "@/components/PinGate";

type PageState = "idle" | "preview" | "proving" | "results" | "error";

export default function ClientUploadsPage() {
  const [state, setState] = useState<PageState>("idle");
  const [preview, setPreview] = useState<{ file: File; result: ParseResult; columns: string[]; rows: Record<string, string>[] } | null>(null);
  const [phase, setPhase] = useState<ProvingPhase>("idle");
  const [proofResult, setProofResult] = useState<BrowserProofResult | null>(null);
  const [filteredGrades, setFilteredGrades] = useState<GradeLetter[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sent" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setState("idle");
    setPreview(null);
    setPhase("idle");
    setProofResult(null);
    setFilteredGrades(null);
    setError(null);
    setSending(false);
    setSendStatus("idle");
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file.");
      setState("error");
      return;
    }
    setError(null);
    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      const columns = lines[0]?.split(",").map(c => c.trim().replace(/^"|"$/g, "")) ?? [];
      const rows: Record<string, string>[] = [];
      for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
        const vals = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        const row: Record<string, string> = {};
        columns.forEach((col, idx) => { row[col] = vals[idx] ?? ""; });
        rows.push(row);
      }
      const result = await parseCSV(file);
      setPreview({ file, result, columns, rows });
      setState("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV.");
      setState("error");
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleProve = useCallback(async () => {
    if (!preview) return;
    setState("proving");
    setError(null);
    try {
      const result = await generateProofInBrowser(preview.result.scores, setPhase);
      setProofResult(result);
      setFilteredGrades(filterSentinels(result.grades, result.publicInputs));
      setState("results");
    } catch (err) {
      setPhase("error");
      setError(err instanceof Error ? err.message : "Proof generation failed.");
      setState("error");
    }
  }, [preview]);

  const handleSend = useCallback(async () => {
    if (!proofResult || !preview) return;
    setSending(true);
    setSendStatus("idle");
    try {
      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grades: proofResult.grades,
          proof: proofResult.proof,
          publicInputs: proofResult.publicInputs,
          metadata: { filename: preview.file.name, rowCount: preview.result.rowCount },
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setSendStatus("sent");
    } catch {
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  }, [proofResult, preview]);

  const handleDownload = useCallback(() => {
    if (!proofResult || !filteredGrades) return;
    const payload = {
      grades: proofResult.grades,
      proof: proofResult.proof,
      publicInputs: proofResult.publicInputs,
      gradeDistribution: gradeDistribution(filteredGrades),
      totalBorrowers: filteredGrades.length,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vexor-proof-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [proofResult, filteredGrades]);

  return (
    <PinGate portal="client" storageKey="vexor-client-pin" title="Client Portal" subtitle="Enter your PIN to upload portfolios">
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Portfolio Grading</h1>
            <p className="text-sm text-gray-500 mt-1">Upload borrower scores, generate a zero-knowledge proof, receive graded tranches.</p>
          </div>
          {state !== "idle" && (
            <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
              Start over
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Privacy banner */}
        <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
          <svg className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p className="text-sm text-indigo-800 leading-relaxed">
            Your scores never leave this browser. The proof is generated locally using zero-knowledge cryptography.
          </p>
        </div>

        {/* Upload zone */}
        {(state === "idle" || state === "error") && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
              isDragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".csv" onChange={handleInput} className="hidden" />
            <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-gray-600 font-medium">Drop your CSV file here, or click to browse</p>
            <p className="text-sm text-gray-400 mt-2">Expects a bureau_score column. Max 100 borrowers, 10MB limit.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Preview */}
        {state === "preview" && preview && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{preview.file.name}</p>
                <p className="text-sm text-gray-500">{preview.result.rowCount} borrowers found</p>
              </div>
              {preview.result.warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{w}</p>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    {preview.columns.slice(0, 6).map(col => (
                      <th key={col} className={`px-4 py-2.5 text-left font-medium ${col === "bureau_score" ? "text-indigo-700 bg-indigo-50" : "text-gray-500"}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      {preview.columns.slice(0, 6).map(col => (
                        <td key={col} className={`px-4 py-2.5 ${col === "bureau_score" ? "font-semibold text-indigo-700" : "text-gray-600"}`}>
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleProve}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm cursor-pointer"
              >
                Generate Proof
              </button>
            </div>
          </div>
        )}

        {/* Proving state */}
        {state === "proving" && (
          <div className="bg-white border border-gray-200 rounded-xl px-6 py-8">
            <ProofStatus phase={phase} />
          </div>
        )}

        {/* Results */}
        {state === "results" && proofResult && filteredGrades && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Grade Distribution</h2>
                  <p className="text-sm text-gray-500">{filteredGrades.length} borrowers graded in {(proofResult.provingTimeMs / 1000).toFixed(1)}s</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm text-emerald-700 font-medium">Proof verified</span>
                </div>
              </div>
              <GradeChart grades={filteredGrades} showPricing={false} />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSend}
                disabled={sending || sendStatus === "sent"}
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  sendStatus === "sent"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                }`}
              >
                {sending ? "Sending..." : sendStatus === "sent" ? "Sent to Vexor" : sendStatus === "error" ? "Failed - retry?" : "Send to Vexor"}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 px-6 py-3 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Download JSON
              </button>
            </div>

            {sendStatus === "sent" && (
              <p className="text-sm text-emerald-600 text-center">Portfolio sent. Vexor admin can now verify the proof.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </PinGate>
  );
}
