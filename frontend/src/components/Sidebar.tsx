import { ChevronsLeft, ChevronsRight, LayoutDashboard, Lightbulb, PlaySquare, X, type LucideIcon } from "lucide-react";
import type { Page } from "../types";

const NAV: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "videos", label: "Trending Videos", icon: PlaySquare },
  { id: "insights", label: "Creator Insights", icon: Lightbulb },
];

interface Props {
  page: Page;
  onNavigate: (page: Page) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ page, onNavigate, mobileOpen, onCloseMobile, collapsed, onToggleCollapse }: Props) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={onCloseMobile} aria-hidden />}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-line bg-white transition-all",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-64 lg:w-[76px]" : "w-64",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <a href="#/overview" className="flex items-center gap-2.5" aria-label="TrendTube home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
              <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden><path d="M12 9.5v13l11-6.5z" fill="#27627A" /></svg>
            </span>
            <span className={`text-lg font-semibold tracking-tight ${collapsed ? "lg:hidden" : ""}`}>TrendTube</span>
          </a>
          <button onClick={onCloseMobile} className="rounded-md p-1 text-ink-soft lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => { onNavigate(id); onCloseMobile(); }}
                aria-current={active ? "page" : undefined}
                title={label}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-brand-50 text-brand-600" : "text-ink-soft hover:bg-ivory hover:text-ink"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className={`px-4 pb-3 ${collapsed ? "lg:hidden" : ""}`} aria-hidden>
          <svg viewBox="0 0 200 80" className="w-full">
            <circle cx="160" cy="24" r="20" fill="#FFF1B8" opacity="0.8" />
            <circle cx="160" cy="24" r="13" fill="#FFE08A" />
            <path d="M60 48 L60 26 L80 46Z" fill="#FFFFFF" />
            <path d="M54 48 H86 L80 57 H60Z" fill="#FFB8A8" />
            <path d="M0 52 Q25 40 50 52 T100 52 T150 52 T200 52 V80 H0Z" fill="#CDEEF6" />
            <path d="M0 64 Q25 54 50 64 T100 64 T150 64 T200 64 V80 H0Z" fill="#A8DDEA" />
          </svg>
        </div>

        <div className="hidden border-t border-line p-3 lg:block">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-ivory"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight className="h-5 w-5" aria-hidden /> : <ChevronsLeft className="h-5 w-5" aria-hidden />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
