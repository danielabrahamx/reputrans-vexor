import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { getRedis } from "@/lib/redis";
import { checkRateLimit } from "@/lib/rate-limit";
import type { Portfolio } from "@/lib/types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// VULN-03: Cache Barretenberg backend across requests (expensive WASM instantiation)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let backendPromise: Promise<any> | null = null;

async function getVerifyBackend() {
  if (!backendPromise) {
    backendPromise = (async () => {
      try {
        const { BarretenbergBackend } = await import("@noir-lang/backend_barretenberg");
        const circuitPath = join(process.cwd(), "public", "circuits", "batch_grade.json");
        const circuitJson = await readFile(circuitPath, "utf-8");
        const circuit = JSON.parse(circuitJson);
        return new BarretenbergBackend(circuit);
      } catch (err) {
        backendPromise = null; // Allow retry on next request
        throw err;
      }
    })();
  }
  return backendPromise;
}

export async function POST(request: Request) {
  try {
    // VULN-03: Rate limiting (10 requests per minute per IP)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await checkRateLimit(`verify:${ip}`, 10, 60);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const { proof, publicInputs, portfolioId } = await request.json();

    if (!proof || !publicInputs) {
      return NextResponse.json({ error: "Missing proof or publicInputs" }, { status: 400 });
    }

    // VULN-10: Type validation
    if (typeof proof !== "string" || !Array.isArray(publicInputs)) {
      return NextResponse.json({ error: "Invalid input types" }, { status: 400 });
    }

    // Bounds checks (mirror portfolios route)
    if (proof.length > 100000) {
      return NextResponse.json({ error: "Proof exceeds maximum size" }, { status: 400 });
    }
    if (publicInputs.length > 100) {
      return NextResponse.json({ error: "publicInputs exceeds maximum length" }, { status: 400 });
    }

    // VULN-08: UUID validation on portfolioId
    if (portfolioId !== undefined && (typeof portfolioId !== "string" || !UUID_REGEX.test(portfolioId))) {
      return NextResponse.json({ error: "Invalid portfolioId format" }, { status: 400 });
    }

    // Use cached backend instance to avoid re-instantiating WASM per request
    const backend = await getVerifyBackend();

    // Barretenberg expects publicInputs as 0x-prefixed 32-byte hex field elements.
    // Our app stores them as plain numbers, so convert before verification.
    const formattedInputs = publicInputs.map((v: string | number) => {
      if (typeof v === "string" && v.startsWith("0x")) return v;
      return "0x" + BigInt(Number(v)).toString(16).padStart(64, "0");
    });

    const proofData = {
      proof: new Uint8Array(Buffer.from(proof, "hex")),
      publicInputs: formattedInputs,
    };

    const verified = await backend.verifyProof(proofData);

    // Persist verification result to Redis if portfolioId provided
    if (portfolioId) {
      try {
        const redis = getRedis();
        const raw = await redis.get(`portfolio:${portfolioId}`);
        if (raw) {
          const portfolio: Portfolio = JSON.parse(raw);
          portfolio.status = verified ? "verified" : "failed";
          await redis.set(`portfolio:${portfolioId}`, JSON.stringify(portfolio));
        }
      } catch {
        // Status persistence is best-effort; verification result still returned
      }
    }

    return NextResponse.json({ verified });
  } catch (err) {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 400 }
    );
  }
}
