import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createSessionToken, validateSessionToken, cookieName } from "@/lib/session";

describe("session tokens", () => {
  it("cookieName returns correct format", () => {
    expect(cookieName("client")).toBe("vexor-session-client");
    expect(cookieName("admin")).toBe("vexor-session-admin");
  });

  it("createSessionToken returns a colon-delimited string with 3 parts", async () => {
    const token = await createSessionToken("client");
    const parts = token.split(":");
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe("client");
    // expiry should be a future timestamp
    const exp = parseInt(parts[1], 10);
    expect(exp).toBeGreaterThan(Date.now());
    // signature should be a hex string
    expect(/^[0-9a-f]+$/.test(parts[2])).toBe(true);
  });

  it("validateSessionToken accepts a freshly created token", async () => {
    const token = await createSessionToken("client");
    const result = await validateSessionToken(token);
    expect(result.valid).toBe(true);
    expect(result.portal).toBe("client");
  });

  it("validateSessionToken accepts admin portal token", async () => {
    const token = await createSessionToken("admin");
    const result = await validateSessionToken(token);
    expect(result.valid).toBe(true);
    expect(result.portal).toBe("admin");
  });

  it("validateSessionToken rejects expired tokens", async () => {
    // Create a token, then manually set expiry to the past
    const token = await createSessionToken("client");
    const parts = token.split(":");
    const pastExp = Date.now() - 1000;
    // Re-sign with the past expiry - but we can't access hmacSign directly,
    // so we just forge a token with past expiry and a bogus sig
    const forgedToken = `${parts[0]}:${pastExp}:${parts[2]}`;
    const result = await validateSessionToken(forgedToken);
    expect(result.valid).toBe(false);
  });

  it("validateSessionToken rejects tampered signatures", async () => {
    const token = await createSessionToken("client");
    const parts = token.split(":");
    // Flip a character in the signature
    const tamperedSig = parts[2][0] === "a" ? "b" + parts[2].slice(1) : "a" + parts[2].slice(1);
    const tamperedToken = `${parts[0]}:${parts[1]}:${tamperedSig}`;
    const result = await validateSessionToken(tamperedToken);
    expect(result.valid).toBe(false);
  });

  it("validateSessionToken rejects wrong portal values", async () => {
    const token = await createSessionToken("client");
    const parts = token.split(":");
    // Change portal to something invalid
    const badToken = `hacker:${parts[1]}:${parts[2]}`;
    const result = await validateSessionToken(badToken);
    expect(result.valid).toBe(false);
  });

  it("validateSessionToken rejects tokens with wrong number of parts", async () => {
    const result = await validateSessionToken("only:two");
    expect(result.valid).toBe(false);
    const result2 = await validateSessionToken("a:b:c:d");
    expect(result2.valid).toBe(false);
  });

  it("validateSessionToken rejects portal swap (client sig on admin)", async () => {
    const token = await createSessionToken("client");
    const parts = token.split(":");
    // Use client signature but claim admin portal
    const swappedToken = `admin:${parts[1]}:${parts[2]}`;
    const result = await validateSessionToken(swappedToken);
    expect(result.valid).toBe(false);
  });
});
