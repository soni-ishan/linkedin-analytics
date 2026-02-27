"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";
import { COLORS } from "@/lib/constants";
import { formatDateFull, makeTickFormatter } from "@/lib/format";

interface FollowerGrowthChartProps {
  data: Array<{ date: string; followers: number }>;
}

export default function FollowerGrowthChart({
  data,
}: FollowerGrowthChartProps) {
  const tickInterval = Math.max(1, Math.floor(data.length / 8));
  const tickFormatter = useMemo(() => makeTickFormatter(data), [data]);

  return (
    <Card title="Follower Growth">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="followerFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.linkedin}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.linkedin}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COLORS.gridLine} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              tick={{ fontSize: 12, fill: COLORS.muted }}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fontSize: 12, fill: COLORS.muted }}
              tickFormatter={(v: number) =>
                v >= 1000 ? (v / 1000).toFixed(0) + "K" : String(v)
              }
            />
            <Tooltip
              labelFormatter={(label) => formatDateFull(String(label))}
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Followers",
              ]}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${COLORS.border}`,
                fontSize: 12,
                fontFamily: "monospace",
                background: COLORS.surface,
              }}
            />
            <Area
              type="monotone"
              dataKey="followers"
              stroke={COLORS.linkedin}
              strokeWidth={2}
              fill="url(#followerFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
