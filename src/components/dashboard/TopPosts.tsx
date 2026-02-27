"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import InfoTooltip from "@/components/ui/InfoTooltip";
import type { TopPost } from "@/lib/types";
import { formatNumber, formatDateFull } from "@/lib/format";

interface TopPostsProps {
  posts: TopPost[];
}

type SortKey = "publishDate" | "impressions" | "engagements" | "engagementRate";
type SortDir = "asc" | "desc";

const medals = ["🥇", "🥈", "🥉"];
const DEFAULT_SHOW = 10;

function SortHeader({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = currentKey === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex w-full items-center gap-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
        active
          ? "font-semibold text-[var(--foreground)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      } ${className}`}
    >
      {label}
      {active && (
        <span className="text-[9px]">{currentDir === "desc" ? "↓" : "↑"}</span>
      )}
    </button>
  );
}

export default function TopPosts({ posts }: TopPostsProps) {
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showAll, setShowAll] = useState(false);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // Top 3 by impressions for medal assignment (stable regardless of sort)
  const top3Urls = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.impressions - a.impressions);
    return new Set(sorted.slice(0, 3).map((p) => p.url));
  }, [posts]);

  const medalMap = useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.impressions - a.impressions);
    const map = new Map<string, number>();
    sorted.slice(0, 3).forEach((p, i) => map.set(p.url, i));
    return map;
  }, [posts]);

  const sorted = useMemo(() => {
    const arr = [...posts];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "publishDate":
          cmp = a.publishDate.localeCompare(b.publishDate);
          break;
        case "impressions":
          cmp = a.impressions - b.impressions;
          break;
        case "engagements":
          cmp = a.engagements - b.engagements;
          break;
        case "engagementRate":
          cmp = a.engagementRate - b.engagementRate;
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [posts, sortKey, sortDir]);

  const visible = showAll ? sorted : sorted.slice(0, DEFAULT_SHOW);
  const hasMore = sorted.length > DEFAULT_SHOW;

  if (posts.length === 0) {
    return (
      <Card title="Top 50 Posts">
        <p className="text-sm text-[var(--muted)]">
          No posts found in this date range.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Top 50 Posts">
      {/* Table */}
      <div className="overflow-x-clip">
        <table className="w-full border-collapse">
          <colgroup>
            <col className="w-8" />
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border-light)]">
              <th className="w-8 pb-2" />
              <th className="pb-2 pr-4 text-left">
                <SortHeader
                  label="Date"
                  sortKey="publishDate"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="pb-2 pr-4 text-left">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  Post
                </span>
              </th>
              <th className="pb-2 pr-4 text-right">
                <SortHeader
                  label="Impressions"
                  sortKey="impressions"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="justify-end"
                />
              </th>
              <th className="pb-2 pr-4 text-right">
                <div className="flex w-full items-center justify-end">
                  <SortHeader
                    label="Engagements"
                    sortKey="engagements"
                    currentKey={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-auto justify-end"
                  />
                  <InfoTooltip text="Reactions, comments, shares, link clicks, and more" />
                </div>
              </th>
              <th className="pb-2 text-right">
                <SortHeader
                  label="Eng. Rate"
                  sortKey="engagementRate"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={handleSort}
                  className="justify-end"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((post) => {
              const medalIdx = medalMap.get(post.url);
              const hasMedal = medalIdx !== undefined;
              return (
                <tr
                  key={post.url}
                  className="border-b border-[var(--border-light)] last:border-0"
                >
                  {/* Medal */}
                  <td className="w-8 py-2.5 pr-1 text-center">
                    {hasMedal ? (
                      <span className="text-base">{medals[medalIdx]}</span>
                    ) : null}
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap py-2.5 pr-4 font-mono text-xs text-[var(--muted)]">
                    {formatDateFull(post.publishDate)}
                  </td>

                  {/* Post link */}
                  <td className="py-2.5 pr-4">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#0077B5] hover:underline"
                    >
                      View post &rarr;
                    </a>
                  </td>

                  {/* Impressions */}
                  <td className="whitespace-nowrap py-2.5 pr-4 text-right font-mono text-xs">
                    {post.impressions > 0
                      ? formatNumber(post.impressions)
                      : <span className="text-[var(--muted)]">—</span>}
                  </td>

                  {/* Engagements */}
                  <td className="whitespace-nowrap py-2.5 pr-4 text-right font-mono text-xs">
                    {formatNumber(post.engagements)}
                  </td>

                  {/* Engagement rate (engagements / impressions) */}
                  <td className="whitespace-nowrap py-2.5 text-right font-mono text-xs text-[var(--muted)]">
                    {post.impressions > 0
                      ? `${((post.engagements / post.impressions) * 100).toFixed(1)}%`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View all / collapse */}
      {hasMore && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 font-mono text-xs text-[var(--muted)] underline decoration-[var(--border-light)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
        >
          {showAll
            ? "Show less"
            : `View all ${sorted.length} posts`}
        </button>
      )}
    </Card>
  );
}
