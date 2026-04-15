"use client";

import { useState, useCallback, useRef, useEffect, type DragEvent, type ChangeEvent } from "react";
import { parseCSV, type ParseResult } from "@/lib/csv-parser";
import { generateProofInBrowser, type BrowserProofResult, type ProvingPhase } from "@/lib/prover";
import { gradeDistribution, filterSentinels, type GradeLetter } from "@/lib/grades";
import { GradeChart } from "@/components/GradeChart";
import { ProofStatus } from "@/components/ProofStatus";
import { PinGate } from "@/components/PinGate";
import { getClientPortfolios, saveClientPortfolio, markSentToVexor, deleteClientPortfolio, type ClientPortfolio } from "@/lib/client-store";

type PageState = "idle" | "preview" | "proving" | "results" | "error";
type Tab = "upload" | "history";

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
  const [tab, setTab] = useState<Tab>("upload");
  const [history, setHistory] = useState<ClientPortfolio[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [currentPortfolioId, setCurrentPortfolioId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory(getClientPortfolios());
  }, []);

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

      // Persist to client-side history
      const portfolioId = crypto.randomUUID();
      const clientPortfolio: ClientPortfolio = {
        id: portfolioId,
        filename: preview.file.name,
        rowCount: preview.result.rowCount,
        grades: result.grades,
        proof: result.proof,
        publicInputs: result.publicInputs,
        provingTimeMs: result.provingTimeMs,
        createdAt: new Date().toISOString(),
        sentToVexor: false,
      };
      saveClientPortfolio(clientPortfolio);
      setCurrentPortfolioId(portfolioId);
      setHistory(getClientPortfolios());

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
      const data = await res.json();
      if (currentPortfolioId) {
        markSentToVexor(currentPortfolioId, data.id);
        setHistory(getClientPortfolios());
      }
      setSendStatus("sent");
    } catch {
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  }, [proofResult, preview]);

  const handleDelete = useCallback((id: string) => {
    // Find the portfolio before deleting locally so we can get the server-side ID
    const portfolio = history.find((p) => p.id === id);
    deleteClientPortfolio(id);
    setHistory(getClientPortfolios());
    if (selectedHistoryId === id) setSelectedHistoryId(null);
    // Also delete from server if it was sent to Vexor
    if (portfolio?.vexorId) {
      fetch(`/api/portfolios?id=${portfolio.vexorId}`, { method: "DELETE" }).catch(() => {});
    }
  }, [selectedHistoryId, history]);

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
    <PinGate portal="client" title="Client Portal" subtitle="Enter your PIN to upload portfolios">
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

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 flex gap-6">
          <button
            onClick={() => setTab("upload")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === "upload" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            New Upload
          </button>
          <button
            onClick={() => setTab("history")}
            className={`py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === "history" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            My Portfolios {history.length > 0 && <span className="ml-1.5 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{history.length}</span>}
          </button>
        </div>
      </div>

      {/* History tab */}
      {tab === "history" && (
        <div className="max-w-4xl mx-auto px-6 py-10">
          {history.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              <p className="text-gray-500">No portfolios yet. Upload a CSV to generate your first proof.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Portfolio History</h2>
                {history.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedHistoryId(selectedHistoryId === p.id ? null : p.id)}
                    className={`w-full text-left bg-white rounded-xl border p-4 transition-all ${
                      selectedHistoryId === p.id
                        ? "border-indigo-300 ring-2 ring-indigo-100 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.filename}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-500">{p.rowCount} borrowers</span>
                        <span className="text-gray-500">{(p.provingTimeMs / 1000).toFixed(1)}s</span>
                        {p.sentToVexor ? (
                          <span className="text-emerald-600 font-medium">Sent</span>
                        ) : (
                          <span className="text-amber-600 font-medium">Local only</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Delete portfolio"
                        aria-label="Delete portfolio"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-2">
                {selectedHistoryId ? (
                  (() => {
                    const sel = history.find((p) => p.id === selectedHistoryId);
                    if (!sel) return null;
                    const filtered = filterSentinels(sel.grades, sel.publicInputs);
                    return (
                      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">{sel.filename}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                              {filtered.length} borrowers graded in {(sel.provingTimeMs / 1000).toFixed(1)}s
                            </p>
                          </div>
                          {sel.sentToVexor ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sent to Vexor
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Local only
                            </span>
                          )}
                        </div>
                        <GradeChart grades={filtered} />
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                    <p className="text-sm text-gray-500">Select a portfolio to view grade distribution.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "upload" && <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Privacy banner */}
        <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4">
          <svg className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
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
            <label htmlFor="csv-upload" className="sr-only">Upload CSV file</label>
            <input ref={fileRef} id="csv-upload" type="file" accept=".csv" onChange={handleInput} className="hidden" />
            <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
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
              <GradeChart grades={filteredGrades} />
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
      </div>}
    </div>
    </PinGate>
  );
}
