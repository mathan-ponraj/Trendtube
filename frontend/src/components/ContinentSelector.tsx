import { Building2, Castle, Landmark, Snowflake, Sun, Trees, Waves, type LucideIcon } from "lucide-react";
import type { ContinentInfo } from "../types";
import { compact } from "../utils/format";

const ICONS: Record<string, LucideIcon> = {
  Asia: Landmark,
  Europe: Castle,
  "North America": Building2,
  "South America": Trees,
  Africa: Sun,
  Oceania: Waves,
  Antarctica: Snowflake,
};

// Each continent gets its own soft pastel tint.
const TINT: Record<string, string> = {
  Asia: "bg-coral-50 text-coral-500",
  Europe: "bg-brand-50 text-brand-600",
  "North America": "bg-sand-50 text-sand-500",
  "South America": "bg-violet-50 text-violet-500",
  Africa: "bg-sand-50 text-coral-500",
  Oceania: "bg-teal-50 text-teal-500",
  Antarctica: "bg-brand-50 text-brand-600",
};

interface Props {
  continents: ContinentInfo[];
  selected: string | null;
  onSelect: (name: string | null) => void;
  compact?: boolean;
}

export default function ContinentSelector({ continents, selected, onSelect, compact: isCompact = false }: Props) {
  if (isCompact) {
    return (
      <div className="flex flex-wrap gap-2" role="group" aria-label="Continent filter">
        <Pill active={selected === null} onClick={() => onSelect(null)}>All</Pill>
        {continents.map((c) => (
          <Pill key={c.name} active={selected === c.name} disabled={!c.available} onClick={() => onSelect(c.name)}>
            {c.name}
          </Pill>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7" role="group" aria-label="Choose a continent">
      {continents.map((c) => {
        const Icon = ICONS[c.name] ?? Landmark;
        const active = selected === c.name;
        return (
          <button
            key={c.name}
            disabled={!c.available}
            aria-pressed={active}
            title={c.available ? undefined : c.note ?? "Data unavailable"}
            onClick={() => onSelect(active ? null : c.name)}
            className={[
              "flex flex-col items-start gap-3 rounded-3xl border p-4 text-left transition",
              active
                ? "border-brand-500 bg-brand-50 shadow-card ring-1 ring-brand-500"
                : "border-line bg-white shadow-card hover:border-brand-100 hover:bg-brand-50/40",
              c.available ? "" : "cursor-not-allowed opacity-60 hover:border-line hover:bg-white",
            ].join(" ")}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-brand-100 text-brand-700" : TINT[c.name] ?? "bg-ivory text-ink-soft"}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{c.name}</span>
              {c.available ? (
                <span className="mt-0.5 block text-xs text-ink-soft">
                  {c.regions} {c.regions === 1 ? "region" : "regions"} &middot; {compact(c.records)} records
                </span>
              ) : (
                <span className="mt-0.5 block text-xs font-medium text-ink-faint">Data unavailable</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Pill({ active, disabled, onClick, children }: { active: boolean; disabled?: boolean; onClick: () => void; children: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={[
        "rounded-full border px-3 py-1.5 text-sm font-medium transition",
        active ? "border-brand-500 bg-brand-100 text-brand-700" : "border-line bg-white text-ink-soft hover:bg-ivory",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
