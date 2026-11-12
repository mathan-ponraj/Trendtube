import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import ContinentSelector from "../components/ContinentSelector";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import SearchBar from "../components/SearchBar";
import TrendingVideoCard from "../components/TrendingVideoCard";
import { useApi } from "../hooks/useApi";
import { useDebounced } from "../hooks/useDebounced";
import { api } from "../services/api";
import type { ContinentInfo, VideoSort } from "../types";

const PAGE_SIZE = 24;

interface Props {
  continents: ContinentInfo[];
  continent: string | null;
  onSelectContinent: (name: string | null) => void;
  refreshKey: number;
}

const selectClass = "h-10 rounded-xl border border-line bg-white px-3 text-sm text-ink";

export default function TrendingVideos({ continents, continent, onSelectContinent, refreshKey }: Props) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState<VideoSort>("views");
  const [page, setPage] = useState(0);
  const debounced = useDebounced(search);

  const regionOptions = useApi((s) => api.regions(continent, s), [continent, refreshKey]);

  useEffect(() => setRegion(""), [continent]);
  useEffect(() => setPage(0), [continent, region, sort, debounced]);

  const videos = useApi(
    (s) => api.videos({ continent, region, search: debounced, sort, limit: PAGE_SIZE, offset: page * PAGE_SIZE }, s),
    [continent, region, sort, debounced, page, refreshKey],
  );

  const data = videos.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Trending videos</h2>
        <p className="mt-1 text-sm text-ink-soft">Search the latest trending list of every collected region.</p>
      </div>

      <ContinentSelector compact continents={continents} selected={continent} onSelect={onSelectContinent} />

      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by video title or channel" />
        <select aria-label="Region" value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
          <option value="">All regions</option>
          {(regionOptions.data ?? []).map((r) => (
            <option key={r.region_code} value={r.region_code}>{r.region_name}</option>
          ))}
        </select>
        <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as VideoSort)} className={selectClass}>
          <option value="views">Most viewed</option>
          <option value="likes">Most liked</option>
          <option value="comments">Most comments</option>
          <option value="rank">Top trending rank</option>
        </select>
      </div>

      <Card>
        {videos.error ? (
          <ErrorState message={videos.error} onRetry={videos.reload} />
        ) : videos.loading && !data ? (
          <LoadingState height={320} label="Loading videos" />
        ) : data && data.items.length === 0 ? (
          <EmptyState icon={SearchX} title="No videos match" message="Try a different search, region or continent." />
        ) : data ? (
          <>
            <p className="mb-4 text-sm text-ink-soft" aria-live="polite">{data.total.toLocaleString("en-US")} videos</p>
            <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${videos.loading ? "opacity-60" : ""}`}>
              {data.items.map((v) => <TrendingVideoCard key={`${v.video_id}-${v.region_code}`} video={v} />)}
            </div>
            {pages > 1 && (
              <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Pagination">
                <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
                </button>
                <span className="text-sm text-ink-soft">Page {page + 1} of {pages}</span>
                <button disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)} className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium disabled:opacity-40">
                  Next <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </nav>
            )}
          </>
        ) : null}
      </Card>
    </div>
  );
}
