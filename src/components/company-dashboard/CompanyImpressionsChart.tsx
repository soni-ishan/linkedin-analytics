"use client";

import { useMemo, useState, useEffect } from "react";
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
import ChartModeToggle from "@/components/ui/ChartModeToggle";
import { COLORS } from "@/lib/constants";
import { formatDateFull, makeTickFormatter, formatNumber } from "@/lib/format";
import type { CompanyDailyMetrics } from "@/lib/types";

const RANK_COLORS = [COLORS.gold, COLORS.silver, COLORS.bronze];

function PostDot(props: {
  cx?: number;
  cy?: number;
  payload?: { date: string };
  postDateMap: Map<string, string>;
  topPostRanks: Map<string, { rank: number; impressions: number; url: string }>;
}) {
  const { cx, cy, payload, postDateMap, topPostRanks } = props;
  if (!cx || !cy || !payload) return null;
  const url = postDateMap.get(payload.date);
  if (!url) return null;

  const medal = topPostRanks.get(payload.date);
  const fill = medal != null ? RANK_COLORS[medal.rank] : COLORS.red;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={medal != null ? 7 : 5}
      fill={fill}
      stroke="#fff"
      strokeWidth={2}
      style={{ cursor: "pointer" }}
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    />
  );
}

interface Props {
  data: CompanyDailyMetrics[];
  cumulativeData: Array<{ date: string; impressions: number; clicks: number; reactions: number }>;
  postDateMap: Map<string, string>;
  topPostRanks: Map<string, { rank: number; impressions: number; url: string }>;
  totalImpressions: number;
  periodLabel: string;
}

export default function CompanyImpressionsChart({
  data,
  cumulativeData,
  postDateMap,
  topPostRanks,
  totalImpressions,
  periodLabel,
}: Props) {
  const [mode, setMode] = useState<"daily" | "cumulative">("daily");

  // Check if there's any sponsored data — only show organic vs total split when there is
  const hasSponsored = useMemo(
    () => data.some((d) => d.impressionsSponsored > 0),
    [data]
  );

  const chartData = useMemo(() => {
    if (mode === "cumulative") {
      return cumulativeData;
    }
    if (hasSponsored) {
      return data.map((d) => ({
        date: d.date,
        organic: d.impressionsOrganic,
        total: d.impressionsTotal,
      }));
    }
    return data.map((d) => ({
      date: d.date,
      impressions: d.impressionsTotal,
    }));
  }, [data, cumulativeData, mode, hasSponsored]);

  const tickFormatter = useMemo(
    () => makeTickFormatter(chartData),
    [chartData]
  );

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const tickInterval = Math.max(
    1,
    Math.floor(chartData.length / (isMobile ? 4 : 8))
  );

  const isCumulative = mode === "cumulative";

  return (
    <Card>
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-mono text-xs font-medium text-[var(--muted)]">
          Impressions
        </h3>
        <div className="text-right">
          <p className="font-mono text-[11px] text-[var(--muted)] sm:text-xs">
            +{formatNumber(totalImpressions)} impressions
          </p>
          {periodLabel && (
            <p className="font-mono text-[10px] tracking-tight text-[var(--border)]">{periodLabel}</p>
          )}
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ChartModeToggle mode={mode} onChange={setMode} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]">
          {!isCumulative && hasSponsored && (
            <>
              <p className="flex items-center gap-1.5">
                <span
                  className="inline-block h-0.5 w-4"
                  style={{ backgroundColor: COLORS.organic }}
                />
                Organic
              </p>
              <p className="flex items-center gap-1.5">
                <span
                  className="inline-block h-0.5 w-4"
                  style={{ backgroundColor: COLORS.clicks }}
                />
                Total (organic + sponsored)
              </p>
            </>
          )}
          {postDateMap.size > 0 && (
            <>
              <p>
                <span
                  className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS.red }}
                />
                Post published (click to view)
              </p>
              <p className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.gold }} />
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.silver }} />
                <span className="mr-0.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS.bronze }} />
                Top 3 posts by impressions
              </p>
            </>
          )}
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="organicFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.organic} stopOpacity={0.1} />
                <stop offset="95%" stopColor={COLORS.organic} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="totalFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.clicks} stopOpacity={0.1} />
                <stop offset="95%" stopColor={COLORS.clicks} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COLORS.gridLine} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              tick={{ fontSize: isMobile ? 9 : 11, fill: COLORS.muted }}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 9 : 11, fill: COLORS.muted }}
              tickFormatter={(v: number) => formatNumber(v)}
              width={isMobile ? 35 : 55}
            />
            <Tooltip
              labelFormatter={(label) => formatDateFull(String(label))}
              formatter={(value, name) => [
                Number(value).toLocaleString(),
                isCumulative
                  ? "Cum. " + String(name).charAt(0).toUpperCase() + String(name).slice(1)
                  : String(name).charAt(0).toUpperCase() + String(name).slice(1),
              ]}
              contentStyle={{
                borderRadius: 0,
                border: `1px solid ${COLORS.border}`,
                fontSize: 12,
                fontFamily: "monospace",
                background: COLORS.surface,
              }}
            />
            {isCumulative ? (
              <Area
                type="monotone"
                dataKey="impressions"
                stroke={COLORS.organic}
                strokeWidth={2}
                fill="url(#organicFill)"
                dot={(dotProps) => (
                  <PostDot
                    key={dotProps.payload?.date}
                    {...dotProps}
                    postDateMap={postDateMap}
                    topPostRanks={topPostRanks}
                  />
                )}
                activeDot={false}
                isAnimationActive={false}
              />
            ) : hasSponsored ? (
              <>
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={COLORS.clicks}
                  strokeWidth={2}
                  fill="url(#totalFill)"
                  dot={(dotProps) => (
                    <PostDot
                      key={dotProps.payload?.date}
                      {...dotProps}
                      postDateMap={postDateMap}
                      topPostRanks={topPostRanks}
                    />
                  )}
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="organic"
                  stroke={COLORS.organic}
                  strokeWidth={2}
                  fill="url(#organicFill)"
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="impressions"
                stroke={COLORS.organic}
                strokeWidth={2}
                fill="url(#organicFill)"
                dot={(dotProps) => (
                  <PostDot
                    key={dotProps.payload?.date}
                    {...dotProps}
                    postDateMap={postDateMap}
                    topPostRanks={topPostRanks}
                  />
                )}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
