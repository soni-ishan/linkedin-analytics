export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(startStr: string, endStr: string): string {
  const s = new Date(startStr + "T00:00:00");
  const e = new Date(endStr + "T00:00:00");
  const sameYear = s.getFullYear() === e.getFullYear();
  const startFmt = s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  const endFmt = e.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startFmt} – ${endFmt}`;
}

/**
 * Smart tick formatter — shows "Feb 10" when range < 90 days,
 * "Feb '26" when range is longer.
 */
export function makeTickFormatter(
  data: Array<{ date: string }>
): (dateStr: string) => string {
  if (data.length === 0) return (s) => s;

  const first = data[0].date;
  const last = data[data.length - 1].date;
  const diffMs =
    new Date(last + "T00:00:00").getTime() -
    new Date(first + "T00:00:00").getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 90) {
    return (dateStr: string) => {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
  }

  return (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };
}
