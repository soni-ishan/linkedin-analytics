"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "@/lib/constants";
import { formatNumber } from "@/lib/format";

interface DayOfWeekChartProps {
  data: Array<{
    day: string;
    avgImpressions: number;
    avgEngagements: number;
    avgNewFollowers: number;
  }>;
}

function MiniBarChart({
  data,
  dataKey,
  color,
  label,
  tooltipLabel,
}: {
  data: DayOfWeekChartProps["data"];
  dataKey: string;
  color: string;
  label: string;
  tooltipLabel: string;
}) {
  return (
    <div className="border border-[var(--border-light)] bg-[var(--surface)] p-4">
      <p className="mb-2 font-mono text-[10px] font-medium text-[var(--muted)]">
        {label}
      </p>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              stroke={COLORS.gridLine}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: COLORS.muted }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: COLORS.muted }}
              tickFormatter={(v: number) => formatNumber(v)}
              width={40}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [
                Number(value).toLocaleString(),
                tooltipLabel,
              ]}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${COLORS.border}`,
                fontSize: 11,
                fontFamily: "monospace",
                background: COLORS.surface,
              }}
            />
            <Bar
              dataKey={dataKey}
              fill={color}
              radius={[0, 0, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function DayOfWeekChart({ data }: DayOfWeekChartProps) {
  if (data.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <MiniBarChart
        data={data}
        dataKey="avgImpressions"
        color={COLORS.linkedin}
        label="Avg Impressions"
        tooltipLabel="Avg Impressions"
      />
      <MiniBarChart
        data={data}
        dataKey="avgEngagements"
        color={COLORS.green}
        label="Avg Engagements"
        tooltipLabel="Avg Engagements"
      />
      <MiniBarChart
        data={data}
        dataKey="avgNewFollowers"
        color={COLORS.amber}
        label="Avg New Followers"
        tooltipLabel="Avg New Followers"
      />
    </div>
  );
}
