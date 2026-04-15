import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock localStorage before importing the module
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });
// Ensure window is defined so client-store doesn't bail out
Object.defineProperty(globalThis, "window", { value: globalThis, writable: true });

import {
  getClientPortfolios,
  saveClientPortfolio,
  deleteClientPortfolio,
  markSentToVexor,
  type ClientPortfolio,
} from "@/lib/client-store";

function makePortfolio(id: string): ClientPortfolio {
  return {
    id,
    filename: `file-${id}.csv`,
    rowCount: 10,
    grades: Array(10).fill("A") as ClientPortfolio["grades"],
    proof: "abcd1234",
    publicInputs: Array(10).fill(4),
    provingTimeMs: 100,
    createdAt: new Date().toISOString(),
    sentToVexor: false,
  };
}

describe("client-store", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("getClientPortfolios returns empty array when nothing stored", () => {
    const result = getClientPortfolios();
    expect(result).toEqual([]);
  });

  it("saveClientPortfolio stores and retrieves a portfolio", () => {
    const p = makePortfolio("test-1");
    saveClientPortfolio(p);
    const stored = getClientPortfolios();
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe("test-1");
  });

  it("saveClientPortfolio prepends new portfolios", () => {
    saveClientPortfolio(makePortfolio("first"));
    saveClientPortfolio(makePortfolio("second"));
    const stored = getClientPortfolios();
    expect(stored[0].id).toBe("second");
    expect(stored[1].id).toBe("first");
  });

  it("saveClientPortfolio caps at 50 portfolios", () => {
    // Save 55 portfolios
    for (let i = 0; i < 55; i++) {
      saveClientPortfolio(makePortfolio(`p-${i}`));
    }
    const stored = getClientPortfolios();
    expect(stored.length).toBe(50);
    // Most recent should be first
    expect(stored[0].id).toBe("p-54");
    // Oldest beyond cap should be gone (p-0 through p-4)
    const ids = stored.map((p) => p.id);
    expect(ids).not.toContain("p-0");
    expect(ids).not.toContain("p-4");
  });

  it("deleteClientPortfolio removes a portfolio by id", () => {
    saveClientPortfolio(makePortfolio("keep"));
    saveClientPortfolio(makePortfolio("remove"));
    deleteClientPortfolio("remove");
    const stored = getClientPortfolios();
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe("keep");
  });

  it("markSentToVexor updates the portfolio", () => {
    saveClientPortfolio(makePortfolio("mark-me"));
    markSentToVexor("mark-me", "vexor-uuid-123");
    const stored = getClientPortfolios();
    expect(stored[0].sentToVexor).toBe(true);
    expect(stored[0].vexorId).toBe("vexor-uuid-123");
  });
});
