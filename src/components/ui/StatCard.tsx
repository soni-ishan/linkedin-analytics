import InfoTooltip from "@/components/ui/InfoTooltip";

export default function StatCard({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip?: string;
}) {
  return (
    <div className="border border-[var(--border-light)] bg-[var(--surface)] px-4 py-3">
      <p className="text-[11px] text-[var(--muted)]">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </p>
      <p className="mt-0.5 font-mono text-lg font-semibold">{value}</p>
    </div>
  );
}
