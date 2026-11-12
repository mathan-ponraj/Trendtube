import { BarChart3, Clock, Film, Globe2, MessageSquare, ThumbsUp, Percent, Layers } from "lucide-react";
import Card from "../components/Card";
import CategoryChart from "../components/CategoryChart";
import ContinentSelector from "../components/ContinentSelector";
import EmptyState from "../components/EmptyState";
import { RegionEngagementChart, ViewsLikesScatter } from "../components/EngagementChart";
import ErrorState from "../components/ErrorState";
import HeroCard from "../components/HeroCard";
import LoadingState from "../components/LoadingState";
import StatCard from "../components/StatCard";
import TrendingVideoCard from "../components/TrendingVideoCard";
import { useApi } from "../hooks/useApi";
import { api } from "../services/api";
import type { ContinentInfo, Page } from "../types";
import { compact, formatUtc, percent } from "../utils/format";

interface Props {
  continents: ContinentInfo[];
  continent: string | null;
  onSelectContinent: (name: string | null) => void;
  refreshKey: number;
  onNavigate: (page: Page) => void;
}

const DEFINITIONS = [
  ["Combined views", "Sum of each trending video's total recorded views at collection time. It is not the views earned during the collection period."],
  ["Like-to-view ratio", "Total likes ÷ total views × 100, using only videos that show a like count. It is a simple ratio, not a complete engagement rate."],
  ["Comments", "Sum of recorded comment counts. Videos with comments turned off count as 0."],
  ["Latest snapshot", "For every region we use its own most recent collection, so regions can have different timestamps."],
];

export default function Overview({ continents, continent, onSelectContinent, refreshKey, onNavigate }: Props) {
  const deps = [continent, refreshKey];
  const kpis = useApi((s) => api.overview(continent, s), deps);
  const cats = useApi((s) => api.categories(continent, s), deps);
  const regions = useApi((s) => api.regions(continent, s), deps);
  const top = useApi((s) => api.videos({ continent, sort: "views", limit: 6 }, s), deps);
  const scatter = useApi((s) => api.videos({ continent, sort: "views", limit: 100 }, s), deps);

  const codes = continents.filter((c) => !continent || c.name === continent).flatMap((c) => c.region_codes);
  const k = kpis.data;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Discover what the world is watching.</h2>
        <p className="mt-2 max-w-2xl text-base text-ink-soft">Explore global YouTube trends and uncover opportunities for your next video.</p>
      </div>

      <section aria-labelledby="continents-h">
        <div className="mb-3 flex items-center justify-between">
          <h3 id="continents-h" className="text-sm font-semibold text-ink">Continent explorer</h3>
          {continent && (
            <button onClick={() => onSelectContinent(null)} className="text-sm font-medium text-brand-600 hover:underline">Show all</button>
          )}
        </div>
        <ContinentSelector continents={continents} selected={continent} onSelect={onSelectContinent} />
        <p className="mt-3 text-xs text-ink-faint">
          Coverage is limited to the countries configured in the data collection ({codes.join(", ") || "none"}), not every country on a continent.
          Antarctica has no collected region, so no data is shown for it.
        </p>
      </section>

      {kpis.error ? (
        <ErrorState message={kpis.error} onRetry={kpis.reload} />
      ) : kpis.loading && !k ? (
        <LoadingState height={140} label="Loading metrics" />
      ) : k && k.video_records === 0 ? (
        <EmptyState icon={Globe2} title="No trending data collected yet" message="Run the ETL (python main.py) to load trending videos, then refresh." />
      ) : k ? (
        <>
          <section aria-label="Key metrics" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <HeroCard views={k.total_views} videos={k.video_records} regions={k.regions} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard label="Total trending videos" value={compact(k.video_records)} hint={`${compact(k.unique_videos)} unique videos`} icon={Film} tone="blue" />
                <StatCard label="Total likes" value={compact(k.total_likes)} hint="Where likes are visible" icon={ThumbsUp} tone="violet" />
                <StatCard label="Like-to-view ratio" value={percent(k.like_to_view_ratio)} hint="Likes ÷ views, visible-like videos" icon={Percent} tone="sand" />
                <StatCard label="Total comments" value={compact(k.total_comments)} hint="Recorded comment counts" icon={MessageSquare} tone="coral" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard size="sm" label="Regions" value={String(k.regions)} icon={Globe2} tone="teal" />
              <StatCard size="sm" label="Unique videos" value={compact(k.unique_videos)} icon={Layers} tone="violet" />
              <StatCard size="sm" label="Latest collection" value={formatUtc(k.latest_fetched_at).replace(" UTC", "")} hint="UTC · newest region" icon={Clock} tone="sand" />
            </div>
          </section>

          <Card
            title="Trending now"
            subtitle="Most-viewed videos in the latest snapshots"
            action={<button onClick={() => onNavigate("videos")} className="text-sm font-medium text-brand-600 hover:underline">View all videos</button>}
          >
            {top.error ? <ErrorState message={top.error} onRetry={top.reload} /> : top.loading && !top.data ? <LoadingState height={260} /> : top.data && top.data.items.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {top.data.items.map((v) => <TrendingVideoCard key={`${v.video_id}-${v.region_code}`} video={v} />)}
              </div>
            ) : <EmptyState title="No videos to show" />}
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Popular categories" subtitle="Official YouTube category names, from stored category IDs">
              {cats.error ? <ErrorState message={cats.error} onRetry={cats.reload} /> : cats.loading && !cats.data ? <LoadingState height={280} /> : cats.data && cats.data.length ? (
                <>
                  <CategoryChart data={cats.data} />
                  {cats.data.some((c) => !c.mapped) && (
                    <p className="mt-2 text-xs text-ink-faint">Some category IDs are not in the built-in lookup and are shown as "Category ID".</p>
                  )}
                </>
              ) : <EmptyState title="No category data" />}
            </Card>

            <Card title="Audience engagement by region" subtitle="Combined views (bars) and like-to-view ratio (line)">
              {regions.error ? <ErrorState message={regions.error} onRetry={regions.reload} /> : regions.loading && !regions.data ? <LoadingState height={320} /> : regions.data && regions.data.length ? (
                <RegionEngagementChart regions={regions.data} />
              ) : <EmptyState title="No regional data" />}
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Views vs likes" subtitle="Each dot is one trending video (log scales; hidden likes excluded)">
              {scatter.error ? <ErrorState message={scatter.error} onRetry={scatter.reload} /> : scatter.loading && !scatter.data ? <LoadingState height={320} /> : scatter.data && scatter.data.items.length ? (
                <ViewsLikesScatter videos={scatter.data.items} />
              ) : <EmptyState title="No videos to plot" />}
            </Card>

            <Card title="How these numbers are calculated">
              <dl className="space-y-3 text-sm">
                {DEFINITIONS.map(([term, text]) => (
                  <div key={term}>
                    <dt className="flex items-center gap-2 font-semibold text-ink"><BarChart3 className="h-4 w-4 text-brand-500" aria-hidden />{term}</dt>
                    <dd className="mt-0.5 pl-6 text-ink-soft">{text}</dd>
                  </div>
                ))}
                {k.videos_with_hidden_likes > 0 && (
                  <p className="rounded-lg bg-sand-50 px-3 py-2 text-xs text-ink-soft">
                    {k.videos_with_hidden_likes} video records have no visible like count (hidden or zero) and are left out of the ratio.
                  </p>
                )}
                <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-ink-soft">
                  One snapshot cannot show growth, so no growth or trend-over-time figures are displayed.
                </p>
              </dl>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
