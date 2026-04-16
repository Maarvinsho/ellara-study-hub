"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { TimePoint } from "@/lib/simulator/transient";

interface Series {
  name: string;
  color: string;
  data: TimePoint[];
}

interface TransientPlotProps {
  series: Series[];
  xLabel?: string;
  yLabel?: string;
  tau?: number; // Optional: shows a vertical line at one time constant
}

export default function TransientPlot({
  series,
  xLabel = "time (s)",
  yLabel = "value",
  tau,
}: TransientPlotProps) {
  // Merge all series into one array keyed by time
  const merged: Record<number, { t: number; [key: string]: number }> = {};
  for (const s of series) {
    for (const pt of s.data) {
      if (!merged[pt.t]) merged[pt.t] = { t: pt.t };
      merged[pt.t][s.name] = pt.value;
    }
  }
  const data = Object.values(merged).sort((a, b) => a.t - b.t);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(v) => v.toExponential(1)}
            label={{ value: xLabel, position: "insideBottom", offset: -10 }}
          />
          <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(v: number) => v.toExponential(3)}
            labelFormatter={(v) => `t = ${Number(v).toExponential(3)} s`}
          />
          <Legend verticalAlign="top" height={30} />
          {tau !== undefined && (
            <ReferenceLine
              x={tau}
              stroke="#888"
              strokeDasharray="4 4"
              label={{ value: "τ", position: "top", fill: "#888" }}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stroke={s.color}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}