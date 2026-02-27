"use client";

import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import type { TopPost } from "@/lib/types";

interface PostsTableProps {
  posts: TopPost[];
}

type SortKey = "publishDate" | "impressions" | "engagements" | "engagementRate";
type SortDir = "asc" | "desc";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default function PostsTable({ posts }: PostsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [posts, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const headerClass =
    "cursor-pointer select-none px-3 py-2.5 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)] transition-colors";
  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <Card title={`Top Posts (${posts.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-light)]">
              <th
                className={headerClass}
                onClick={() => handleSort("publishDate")}
              >
                Date{arrow("publishDate")}
              </th>
              <th className="px-3 py-2.5 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Post
              </th>
              <th
                className={headerClass}
                onClick={() => handleSort("impressions")}
              >
                Impressions{arrow("impressions")}
              </th>
              <th
                className={headerClass}
                onClick={() => handleSort("engagements")}
              >
                Engagements{arrow("engagements")}
              </th>
              <th
                className={headerClass}
                onClick={() => handleSort("engagementRate")}
              >
                Eng. Rate{arrow("engagementRate")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((post, i) => (
              <tr
                key={post.url}
                className={`border-b border-[var(--border-light)] ${
                  i % 2 === 0 ? "" : "bg-[var(--surface-hover)]"
                }`}
              >
                <td className="whitespace-nowrap px-3 py-3 font-mono text-xs">
                  {formatDate(post.publishDate)}
                </td>
                <td className="px-3 py-3">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--foreground)] underline decoration-[var(--border-light)] underline-offset-4 hover:decoration-[var(--foreground)]"
                  >
                    View Post &rarr;
                  </a>
                </td>
                <td className="px-3 py-3 font-mono text-sm font-bold">
                  {formatNumber(post.impressions)}
                </td>
                <td className="px-3 py-3 font-mono text-sm font-bold">
                  {formatNumber(post.engagements)}
                </td>
                <td className="px-3 py-3 font-mono text-sm">
                  {(post.engagementRate * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
