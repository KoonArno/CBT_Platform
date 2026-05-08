"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Datum {
  s: string;
  total: number;
  self?: number;
}

export function ProgressLineChart({
  data,
  showSelf = false,
  height = 200,
}: {
  data: ReadonlyArray<Datum>;
  showSelf?: boolean;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={[...data]}>
        <CartesianGrid strokeDasharray="3 3" stroke="#C0CAD8" />
        <XAxis dataKey="s" stroke="#6B7A9A" fontSize={11} />
        <YAxis domain={[20, 72]} stroke="#6B7A9A" fontSize={11} />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #C0CAD8",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3B75E8"
          strokeWidth={2.5}
          dot={{ fill: "#3B75E8", r: 4 }}
          name="Supervisor"
        />
        {showSelf && (
          <Line
            type="monotone"
            dataKey="self"
            stroke="#E8923A"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ fill: "#E8923A", r: 4 }}
            name="Self-Rating"
          />
        )}
        <Legend wrapperStyle={{ fontSize: 11, color: "#6B7A9A" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
