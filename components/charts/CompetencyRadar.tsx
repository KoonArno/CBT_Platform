"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface Datum {
  subject: string;
  current: number;
  previous: number;
  fullMark: number;
}

export function CompetencyRadar({
  data,
  height = 220,
  labels = { current: "Current", previous: "Previous" },
}: {
  data: ReadonlyArray<Datum>;
  height?: number;
  labels?: { current: string; previous: string };
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={[...data]}>
        <PolarGrid stroke="#C0CAD8" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B7A9A", fontSize: 9 }} />
        <PolarRadiusAxis domain={[0, 6]} tick={false} axisLine={false} />
        <Radar
          name={labels.current}
          dataKey="current"
          stroke="#3B75E8"
          fill="#3B75E8"
          fillOpacity={0.2}
        />
        <Radar
          name={labels.previous}
          dataKey="previous"
          stroke="#E8923A"
          fill="#E8923A"
          fillOpacity={0.1}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "#6B7A9A" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
