"use client";

import { useEffect, useState } from "react";

/**
 * Detects if user is on a mobile/touch device (matches LinkedIn mobile app UI).
 * Falls back to screen width if touch detection isn't available.
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const hasTouchScreen =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isNarrow = window.innerWidth < 640;
      setIsMobile(hasTouchScreen || isNarrow);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

/* ─── Desktop mockup: LinkedIn web with blue "Export" button ─── */
function DesktopMockup() {
  return (
    <div className="relative w-full max-w-[360px]">
      <div className="overflow-hidden rounded-lg border border-[var(--border-light)] bg-white shadow-sm">
        {/* Top nav bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-[#0077B5]">
              <span className="text-[8px] font-bold leading-none text-white">
                in
              </span>
            </div>
            <div className="h-2 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 rounded-full bg-gray-200" />
            <div className="h-2 w-8 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Analytics header */}
        <div className="px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="h-2.5 w-20 rounded-full bg-gray-300" />
              <div className="mt-1.5 h-2 w-32 rounded-full bg-gray-100" />
            </div>

            {/* Export button — highlighted */}
            <div className="relative">
              <div className="absolute -inset-2 animate-pulse-slow rounded-md bg-[#e63946] opacity-25" />
              <div className="absolute -inset-1.5 rounded-md border-2 border-[#e63946]" />
              <div className="relative flex items-center gap-1.5 rounded-md bg-[#0077B5] px-3 py-1">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px] font-semibold leading-none text-white">
                  Export
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 border-b border-gray-100 pb-1.5">
            <div className="h-1.5 w-14 rounded-full bg-gray-200" />
            <div className="h-1.5 w-8 rounded-full bg-gray-200" />
            <div className="h-1.5 w-10 rounded-full bg-gray-200" />
          </div>

          {/* Date range dropdown row */}
          <div className="mt-2 flex gap-2">
            <div className="relative">
              <div className="absolute -inset-0.5 animate-pulse-slow rounded-full bg-[#e63946] opacity-20" />
              <div className="absolute -inset-px rounded-full border-[1.5px] border-[#e63946]" />
              <div className="relative flex items-center gap-1 rounded-full bg-[#1b7e2e] px-2.5 py-1">
                <span className="text-[8px] font-medium text-white">
                  Past 365 days
                </span>
                <svg
                  width="6"
                  height="6"
                  viewBox="0 0 8 8"
                  className="text-white"
                >
                  <path d="M2 3l2 2.5L6 3" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[#1b7e2e] px-2.5 py-1">
              <span className="text-[8px] font-medium text-white">
                Impressions
              </span>
              <svg
                width="6"
                height="6"
                viewBox="0 0 8 8"
                className="text-white"
              >
                <path d="M2 3l2 2.5L6 3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* "Click this" badge for Export */}
      <div className="absolute right-[-8px] top-[-6px] z-10">
        <div className="flex flex-col items-center">
          <span className="rounded-full bg-[#e63946] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
            Click this!
          </span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            className="text-[#e63946]"
          >
            <path d="M6 8L0 0h12z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* "Select past 365 days" badge BELOW the graphic */}
      <div className="mt-1 flex items-center gap-1 pl-1">
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          className="rotate-180 text-[#e63946]"
        >
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="rounded-full bg-[#e63946] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
          Select &ldquo;Past 365 days&rdquo; for more data
        </span>
      </div>
    </div>
  );
}

/* ─── Mobile mockup: LinkedIn app with download icon ─── */
function MobileMockup() {
  return (
    <div className="relative w-full max-w-[280px]">
      <div className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-sm">
        {/* App header: X | Analytics | download icon */}
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
          {/* X close button */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            className="text-gray-500"
          >
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {/* "Analytics" title */}
          <span className="text-[11px] font-semibold text-gray-900">
            Analytics
          </span>
          {/* Download icon — highlighted */}
          <div className="relative">
            <div className="absolute -inset-2 animate-pulse-slow rounded-full bg-[#e63946] opacity-25" />
            <div className="absolute -inset-1.5 rounded-full border-2 border-[#e63946]" />
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="relative text-gray-700"
            >
              <path
                d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Posts / Audience tabs */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 border-b-2 border-[#0a66c2] py-1.5 text-center text-[9px] font-semibold text-[#0a66c2]">
            Posts
          </div>
          <div className="flex-1 py-1.5 text-center text-[9px] text-gray-500">
            Audience
          </div>
        </div>

        {/* Green pill filters */}
        <div className="flex gap-2 px-3 py-2">
          <div className="relative">
            <div className="absolute -inset-0.5 animate-pulse-slow rounded-full bg-[#e63946] opacity-20" />
            <div className="absolute -inset-px rounded-full border-[1.5px] border-[#e63946]" />
            <div className="relative flex items-center gap-0.5 rounded-full bg-[#1b7e2e] px-2.5 py-1">
              <span className="text-[8px] font-medium text-white">
                Past 365 days
              </span>
              <svg
                width="6"
                height="6"
                viewBox="0 0 8 8"
                className="text-white"
              >
                <path d="M2 3l2 2.5L6 3" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-0.5 rounded-full bg-[#1b7e2e] px-2.5 py-1">
            <span className="text-[8px] font-medium text-white">
              Impressions
            </span>
            <svg
              width="6"
              height="6"
              viewBox="0 0 8 8"
              className="text-white"
            >
              <path d="M2 3l2 2.5L6 3" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      {/* "Tap this" badge pointing at download icon */}
      <div className="absolute right-[-8px] top-[-6px] z-10">
        <div className="flex flex-col items-center">
          <span className="rounded-full bg-[#e63946] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
            Tap this!
          </span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            className="text-[#e63946]"
          >
            <path d="M6 8L0 0h12z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* "Select past 365 days" badge BELOW the graphic */}
      <div className="mt-1 flex items-center gap-1 pl-1">
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          className="rotate-180 text-[#e63946]"
        >
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="rounded-full bg-[#e63946] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
          Select &ldquo;Past 365 days&rdquo; for more data
        </span>
      </div>
    </div>
  );
}

/**
 * Shows a platform-appropriate mockup of the LinkedIn Analytics UI,
 * highlighting the Export button and date range selector.
 */
export default function ExportCallout() {
  const isMobile = useIsMobile();

  return (
    <div className="mt-3">
      {isMobile ? <MobileMockup /> : <DesktopMockup />}
    </div>
  );
}
