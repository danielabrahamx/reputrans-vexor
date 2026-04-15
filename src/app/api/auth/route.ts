import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSessionToken, validateSessionToken, cookieName } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const PINS: Record<string, string | undefined> = {
  client: process.env.CLIENT_PIN,
  admin: process.env.ADMIN_PIN,
};

// VULN-13: Constant-time PIN comparison (prevents timing side-channel)
function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a.padEnd(64, "\0"));
  const bufB = Buffer.from(b.padEnd(64, "\0"));
  return timingSafeEqual(bufA, bufB);
}

// GET: Check if current session cookie is valid (used by PinGate on mount)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const portal = url.searchParams.get("portal");

    if (!portal || !["client", "admin"].includes(portal)) {
      return NextResponse.json({ authenticated: false });
    }

    const cookieHeader = request.headers.get("cookie") || "";
    const name = cookieName(portal);
    const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
    const token = match?.[1] ? decodeURIComponent(match[1]) : undefined;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const result = await validateSessionToken(token);
    return NextResponse.json({
      authenticated: result.valid && result.portal === portal,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

// POST: Validate PIN and set httpOnly session cookie
export async function POST(request: Request) {
  try {
    // VULN-05: Rate limiting (5 attempts per minute per IP)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRateLimit(`auth:${ip}`, 5, 60, true);
    if (!rl.allowed) {
      return NextResponse.json(
        { authenticated: false, error: "Too many attempts. Try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { pin, portal } = await request.json();

    if (!pin || typeof pin !== "string" || !portal || !PINS[portal]) {
      return NextResponse.json({ authenticated: false }, { status: 400 });
    }

    const expected = PINS[portal]!;
    const authenticated = timingSafeCompare(pin, expected);

    if (!authenticated) {
      return NextResponse.json({ authenticated: false });
    }

    // VULN-11: Set httpOnly cookie instead of relying on sessionStorage
    const token = await createSessionToken(portal);
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(cookieName(portal), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 400 });
  }
}
