"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { GRADE_COLORS, type GradeLetter, gradeDistribution } from "@/lib/grades";

interface GradeChartProps {
  grades: GradeLetter[];
}

export function GradeChart({ grades }: GradeChartProps) {
  const dist = gradeDistribution(grades);
  const data = (Object.entries(dist) as [GradeLetter, number][]).map(([grade, count]) => ({
    grade,
    count,
    color: GRADE_COLORS[grade],
  }));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase mb-4">
          Grade Distribution
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <XAxis
                dataKey="grade"
                tick={{ fontSize: 13, fontWeight: 600, fill: "#374151" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                formatter={(val) => [`${val} borrowers`]}
                labelFormatter={(label) => `Grade ${label}`}
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                  fontSize: "0.8125rem",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.grade} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
        {data.map(({ grade, count, color }) => (
          <div
            key={grade}
            className="text-center px-3 py-2.5 rounded-xl border border-gray-100 bg-white shadow-sm transition-colors duration-150 hover:border-gray-200"
          >
            <div className="text-xl font-semibold tracking-tight" style={{ color }}>{count}</div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">Grade {grade}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
