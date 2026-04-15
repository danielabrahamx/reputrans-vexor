import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted runs BEFORE vi.mock factories - set env vars and create mock here
const mockRedis = vi.hoisted(() => {
  process.env.CLIENT_PIN = "1234";
  process.env.ADMIN_PIN = "admin5678";

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
    _ttls: ttls,
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

import { GET, POST } from "@/app/api/auth/route";

function makeRequest(method: string, body?: object, opts?: { cookie?: string; portal?: string; ip?: string }) {
  const url = `http://localhost:3000/api/auth${opts?.portal ? `?portal=${opts.portal}` : ""}`;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-forwarded-for": opts?.ip || "127.0.0.1",
  };
  if (opts?.cookie) {
    headers["cookie"] = opts.cookie;
  }
  if (method === "GET") {
    return new Request(url, { method, headers });
  }
  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("auth route - POST", () => {
  beforeEach(() => {
    mockRedis._reset();
  });

  it("returns { authenticated: true } and sets cookie for correct PIN", async () => {
    const req = makeRequest("POST", { pin: "1234", portal: "client" });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.authenticated).toBe(true);
    // Check that a Set-Cookie header is present
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("vexor-session-client");
    expect(setCookie).toContain("HttpOnly");
  });

  it("returns { authenticated: false } for wrong PIN", async () => {
    const req = makeRequest("POST", { pin: "wrong", portal: "client" });
    const res = await POST(req);
    const json = await res.json();
    expect(json.authenticated).toBe(false);
  });

  it("returns 400 for missing pin", async () => {
    const req = makeRequest("POST", { portal: "client" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing portal", async () => {
    const req = makeRequest("POST", { pin: "1234" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid portal", async () => {
    const req = makeRequest("POST", { pin: "1234", portal: "hacker" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rate limits after 5 attempts (6th request gets 429)", async () => {
    // Use a unique IP for this test to avoid cross-test interference
    const ip = "10.0.0.99";
    for (let i = 0; i < 5; i++) {
      const req = makeRequest("POST", { pin: "wrong", portal: "client" }, { ip });
      const res = await POST(req);
      expect(res.status).not.toBe(429);
    }
    // 6th request should be rate limited
    const req = makeRequest("POST", { pin: "wrong", portal: "client" }, { ip });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toContain("Too many attempts");
  });
});

describe("auth route - GET", () => {
  beforeEach(() => {
    mockRedis._reset();
  });

  it("returns { authenticated: true } with valid cookie", async () => {
    // First, POST to get a valid session cookie
    const postReq = makeRequest("POST", { pin: "1234", portal: "client" });
    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const setCookie = postRes.headers.get("set-cookie") || "";
    // Extract the cookie value
    const cookieMatch = setCookie.match(/vexor-session-client=([^;]+)/);
    expect(cookieMatch).toBeTruthy();
    const cookieValue = cookieMatch![1];

    const getReq = makeRequest("GET", undefined, {
      portal: "client",
      cookie: `vexor-session-client=${cookieValue}`,
    });
    const getRes = await GET(getReq);
    const json = await getRes.json();
    expect(json.authenticated).toBe(true);
  });

  it("returns { authenticated: false } without cookie", async () => {
    const req = makeRequest("GET", undefined, { portal: "client" });
    const res = await GET(req);
    const json = await res.json();
    expect(json.authenticated).toBe(false);
  });

  it("returns { authenticated: false } with no portal param", async () => {
    const url = "http://localhost:3000/api/auth";
    const req = new Request(url, { method: "GET" });
    const res = await GET(req);
    const json = await res.json();
    expect(json.authenticated).toBe(false);
  });
});
