import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted runs BEFORE vi.mock factories
const mockRedis = vi.hoisted(() => {
  const store: Record<string, string> = {};
  const ttls: Record<string, number> = {};
  const sets: Record<string, Set<string>> = {};
  const lists: Record<string, string[]> = {};

  return {
    get: vi.fn(async (key: string) => store[key] ?? null),
    set: vi.fn(async (key: string, value: string) => { store[key] = value; return "OK"; }),
    incr: vi.fn(async (key: string) => {
      const current = parseInt(store[key] || "0", 10);
      store[key] = String(current + 1);
      return current + 1;
    }),
    expire: vi.fn(async (key: string, seconds: number) => { ttls[key] = seconds; return 1; }),
    ttl: vi.fn(async (key: string) => ttls[key] ?? -1),
    sismember: vi.fn(async (key: string, member: string) => sets[key]?.has(member) ? 1 : 0),
    sadd: vi.fn(async (key: string, member: string) => {
      if (!sets[key]) sets[key] = new Set();
      sets[key].add(member);
      return 1;
    }),
    lpush: vi.fn(async (key: string, value: string) => {
      if (!lists[key]) lists[key] = [];
      lists[key].unshift(value);
      return lists[key].length;
    }),
    ltrim: vi.fn(async () => "OK"),
    lrange: vi.fn(async (key: string, start: number, stop: number) => {
      if (!lists[key]) return [];
      return lists[key].slice(start, stop + 1);
    }),
    pipeline: vi.fn(() => {
      const commands: Array<{ method: string; args: unknown[] }> = [];
      const p = {
        incr: (...args: unknown[]) => { commands.push({ method: "incr", args }); return p; },
        expire: (...args: unknown[]) => { commands.push({ method: "expire", args }); return p; },
        ttl: (...args: unknown[]) => { commands.push({ method: "ttl", args }); return p; },
        exec: vi.fn(async () => {
          const results: Array<[null, unknown]> = [];
          for (const cmd of commands) {
            if (cmd.method === "incr") {
              const key = cmd.args[0] as string;
              const current = parseInt(store[key] || "0", 10);
              store[key] = String(current + 1);
              results.push([null, current + 1]);
            } else if (cmd.method === "expire") {
              const key = cmd.args[0] as string;
              ttls[key] = cmd.args[1] as number;
              results.push([null, 1]);
            } else if (cmd.method === "ttl") {
              const key = cmd.args[0] as string;
              results.push([null, ttls[key] ?? -1]);
            }
          }
          return results;
        }),
      };
      return p;
    }),
    _store: store,
    _reset: () => {
      Object.keys(store).forEach((k) => delete store[k]);
      Object.keys(ttls).forEach((k) => delete ttls[k]);
      Object.keys(sets).forEach((k) => delete sets[k]);
      Object.keys(lists).forEach((k) => delete lists[k]);
    },
  };
});

vi.mock("@/lib/redis", () => ({
  getRedis: () => mockRedis,
}));

// Mock the Barretenberg backend (expensive WASM - not needed for validation tests)
vi.mock("@noir-lang/backend_barretenberg", () => ({
  BarretenbergBackend: vi.fn().mockImplementation(() => ({
    verifyProof: vi.fn().mockResolvedValue(true),
  })),
}));

// Mock fs/promises for circuit loading
vi.mock("fs/promises", () => ({
  readFile: vi.fn().mockResolvedValue(JSON.stringify({ bytecode: "mock", abi: {} })),
}));

import { POST } from "@/app/api/verify/route";

function makeRequest(body: unknown, ip = "127.0.0.1") {
  return new Request("http://localhost:3000/api/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("verify route - input validation", () => {
  beforeEach(() => {
    mockRedis._reset();
  });

  it("returns 400 for non-string proof", async () => {
    const req = makeRequest({ proof: 123, publicInputs: [1, 2, 3] });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Invalid input types");
  });

  it("returns 400 for non-array publicInputs", async () => {
    const req = makeRequest({ proof: "abcd", publicInputs: "not-array" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing proof", async () => {
    const req = makeRequest({ publicInputs: [1, 2, 3] });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Missing");
  });

  it("returns 400 for missing publicInputs", async () => {
    const req = makeRequest({ proof: "abcd" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid UUID portfolioId", async () => {
    const req = makeRequest({
      proof: "abcd1234",
      publicInputs: [1, 2, 3],
      portfolioId: "not-a-uuid",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Invalid portfolioId");
  });

  it("accepts valid UUID portfolioId", async () => {
    const req = makeRequest({
      proof: "abcd1234",
      publicInputs: [1, 2, 3],
      portfolioId: "550e8400-e29b-41d4-a716-446655440000",
    });
    const res = await POST(req);
    // Should not be 400 for invalid UUID - might be 200 (mock backend verifies)
    expect(res.status).toBe(200);
  });

  it("accepts request without portfolioId", async () => {
    const req = makeRequest({
      proof: "abcd1234",
      publicInputs: [1, 2, 3],
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.verified).toBe(true);
  });
});

describe("verify route - rate limiting", () => {
  beforeEach(() => {
    mockRedis._reset();
  });

  it("rate limits after 10 requests (11th gets 429)", async () => {
    const ip = "10.0.0.50";

    for (let i = 0; i < 10; i++) {
      const req = makeRequest(
        { proof: "abcd1234", publicInputs: [1, 2] },
        ip
      );
      const res = await POST(req);
      expect(res.status).not.toBe(429);
    }

    // 11th request should be rate limited
    const req = makeRequest(
      { proof: "abcd1234", publicInputs: [1, 2] },
      ip
    );
    const res = await POST(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toContain("Rate limit");
  });
});
