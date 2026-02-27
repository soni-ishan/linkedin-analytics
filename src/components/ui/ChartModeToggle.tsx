"use client";

interface ChartModeToggleProps {
  mode: "daily" | "cumulative";
  onChange: (mode: "daily" | "cumulative") => void;
}

export default function ChartModeToggle({
  mode,
  onChange,
}: ChartModeToggleProps) {
  const options: { value: "daily" | "cumulative"; label: string }[] = [
    { value: "daily", label: "Per day" },
    { value: "cumulative", label: "Cumulative" },
  ];

  return (
    <div className="mb-3 inline-flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3 py-1 font-mono text-[10px] font-medium transition-colors ${
            mode === opt.value
              ? "bg-[var(--foreground)] text-[var(--background)]"
              : "bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
