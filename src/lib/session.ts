// HMAC-SHA256 session tokens using Web Crypto API (Edge + Node.js compatible)

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production");
  }
  return "vexor-dev-secret-change-in-production";
}
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function hmacSign(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function cookieName(portal: string): string {
  return `vexor-session-${portal}`;
}

export async function createSessionToken(portal: string): Promise<string> {
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload = `${portal}:${exp}`;
  const sig = await hmacSign(payload);
  return `${payload}:${sig}`;
}

export async function validateSessionToken(token: string): Promise<{ valid: boolean; portal?: string }> {
  const parts = token.split(":");
  if (parts.length !== 3) return { valid: false };

  const [portal, expStr, sig] = parts;
  if (!portal || !["client", "admin"].includes(portal)) return { valid: false };

  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() > exp) return { valid: false };

  const payload = `${portal}:${expStr}`;
  const expected = await hmacSign(payload);

  // Constant-time comparison
  if (expected.length !== sig.length) return { valid: false };
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }

  return result === 0 ? { valid: true, portal } : { valid: false };
}
