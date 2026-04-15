export type GradeLetter = "AA" | "A" | "B" | "C" | "D" | "E";

export const GRADE_MAP: Record<number, GradeLetter> = {
  5: "AA",
  4: "A",
  3: "B",
  2: "C",
  1: "D",
  0: "E",
};

export const GRADE_THRESHOLDS: { min: number; max: number; grade: GradeLetter; value: number }[] = [
  { min: 900, max: 1000, grade: "AA", value: 5 },
  { min: 800, max: 899, grade: "A", value: 4 },
  { min: 650, max: 799, grade: "B", value: 3 },
  { min: 500, max: 649, grade: "C", value: 2 },
  { min: 300, max: 499, grade: "D", value: 1 },
  { min: 0, max: 299, grade: "E", value: 0 },
];

export const GRADE_COLORS: Record<GradeLetter, string> = {
  AA: "#059669", // emerald-600
  A: "#10b981",  // emerald-500
  B: "#3b82f6",  // blue-500
  C: "#f59e0b",  // amber-500
  D: "#f97316",  // orange-500
  E: "#ef4444",  // red-500
};

// Illustrative pricing for portfolio value comparison (cents per dollar of debt)
export const GRADE_PRICING: Record<GradeLetter, number> = {
  AA: 12,
  A: 10,
  B: 7,
  C: 5,
  D: 3,
  E: 1,
};

export const BULK_PRICING = 4; // cents per dollar, industry average

export function numericToGrade(value: number): GradeLetter {
  return GRADE_MAP[value] ?? "E";
}

export function scoreToGrade(score: number): GradeLetter {
  if (score >= 900) return "AA";
  if (score >= 800) return "A";
  if (score >= 650) return "B";
  if (score >= 500) return "C";
  if (score >= 300) return "D";
  return "E";
}

export function gradeDistribution(grades: GradeLetter[]): Record<GradeLetter, number> {
  const dist: Record<GradeLetter, number> = { AA: 0, A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const g of grades) {
    dist[g]++;
  }
  return dist;
}

export function portfolioValue(grades: GradeLetter[]): { graded: number; bulk: number; delta: number } {
  const graded = grades.reduce((sum, g) => sum + GRADE_PRICING[g], 0);
  const bulk = grades.length * BULK_PRICING;
  return { graded, bulk, delta: graded - bulk };
}

// Filter sentinel-padded entries (score 0 padded to fill 100-element array)
export function filterSentinels(grades: GradeLetter[], publicInputs: number[]): GradeLetter[] {
  return grades.filter((_, i) => publicInputs[i] !== 0 || grades[i] !== "E");
}
