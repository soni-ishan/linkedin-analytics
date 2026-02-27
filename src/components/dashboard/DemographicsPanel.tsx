"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import type { Demographics, DemographicEntry } from "@/lib/types";

interface DemographicsPanelProps {
  demographics: Demographics;
}

const tabs: { key: keyof Demographics; label: string }[] = [
  { key: "jobTitles", label: "Job Titles" },
  { key: "locations", label: "Locations" },
  { key: "industries", label: "Industries" },
  { key: "seniority", label: "Seniority" },
  { key: "companySize", label: "Company Size" },
];

function BarList({ entries }: { entries: DemographicEntry[] }) {
  const maxPct = Math.max(...entries.map((e) => e.percentage), 0.01);

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.value}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">{entry.value}</span>
            <span className="font-mono text-xs text-[var(--muted)]">
              {(entry.percentage * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-[var(--surface-hover)]">
            <div
              className="h-2 bg-[var(--foreground)] transition-all"
              style={{ width: `${(entry.percentage / maxPct) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DemographicsPanel({
  demographics,
}: DemographicsPanelProps) {
  const [activeTab, setActiveTab] = useState<keyof Demographics>("jobTitles");

  return (
    <Card title="Audience Demographics">
      <div className="mb-4 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-3 py-1.5 font-mono text-[10px] font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <BarList entries={demographics[activeTab]} />
    </Card>
  );
}
