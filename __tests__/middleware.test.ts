import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createSessionToken, cookieName } from "@/lib/session";

// Import middleware after setup
import { middleware } from "@/middleware";

function makeNextRequest(path: string, cookies?: Record<string, string>) {
  const url = `http://localhost:3000${path}`;
  const req = new NextRequest(url);
  if (cookies) {
    for (const [name, value] of Object.entries(cookies)) {
      req.cookies.set(name, value);
    }
  }
  return req;
}

describe("middleware - authentication gating", () => {
  it("returns 401 for /api/portfolios without session cookie", async () => {
    const req = makeNextRequest("/api/portfolios");
    const res = await middleware(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toContain("Authentication required");
  });

  it("returns 401 for /api/verify without session cookie", async () => {
    const req = makeNextRequest("/api/verify");
    const res = await middleware(req);
    expect(res.status).toBe(401);
  });

  it("does NOT block /api/auth (exempt from middleware)", async () => {
    const req = makeNextRequest("/api/auth");
    const res = await middleware(req);
    // NextResponse.next() returns 200
    expect(res.status).toBe(200);
    // Should not have error body
    const text = await res.text();
    expect(text).not.toContain("Authentication required");
  });

  it("passes through with valid client session cookie", async () => {
    const token = await createSessionToken("client");
    const req = makeNextRequest("/api/portfolios", {
      [cookieName("client")]: token,
    });
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it("passes through with valid admin session cookie", async () => {
    const token = await createSessionToken("admin");
    const req = makeNextRequest("/api/portfolios", {
      [cookieName("admin")]: token,
    });
    const res = await middleware(req);
    expect(res.status).toBe(200);
  });

  it("returns 401 with expired/invalid cookie", async () => {
    const req = makeNextRequest("/api/portfolios", {
      [cookieName("client")]: "client:0:invalidsig",
    });
    const res = await middleware(req);
    expect(res.status).toBe(401);
  });
});
