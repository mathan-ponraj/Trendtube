/** 1250 -> "1.25K", 1250000 -> "1.25M". */
export function compact(n: number | null | undefined): string {
  if (n === null || n === undefined) return "-";
  const abs = Math.abs(n);
  const fmt = (v: number, suffix: string) => `${Math.round(v * 100) / 100}${suffix}`;
  if (abs >= 1e9) return fmt(n / 1e9, "B");
  if (abs >= 1e6) return fmt(n / 1e6, "M");
  if (abs >= 1e3) return fmt(n / 1e3, "K");
  return n.toLocaleString("en-US");
}

export function percent(n: number | null | undefined): string {
  return n === null || n === undefined ? "-" : `${n.toFixed(2)}%`;
}

export function duration(seconds: number | null | undefined): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** Backend timestamps are UTC but serialised without a zone; treat them as UTC. */
export function formatUtc(iso: string | null | undefined): string {
  if (!iso) return "-";
  const hasZone = /Z$|[+-]\d{2}:\d{2}$/.test(iso);
  const date = new Date(hasZone ? iso : `${iso}Z`);
  if (Number.isNaN(date.getTime())) return "-";
  const text = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
  return `${text} UTC`;
}
