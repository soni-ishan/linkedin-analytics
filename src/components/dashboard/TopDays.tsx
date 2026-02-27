import Card from "@/components/ui/Card";
import type { TopDay } from "@/lib/types";
import { formatNumber, formatDateFull } from "@/lib/format";

interface TopDaysProps {
  title: string;
  days: TopDay[];
}

const medals = ["🥇", "🥈", "🥉"];

function DayRow({ day, rank }: { day: TopDay; rank: number }) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border-light)] py-2 last:border-0">
      <span className="text-base">{medals[rank]}</span>
      <span className="font-mono text-xs text-[var(--muted)]">
        {formatDateFull(day.date)}
      </span>
      <span className="ml-auto font-mono text-sm font-semibold">
        {formatNumber(day.value)}
      </span>
      <span className="font-mono text-[10px] text-[var(--muted)]">
        {day.label}
      </span>
    </div>
  );
}

export default function TopDays({ title, days }: TopDaysProps) {
  return (
    <Card title={title}>
      {days.map((day, i) => (
        <DayRow key={day.date} day={day} rank={i} />
      ))}
    </Card>
  );
}
