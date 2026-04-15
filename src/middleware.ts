import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSessionToken, cookieName } from "@/lib/session";

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Only protect API routes, exempt /api/auth
    if (pathname === "/api/auth") {
      return NextResponse.next();
    }

    const clientToken = request.cookies.get(cookieName("client"))?.value;
    const adminToken = request.cookies.get(cookieName("admin"))?.value;

    let authenticated = false;

    if (clientToken) {
      const result = await validateSessionToken(clientToken);
      if (result.valid) authenticated = true;
    }

    if (!authenticated && adminToken) {
      const result = await validateSessionToken(adminToken);
      if (result.valid) authenticated = true;
    }

    if (!authenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  } catch {
    // Never block requests due to middleware errors
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/api/((?!auth).+)",
};
