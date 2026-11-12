import { Menu, RefreshCw } from "lucide-react";
import { formatUtc } from "../utils/format";

interface Props {
  title: string;
  latestFetchedAt: string | null;
  regionCount: number;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenMenu: () => void;
}

export default function Topbar({ title, latestFetchedAt, regionCount, refreshing, onRefresh, onOpenMenu }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-ivory/90 px-4 backdrop-blur sm:px-6">
      <button onClick={onOpenMenu} className="rounded-lg p-2 text-ink-soft hover:bg-white lg:hidden" aria-label="Open menu">
        <Menu className="h-5 w-5" aria-hidden />
      </button>
      <h1 className="text-sm font-semibold text-ink sm:text-base">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <p className="hidden items-center gap-2 text-xs text-ink-soft md:flex" aria-live="polite">
          <span className={`h-2 w-2 rounded-full ${latestFetchedAt ? "bg-teal-500" : "bg-ink-faint"}`} aria-hidden />
          {latestFetchedAt ? `Latest collection: ${formatUtc(latestFetchedAt)} · ${regionCount} regions` : "No collection yet"}
        </p>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink hover:bg-ivory disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-white py-1.5 pl-1.5 pr-3" title="Workspace">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-xs font-semibold text-brand-700">TT</span>
          <span className="hidden text-sm font-medium text-ink sm:inline">My workspace</span>
        </div>
      </div>
    </header>
  );
}
