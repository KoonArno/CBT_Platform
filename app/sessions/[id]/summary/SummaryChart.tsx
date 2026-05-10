"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface SummaryChartProps {
  data: Array<{ name: string; value: number }>;
}

export function SummaryChart({ data }: SummaryChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        data={data}
        outerRadius="58%"
        margin={{ top: 18, right: 24, bottom: 18, left: 24 }}
      >
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fill: "var(--muted-foreground)", fontSize: 8 }}
        />
        <Radar
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.25}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
