import type { LucideIcon } from "lucide-react";

type Tone = "blue" | "violet" | "teal" | "sand" | "coral";

// Soft pastel card backgrounds; icon sits in a white bubble.
const TONES: Record<Tone, { card: string; fg: string }> = {
  blue: { card: "bg-brand-50", fg: "text-brand-600" },
  violet: { card: "bg-violet-50", fg: "text-violet-500" },
  teal: { card: "bg-teal-50", fg: "text-teal-500" },
  sand: { card: "bg-sand-50", fg: "text-sand-500" },
  coral: { card: "bg-coral-50", fg: "text-coral-500" },
};

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  size?: "lg" | "sm";
}

export default function StatCard({ label, value, hint, icon: Icon, tone = "blue", size = "lg" }: Props) {
  const t = TONES[tone];
  return (
    <div className={`rounded-3xl border border-white/70 ${t.card} p-4 shadow-card`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-soft">{label}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80">
          <Icon className={`h-[18px] w-[18px] ${t.fg}`} aria-hidden />
        </span>
      </div>
      <p className={`mt-3 font-display font-semibold tracking-tight text-ink ${size === "lg" ? "text-3xl" : "text-xl"}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
