import { useEffect, useMemo, useState } from "react";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { useApi } from "./hooks/useApi";
import CreatorInsights from "./pages/CreatorInsights";
import Overview from "./pages/Overview";
import TrendingVideos from "./pages/TrendingVideos";
import { api } from "./services/api";
import type { Page } from "./types";

const TITLES: Record<Page, string> = {
  overview: "Overview",
  videos: "Trending Videos",
  insights: "Creator Insights",
};

function pageFromHash(): Page {
  const id = window.location.hash.replace(/^#\/?/, "");
  return id === "videos" || id === "insights" ? id : "overview";
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [continent, setContinent] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (next: Page) => {
    window.location.hash = `#/${next}`;
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  const continents = useApi((s) => api.continents(s), [refreshKey]);
  const regions = useApi((s) => api.regions(null, s), [refreshKey]);

  const latest = useMemo(() => {
    const stamps = (regions.data ?? []).map((r) => r.latest_fetched_at).filter((v): v is string => !!v);
    return stamps.length ? stamps.reduce((a, b) => (a > b ? a : b)) : null;
  }, [regions.data]);

  return (
    <div className="min-h-screen">
      <Sidebar
        page={page}
        onNavigate={navigate}
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <div className={`transition-all ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <Topbar
          title={TITLES[page]}
          latestFetchedAt={latest}
          regionCount={regions.data?.length ?? 0}
          refreshing={continents.loading || regions.loading}
          onRefresh={() => setRefreshKey((k) => k + 1)}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {continents.error ? (
            <ErrorState message={continents.error} onRetry={continents.reload} />
          ) : !continents.data ? (
            <LoadingState height={200} label="Loading dashboard" />
          ) : page === "overview" ? (
            <Overview continents={continents.data} continent={continent} onSelectContinent={setContinent} refreshKey={refreshKey} onNavigate={navigate} />
          ) : page === "videos" ? (
            <TrendingVideos continents={continents.data} continent={continent} onSelectContinent={setContinent} refreshKey={refreshKey} />
          ) : (
            <CreatorInsights continents={continents.data} continent={continent} onSelectContinent={setContinent} refreshKey={refreshKey} />
          )}
        </main>
      </div>
    </div>
  );
}
