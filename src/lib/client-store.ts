import type { GradeLetter } from "./grades";

export interface ClientPortfolio {
  id: string;
  filename: string;
  rowCount: number;
  grades: GradeLetter[];
  proof: string;
  publicInputs: number[];
  provingTimeMs: number;
  createdAt: string;
  sentToVexor: boolean;
  vexorId?: string;
}

const STORAGE_KEY = "vexor-client-portfolios";
// VULN-15: Cap local storage to prevent unbounded growth
const MAX_PORTFOLIOS = 50;

export function getClientPortfolios(): ClientPortfolio[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClientPortfolio(portfolio: ClientPortfolio): void {
  const existing = getClientPortfolios();
  existing.unshift(portfolio);
  const capped = existing.slice(0, MAX_PORTFOLIOS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
}

export function deleteClientPortfolio(id: string): void {
  const existing = getClientPortfolios();
  const filtered = existing.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function markSentToVexor(id: string, vexorId: string): void {
  const existing = getClientPortfolios();
  const updated = existing.map((p) =>
    p.id === id ? { ...p, sentToVexor: true, vexorId } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
