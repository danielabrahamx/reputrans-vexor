"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GradeChart } from "@/components/GradeChart";
import { filterSentinels, type GradeLetter } from "@/lib/grades";
import type { Portfolio } from "@/lib/types";
import { PinGate } from "@/components/PinGate";

type VerifyState = "idle" | "verifying" | "verified" | "failed";

export default function AdminPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [verifyStates, setVerifyStates] = useState<Record<string, VerifyState>>({});
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolios");
      if (res.ok) {
        const data: Portfolio[] = await res.json();
        setPortfolios(data);
        setVerifyStates((prev) => {
          const next = { ...prev };
          for (const p of data) {
            if (p.status === "verified") next[p.id] = "verified";
            else if (p.status === "failed") next[p.id] = "failed";
            else if (!next[p.id]) next[p.id] = "idle";
          }
          return next;
        });
      }
    } catch {
      // silent - will retry on next poll
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
    const interval = setInterval(fetchPortfolios, 5000);
    return () => clearInterval(interval);
  }, [fetchPortfolios]);

  const handleVerify = async (portfolio: Portfolio) => {
    setVerifyStates((prev) => ({ ...prev, [portfolio.id]: "verifying" }));
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: portfolio.proof,
          publicInputs: portfolio.publicInputs,
        }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setVerifyStates((prev) => ({ ...prev, [portfolio.id]: "verified" }));
        setPortfolios((prev) =>
          prev.map((p) => (p.id === portfolio.id ? { ...p, status: "verified" } : p))
        );
      } else {
        setVerifyStates((prev) => ({ ...prev, [portfolio.id]: "failed" }));
        setPortfolios((prev) =>
          prev.map((p) => (p.id === portfolio.id ? { ...p, status: "failed" } : p))
        );
      }
    } catch {
      setVerifyStates((prev) => ({ ...prev, [portfolio.id]: "failed" }));
      setPortfolios((prev) =>
        prev.map((p) => (p.id === portfolio.id ? { ...p, status: "failed" } : p))
      );
    }
  };

  const handleUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const { grades, proof, publicInputs, metadata } = json;
      if (!grades || !proof || !publicInputs) {
        setUploadError("Invalid JSON: missing grades, proof, or publicInputs.");
        return;
      }
      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grades,
          proof,
          publicInputs,
          metadata: { ...metadata, filename: file.name },
        }),
      });
      if (res.ok) {
        setUploadSuccess(true);
        await fetchPortfolios();
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        const err = await res.json();
        setUploadError(err.error || "Upload failed.");
      }
    } catch {
      setUploadError("Failed to parse JSON file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectedPortfolio = portfolios.find((p) => p.id === selected);

  const getFilteredGrades = (portfolio: Portfolio): GradeLetter[] => {
    return filterSentinels(portfolio.grades, portfolio.publicInputs);
  };

  const statusBadge = (status: Portfolio["status"], verifyState: VerifyState) => {
    const effective = verifyState === "verified" ? "verified" : verifyState === "failed" ? "failed" : status;
    switch (effective) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 ring-1 ring-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
    }
  };

  return (
    <PinGate portal="admin" storageKey="vexor-admin-pin" title="Vexor Admin" subtitle="Enter admin PIN to access the dashboard">
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Vexor Admin</h1>
            <p className="text-sm text-gray-500 mt-0.5">ZK-Graded NPL Portfolio Management</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {portfolios.length} portfolio{portfolios.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={fetchPortfolios}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver
              ? "border-indigo-400 bg-indigo-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="hidden"
            id="json-upload"
          />
          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <p className="mt-3 text-sm font-medium text-gray-700">
            Drag and drop a collector JSON file, or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2"
            >
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-400">Accepts .json files exported from the Vexor collector</p>
          {uploadError && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm rounded-lg ring-1 ring-red-200">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm rounded-lg ring-1 ring-emerald-200">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Portfolio uploaded successfully
            </div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="mt-4 text-sm text-gray-500">Loading portfolios...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && portfolios.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No portfolios received yet</h3>
            <p className="mt-2 text-sm text-gray-500">Waiting for collector to send data.</p>
          </div>
        )}

        {/* Portfolio grid + detail */}
        {!loading && portfolios.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio list */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Portfolios</h2>
              {portfolios.map((p) => {
                const vs = verifyStates[p.id] ?? "idle";
                const isSelected = selected === p.id;
                const filteredGrades = getFilteredGrades(p);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(isSelected ? null : p.id)}
                    className={`w-full text-left bg-white rounded-xl border p-4 transition-all ${
                      isSelected
                        ? "border-indigo-300 ring-2 ring-indigo-100 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {p.metadata.filename}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(p.metadata.uploadedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {statusBadge(p.status, vs)}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>{filteredGrades.length} borrowers</span>
                      <span className="text-gray-300">|</span>
                      <span>{p.metadata.rowCount} rows</span>
                    </div>
                    {vs !== "verified" && vs !== "verifying" && p.status !== "verified" && (
                      <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleVerify(p)}
                          className="w-full px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Verify Proof
                        </button>
                      </div>
                    )}
                    {vs === "verifying" && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                        Verifying proof...
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2">
              {selectedPortfolio ? (
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {selectedPortfolio.metadata.filename}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded{" "}
                        {new Date(selectedPortfolio.metadata.uploadedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {statusBadge(
                      selectedPortfolio.status,
                      verifyStates[selectedPortfolio.id] ?? "idle"
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {getFilteredGrades(selectedPortfolio).length}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Active Borrowers</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedPortfolio.metadata.rowCount}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Total Rows</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {selectedPortfolio.id.slice(0, 8)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Portfolio ID</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Grade Distribution</h3>
                    <GradeChart
                      grades={getFilteredGrades(selectedPortfolio)}
                      showPricing={true}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                  <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                  </svg>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">Select a portfolio</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Choose a portfolio from the list to view grade distribution and pricing comparison.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
    </PinGate>
  );
}
