"use client";

import type { DateRange } from "@/lib/types";

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  availableRanges: DateRange[];
  dataDays: number;
}

const allOptions: { value: DateRange; label: string }[] = [
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
  { value: "3months", label: "Past 3 months" },
  { value: "year", label: "Past year" },
];

export default function DateRangeSelector({
  value,
  onChange,
  availableRanges,
  dataDays,
}: DateRangeSelectorProps) {
  const options = allOptions.filter((opt) =>
    availableRanges.includes(opt.value)
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs font-medium transition-colors ${
              value === opt.value
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "border border-[var(--border-light)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="font-mono text-[11px] text-[var(--muted)]">
          ({dataDays} days of data)
        </span>
      </div>
      {dataDays <= 14 && (
        <p className="mt-2 font-mono text-[11px] text-[var(--amber)]">
          Tip: Select &quot;Past 365 days&quot; in LinkedIn before exporting to get more data.
        </p>
      )}
    </div>
  );
}
