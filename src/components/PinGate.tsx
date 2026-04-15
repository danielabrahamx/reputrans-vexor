"use client";

import { useState, useEffect } from "react";

interface PinGateProps {
  portal: "client" | "admin";
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function PinGate({ portal, title, subtitle, children }: PinGateProps) {
  const [input, setInput] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // VULN-11: Check httpOnly cookie via server call instead of sessionStorage
  useEffect(() => {
    fetch(`/api/auth?portal=${portal}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setAuthed(true);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [portal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: input, portal }),
      });
      const data = await res.json();

      if (data.authenticated) {
        // Cookie is set by the server response (httpOnly) - no client-side storage needed
        setAuthed(true);
      } else {
        setError(true);
        setInput("");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;
  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder="Enter PIN"
              autoFocus
              className={`w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 rounded-lg border ${
                error ? "border-red-300 bg-red-50" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {error && <p className="text-sm text-red-600">Incorrect PIN. Try again.</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Checking..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
