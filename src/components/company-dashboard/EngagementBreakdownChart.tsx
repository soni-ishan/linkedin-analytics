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

interface EngagementDay {
  date: string;
  engagements: number;
  clicks: number;
  reactions: number;
  comments: number;
  reposts: number;
}

const RANK_COLORS = [COLORS.gold, COLORS.silver, COLORS.bronze];

function PostDot(props: {
  cx?: number;
  cy?: number;
  payload?: EngagementDay;
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
  data: EngagementDay[];
  cumulativeData: EngagementDay[];
  postDateMap: Map<string, string>;
  topPostRanks: Map<string, { rank: number; impressions: number; url: string }>;
  totalEngagements: number;
  periodLabel: string;
}

export default function EngagementBreakdownChart({
  data,
  cumulativeData,
  postDateMap,
  topPostRanks,
  totalEngagements,
  periodLabel,
}: Props) {
  const [mode, setMode] = useState<"daily" | "cumulative">("daily");

  const chartData = mode === "daily" ? data : cumulativeData;
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
          Engagements
        </h3>
        <div className="text-right">
          <p className="font-mono text-[11px] text-[var(--muted)] sm:text-xs">
            +{formatNumber(totalEngagements)} engagements
          </p>
          {periodLabel && (
            <p className="font-mono text-[10px] tracking-tight text-[var(--border)]">{periodLabel}</p>
          )}
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <ChartModeToggle mode={mode} onChange={setMode} />
        {postDateMap.size > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]">
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
          </div>
        )}
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="companyEngFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.15} />
                <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
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
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const d = payload[0]?.payload as EngagementDay | undefined;
                if (!d) return null;
                return (
                  <div
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      fontSize: 12,
                      fontFamily: "monospace",
                      background: COLORS.surface,
                      padding: "8px 12px",
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>
                      {formatDateFull(String(label))}
                    </p>
                    <p>
                      {isCumulative ? "Cum. " : ""}Engagements:{" "}
                      <strong>{d.engagements.toLocaleString()}</strong>
                    </p>
                    <hr style={{ border: "none", borderTop: `1px solid ${COLORS.gridLine}`, margin: "4px 0" }} />
                    <p style={{ color: COLORS.clicks }}>
                      Clicks: {d.clicks.toLocaleString()}
                    </p>
                    <p style={{ color: COLORS.reactions }}>
                      Reactions: {d.reactions.toLocaleString()}
                    </p>
                    <p style={{ color: COLORS.comments }}>
                      Comments: {d.comments.toLocaleString()}
                    </p>
                    <p style={{ color: COLORS.reposts }}>
                      Reposts: {d.reposts.toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="engagements"
              stroke={COLORS.green}
              strokeWidth={2}
              fill="url(#companyEngFill)"
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 font-mono text-[10px] text-[var(--muted)]">
        Engagements = clicks + reactions + comments + reposts. Hover to see breakdown.
      </p>
    </Card>
  );
}
