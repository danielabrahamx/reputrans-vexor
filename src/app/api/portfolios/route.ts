import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";
import { getRedis } from "@/lib/redis";
import { numericToGrade, type GradeLetter } from "@/lib/grades";
import type { Portfolio } from "@/lib/types";

const VALID_GRADES: Set<string> = new Set(["AA", "A", "B", "C", "D", "E"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { grades, proof, publicInputs, metadata } = body;

    if (!grades || !proof || !publicInputs) {
      return NextResponse.json({ error: "Missing grades, proof, or publicInputs" }, { status: 400 });
    }

    // VULN-10: Type validation
    if (!Array.isArray(grades) || !Array.isArray(publicInputs) || typeof proof !== "string") {
      return NextResponse.json(
        { error: "Invalid input types: grades and publicInputs must be arrays, proof must be a string" },
        { status: 400 }
      );
    }

    // VULN-04: Array length validation
    if (publicInputs.length !== 100 || grades.length !== 100) {
      return NextResponse.json(
        { error: "grades and publicInputs must each be arrays of exactly 100 elements" },
        { status: 400 }
      );
    }

    // VULN-12: Proof size cap (real proofs are ~2-5KB hex, cap at 100KB)
    if (proof.length > 100000) {
      return NextResponse.json({ error: "Proof exceeds maximum size" }, { status: 400 });
    }

    // VULN-10: Hex format validation
    if (!/^[0-9a-f]+$/i.test(proof)) {
      return NextResponse.json({ error: "Proof must be a valid hex string" }, { status: 400 });
    }

    // VULN-10: Grade values validation
    for (const g of grades) {
      if (typeof g !== "string" || !VALID_GRADES.has(g)) {
        return NextResponse.json({ error: `Invalid grade value: ${g}` }, { status: 400 });
      }
    }

    // VULN-10: publicInputs values must be integers 0-5
    for (const v of publicInputs) {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0 || n > 5) {
        return NextResponse.json({ error: "publicInputs values must be integers 0-5" }, { status: 400 });
      }
    }

    // SECURITY: Verify submitted grades match the proof's publicInputs
    const provenGrades: GradeLetter[] = publicInputs.map((v: string | number) => numericToGrade(Number(v)));
    const submittedGrades = grades as GradeLetter[];

    for (let i = 0; i < provenGrades.length; i++) {
      if (provenGrades[i] !== submittedGrades[i]) {
        return NextResponse.json(
          { error: `Grade mismatch at index ${i}: submitted ${submittedGrades[i]} but proof shows ${provenGrades[i]}` },
          { status: 400 }
        );
      }
    }

    const redis = getRedis();

    // VULN-07: Proof deduplication - atomic check+set via SADD return value
    const proofHash = createHash("sha256").update(proof).digest("hex");
    const added = await redis.sadd("proof:hashes", proofHash);
    if (added === 0) {
      return NextResponse.json({ error: "This proof has already been submitted" }, { status: 409 });
    }

    const id = uuidv4();

    // VULN-09: Sanitize filename (strip HTML tags, cap length)
    const rawFilename = metadata?.filename ?? "unknown";
    const safeFilename = typeof rawFilename === "string"
      ? rawFilename.replace(/<[^>]*>/g, "").slice(0, 255)
      : "unknown";

    const portfolio: Portfolio = {
      id,
      grades: provenGrades,
      proof,
      publicInputs,
      metadata: {
        filename: safeFilename,
        rowCount: typeof metadata?.rowCount === "number" ? Math.min(metadata.rowCount, 10000) : grades.length,
        uploadedAt: new Date().toISOString(),
      },
      status: "pending_verification",
    };

    await redis.set(`portfolio:${id}`, JSON.stringify(portfolio));
    await redis.lpush("portfolio:index", id);
    await redis.ltrim("portfolio:index", 0, 99);

    return NextResponse.json({ id, status: portfolio.status });
  } catch (err) {
    console.error("POST /api/portfolios error:", err);
    return NextResponse.json(
      { error: "Failed to store portfolio", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing portfolio id" }, { status: 400 });
    }

    // UUID validation (same regex as verify route)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ error: "Invalid portfolio id format" }, { status: 400 });
    }

    const redis = getRedis();
    await redis.del(`portfolio:${id}`);
    await redis.lrem("portfolio:index", 0, id);

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const redis = getRedis();
    const ids = await redis.lrange("portfolio:index", 0, 19);
    const portfolios: Portfolio[] = [];

    for (const id of ids) {
      const raw = await redis.get(`portfolio:${id}`);
      if (raw) portfolios.push(JSON.parse(raw));
    }

    return NextResponse.json(portfolios);
  } catch {
    return NextResponse.json([]);
  }
}
