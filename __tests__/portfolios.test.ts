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
      if (sets[key].has(member)) return 0;
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
    _store: store,
    _sets: sets,
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

import { POST, GET } from "@/app/api/portfolios/route";

// Helper: build a valid portfolio payload
function validPayload(overrides?: Record<string, unknown>) {
  // 100 grades mapping to publicInputs via numericToGrade:
  // value 5 -> AA, 4 -> A, 3 -> B, 2 -> C, 1 -> D, 0 -> E
  const publicInputs = Array(100).fill(4); // all map to "A"
  const grades = Array(100).fill("A");
  const proof = "abcdef1234567890".repeat(10); // valid hex

  return {
    grades,
    proof,
    publicInputs,
    metadata: { filename: "test.csv", rowCount: 100 },
    ...overrides,
  };
}

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/portfolios", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("portfolios route - POST validation", () => {
  beforeEach(() => {
    mockRedis._reset();
  });

  it("returns 400 for non-array grades", async () => {
    const req = makeRequest(validPayload({ grades: "not-an-array" }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Invalid input types");
  });

  it("returns 400 for non-string proof", async () => {
    const req = makeRequest(validPayload({ proof: 12345 }));
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-array publicInputs", async () => {
    const req = makeRequest(validPayload({ publicInputs: "bad" }));
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when grades.length !== 100", async () => {
    const req = makeRequest(validPayload({ grades: Array(50).fill("A") }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("exactly 100");
  });

  it("returns 400 when publicInputs.length !== 100", async () => {
    const req = makeRequest(validPayload({ publicInputs: Array(50).fill(4) }));
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when proof exceeds 100KB", async () => {
    const bigProof = "a".repeat(100001); // valid hex char, just too long
    const req = makeRequest(validPayload({ proof: bigProof }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("maximum size");
  });

  it("returns 400 for non-hex proof", async () => {
    const req = makeRequest(validPayload({ proof: "xyz_not_hex!" }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("hex");
  });

  it("returns 400 for invalid grade value", async () => {
    const badGrades = Array(100).fill("A");
    badGrades[0] = "X"; // invalid
    const req = makeRequest(validPayload({ grades: badGrades }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Invalid grade value");
  });

  it("returns 400 for publicInputs value > 5", async () => {
    const badInputs = Array(100).fill(4);
    badInputs[0] = 6;
    const req = makeRequest(validPayload({ publicInputs: badInputs }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("integers 0-5");
  });

  it("returns 400 for negative publicInputs value", async () => {
    const badInputs = Array(100).fill(4);
    badInputs[0] = -1;
    const req = makeRequest(validPayload({ publicInputs: badInputs }));
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for grade mismatch (grades don't match publicInputs)", async () => {
    // publicInputs all 4 -> should map to "A", but grades say "B"
    const mismatchedGrades = Array(100).fill("B");
    const req = makeRequest(validPayload({ grades: mismatchedGrades }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Grade mismatch");
  });
});

describe("portfolios route - POST success + deduplication", () => {
  beforeEach(() => {
    mockRedis._reset();
  });

  it("stores portfolio and returns id with valid data", async () => {
    const req = makeRequest(validPayload());
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBeDefined();
    expect(json.status).toBe("pending_verification");

    // Verify Redis was called
    expect(mockRedis.set).toHaveBeenCalled();
    expect(mockRedis.lpush).toHaveBeenCalled();
    expect(mockRedis.sadd).toHaveBeenCalled();
  });

  it("returns 409 for duplicate proof", async () => {
    const payload = validPayload();
    const req1 = makeRequest(payload);
    const res1 = await POST(req1);
    expect(res1.status).toBe(200);

    // Submit same proof again
    const req2 = makeRequest(payload);
    const res2 = await POST(req2);
    expect(res2.status).toBe(409);
    const json = await res2.json();
    expect(json.error).toContain("already been submitted");
  });
});

describe("portfolios route - filename sanitization", () => {
  beforeEach(() => {
    mockRedis._reset();
    vi.clearAllMocks();
  });

  it("strips HTML tags from filename", async () => {
    const payload = validPayload();
    payload.metadata = { filename: '<script>alert("xss")</script>evil.csv', rowCount: 100 };
    const req = makeRequest(payload);
    const res = await POST(req);
    expect(res.status).toBe(200);

    // Retrieve stored portfolio from mock Redis
    const storedCall = mockRedis.set.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].startsWith("portfolio:")
    );
    expect(storedCall).toBeDefined();
    const stored = JSON.parse(storedCall![1] as string);
    // After stripping <script>...</script> tags, we get: alert("xss")evil.csv
    expect(stored.metadata.filename).not.toContain("<script>");
    expect(stored.metadata.filename).not.toContain("</script>");
    expect(stored.metadata.filename).toContain("evil.csv");
  });

  it("caps filename at 255 characters", async () => {
    const longName = "x".repeat(500) + ".csv";
    const payload = validPayload();
    payload.metadata = { filename: longName, rowCount: 100 };
    const req = makeRequest(payload);
    const res = await POST(req);
    expect(res.status).toBe(200);

    const storedCall = mockRedis.set.mock.calls.find(
      (call) => typeof call[0] === "string" && call[0].startsWith("portfolio:")
    );
    const stored = JSON.parse(storedCall![1] as string);
    expect(stored.metadata.filename.length).toBeLessThanOrEqual(255);
  });
});

describe("portfolios route - GET", () => {
  beforeEach(() => {
    mockRedis._reset();
  });

  it("returns stored portfolios", async () => {
    // First store one
    const req = makeRequest(validPayload());
    await POST(req);

    const getReq = new Request("http://localhost:3000/api/portfolios", { method: "GET" });
    const res = await GET();
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThanOrEqual(1);
  });
});
