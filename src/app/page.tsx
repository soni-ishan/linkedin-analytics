"use client";

import { useState, useCallback, useEffect } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import CompanyDashboard from "@/components/company-dashboard/CompanyDashboard";
import UploadZone from "@/components/upload/UploadZone";
import type { LinkedInData, UploadResult } from "@/lib/types";
import { GITHUB_URL } from "@/lib/constants";
import ExportCallout from "@/components/upload/ExportCallout";
import demoData from "@/data/ishaan.json";

const LIVE_DATA_URL = "/api/linkedin-data";
const FALLBACK_STATIC_URL = "/live-linkedin-data.json";

const LINKEDIN_ANALYTICS_URL =
  "https://www.linkedin.com/analytics/creator/content/";

export default function Home() {
  const [data, setData] = useState<UploadResult | null>({
    type: "creator",
    data: demoData as LinkedInData,
  });
  const [liveData, setLiveData] = useState<LinkedInData | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  const handleUpload = (result: UploadResult) => {
    setData(result);
  };

  useEffect(() => {
    let cancelled = false;

    const loadLiveData = async () => {
      try {
        // Try API route first
        const response = await fetch(LIVE_DATA_URL, { cache: "no-store" });
        if (response.ok) {
          const apiData = await response.json();
          
          // Check if this is error response
          if (apiData.error) {
            console.warn("API returned error:", apiData.message);
            // Try fallback
            await loadFallbackData();
            return;
          }

          if (!cancelled && apiData.posts) {
            // Transform API response to LinkedInData format
            const liveSnapshot = apiData as LinkedInData;
            setLiveData(liveSnapshot);
            setData({ type: "creator", data: liveSnapshot });
            setLastRefreshTime(apiData.fetchedAt || new Date().toISOString());
          }
        } else {
          // Fallback to static file
          await loadFallbackData();
        }
      } catch (error) {
        console.error("Failed to load live data:", error);
        await loadFallbackData();
      }
    };

    const loadFallbackData = async () => {
      try {
        const fallbackResponse = await fetch(FALLBACK_STATIC_URL, { cache: "no-store" });
        if (fallbackResponse.ok) {
          const liveSnapshot = (await fallbackResponse.json()) as LinkedInData;
          if (!cancelled) {
            setLiveData(liveSnapshot);
            setData({ type: "creator", data: liveSnapshot });
            if (liveSnapshot.fetchedAt) {
              setLastRefreshTime(liveSnapshot.fetchedAt);
            }
          }
        }
      } catch {
        // Keep the seeded demo data if the live snapshot is unavailable.
      }
    };

    void loadLiveData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReset = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setData({
        type: "creator",
        data: liveData ?? (demoData as LinkedInData),
      });
      setExiting(false);
    }, 300);
  }, [liveData]);

  if (data) {
    const formatTimestamp = (isoString: string) => {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        return `${diffDays}d ago`;
      } else if (diffHours > 0) {
        return `${diffHours}h ago`;
      } else {
        return "just now";
      }
    };

    return (
      <div className={`min-h-screen bg-background ${exiting ? "animate-fade-out-down" : ""}`}>
        <header className="border-b border-(--border-light) px-4 py-3 sm:px-6 sm:py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
            <button
              onClick={handleReset}
              className="font-mono text-xs font-bold tracking-wider hover:text-(--accent) sm:text-sm"
            >
              areyouviral?
            </button>
            <span className="font-mono text-[10px] text-(--muted) sm:text-xs">
              Made by{" "}
              <a
                href="https://ishaan.ag"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-(--border-light) underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Ishaan
              </a>
              <span className="hidden sm:inline">{" "}❤️</span>
            </span>
            <UploadZone onDataLoaded={handleUpload} compact />
          </div>
          {lastRefreshTime && (
            <div className="mx-auto mt-2 max-w-7xl text-center">
              <span className="font-mono text-[10px] text-(--muted)">
                Data refreshed {formatTimestamp(lastRefreshTime)}
              </span>
            </div>
          )}
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">
          {data.type === "creator" ? (
            <Dashboard data={data.data} />
          ) : (
            <CompanyDashboard data={data.data} />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen animate-fade-in-up flex-col bg-background sm:h-screen sm:overflow-hidden">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:py-0">
        {/* Headline */}
        <h1 className="mb-4 max-w-3xl text-center font-mono text-5xl font-black uppercase leading-tight tracking-tight sm:text-7xl">
          How <span className="fire-text">viral</span> are you, really?
        </h1>

        {/* Subtitle */}
        <p className="mb-2 max-w-lg text-center text-lg text-(--muted)">
          Upload your LinkedIn analytics export — personal or company page
          — to see top posts, engagement metrics, and more.
        </p>

        {/* Upload zone */}
        <div className="mb-3 mt-8 w-full max-w-xl">
          <UploadZone onDataLoaded={handleUpload} />
        </div>
        <button
          onClick={() => handleUpload({ type: "creator", data: demoData as LinkedInData })}
          className="mb-6 font-mono text-xs text-(--muted) underline decoration-(--border-light) underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          or try with sample data
        </button>

        {/* Steps */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:gap-8">
          {/* Step 01 — with Export button callout */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black">01</span>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider">
                  Export your analytics
                </p>
                <a
                  href={LINKEDIN_ANALYTICS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#0077B5] underline underline-offset-4 hover:decoration-2"
                >
                  Open LinkedIn &rarr;
                </a>
              </div>
            </div>
            <ExportCallout />
          </div>

          {/* Step 02 */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-black">02</span>
            <p className="font-mono text-xs font-bold uppercase tracking-wider">
              Drop the file above
            </p>
          </div>

          {/* Step 03 */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-black">03</span>
            <p className="font-mono text-xs font-bold uppercase tracking-wider">
              See your real numbers
            </p>
          </div>
        </div>
      </main>

      <footer className="shrink-0 pb-4 pt-2 text-center">
        <p className="font-mono text-xs text-(--muted)">
          Made by{" "}
          <a
            href="https://ishaan.ag"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground underline decoration-(--border-light) underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Ishaan
          </a>
          {" "}❤️ · {" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-(--border-light) underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Source code
          </a>
        </p>
      </footer>
    </div>
  );
}
