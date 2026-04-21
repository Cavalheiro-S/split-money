"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

interface GoalProgressGaugeProps {
  currentAmount: number;
  targetAmount: number;
}

function getColor(pct: number) {
  if (pct >= 100) return "#10b981";
  if (pct >= 50) return "#f59e0b";
  return "#3b82f6";
}

export function GoalProgressGauge({ currentAmount, targetAmount }: GoalProgressGaugeProps) {
  const pct = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
  const color = getColor(pct);

  const data = [
    { value: 100, fill: "#e5e7eb" },
    { value: pct, fill: color },
  ];

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={8}
        >
          <RadialBar dataKey="value" cornerRadius={4} background={false} />
        </RadialBarChart>
      </ResponsiveContainer>
      <span className="absolute text-sm font-semibold" style={{ color }}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}
