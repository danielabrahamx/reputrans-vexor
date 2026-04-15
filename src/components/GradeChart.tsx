"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { GRADE_COLORS, type GradeLetter, gradeDistribution, portfolioValue, BULK_PRICING } from "@/lib/grades";

interface GradeChartProps {
  grades: GradeLetter[];
  showPricing?: boolean;
}

export function GradeChart({ grades, showPricing = false }: GradeChartProps) {
  const dist = gradeDistribution(grades);
  const data = (Object.entries(dist) as [GradeLetter, number][]).map(([grade, count]) => ({
    grade,
    count,
    color: GRADE_COLORS[grade],
  }));

  const value = showPricing ? portfolioValue(grades) : null;

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis dataKey="grade" tick={{ fontSize: 14, fontWeight: 600 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(val) => [`${val} borrowers`]}
              labelFormatter={(label) => `Grade ${label}`}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.grade} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {data.map(({ grade, count, color }) => (
          <div key={grade} className="text-center p-3 rounded-lg bg-gray-50">
            <div className="text-2xl font-bold" style={{ color }}>{count}</div>
            <div className="text-xs text-gray-500 mt-1">Grade {grade}</div>
          </div>
        ))}
      </div>

      {/* Portfolio value comparison */}
      {showPricing && value && (
        <div className="bg-gray-50 rounded-xl p-6 mt-4">
          <h3 className="font-semibold text-gray-900 mb-4">Portfolio Value Comparison</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">Bulk Pricing</div>
              <div className="text-2xl font-bold text-gray-400">{BULK_PRICING}c/dollar</div>
              <div className="text-lg font-semibold text-gray-500 mt-1">{value.bulk}c total</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Graded Pricing</div>
              <div className="text-2xl font-bold text-emerald-600">Variable</div>
              <div className="text-lg font-semibold text-emerald-600 mt-1">{value.graded}c total</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Value Unlocked</div>
              <div className="text-2xl font-bold text-indigo-600">+{((value.delta / value.bulk) * 100).toFixed(0)}%</div>
              <div className="text-lg font-semibold text-indigo-600 mt-1">+{value.delta}c</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
