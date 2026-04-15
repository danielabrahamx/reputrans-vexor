import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import { numericToGrade, type GradeLetter } from "@/lib/grades";
import type { Portfolio } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { grades, proof, publicInputs, metadata } = body;

    if (!grades || !proof || !publicInputs) {
      return NextResponse.json({ error: "Missing grades, proof, or publicInputs" }, { status: 400 });
    }

    // SECURITY: Verify submitted grades match the proof's publicInputs
    // publicInputs contains the grade values that are cryptographically bound to the proof
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

    const id = uuidv4();
    const portfolio: Portfolio = {
      id,
      grades: provenGrades,
      proof,
      publicInputs,
      metadata: {
        filename: metadata?.filename ?? "unknown",
        rowCount: metadata?.rowCount ?? grades.length,
        uploadedAt: new Date().toISOString(),
      },
      status: "pending_verification",
    };

    await kv.set(`portfolio:${id}`, JSON.stringify(portfolio));

    // Add to portfolio index
    const index: string[] = (await kv.get("portfolio:index")) ?? [];
    index.unshift(id);
    await kv.set("portfolio:index", JSON.stringify(index));

    return NextResponse.json({ id, status: portfolio.status });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to store portfolio: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const index: string[] = (await kv.get("portfolio:index")) ?? [];
    const portfolios: Portfolio[] = [];

    for (const id of index.slice(0, 20)) {
      const raw = await kv.get(`portfolio:${id}`);
      if (raw) {
        portfolios.push(typeof raw === "string" ? JSON.parse(raw) : raw as Portfolio);
      }
    }

    return NextResponse.json(portfolios);
  } catch {
    return NextResponse.json([]);
  }
}
