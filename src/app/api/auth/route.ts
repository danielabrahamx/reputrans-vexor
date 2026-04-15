import { NextResponse } from "next/server";

const PINS: Record<string, string | undefined> = {
  client: process.env.CLIENT_PIN,
  admin: process.env.ADMIN_PIN,
};

export async function POST(request: Request) {
  try {
    const { pin, portal } = await request.json();

    if (!pin || !portal || !PINS[portal]) {
      return NextResponse.json({ authenticated: false }, { status: 400 });
    }

    const authenticated = pin === PINS[portal];
    return NextResponse.json({ authenticated });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 400 });
  }
}
