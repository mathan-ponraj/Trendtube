import { Database } from "lucide-react";
import { useMemo } from "react";
import Card from "../components/Card";
import CategoryChart from "../components/CategoryChart";
import ContinentSelector from "../components/ContinentSelector";
import EChart from "../components/EChart";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { useApi } from "../hooks/useApi";
import { api } from "../services/api";
import type { BucketStat, ContinentInfo } from "../types";
import { compact } from "../utils/format";
import { COLORS } from "../utils/theme";

interface Props {
  continents: ContinentInfo[];
  continent: string | null;
  onSelectContinent: (name: string | null) => void;
  refreshKey: number;
}

function FormatChart({ data }: { data: BucketStat[] }) {
  const option = useMemo(
    () => ({
      grid: { left: 8, right: 8, top: 16, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (raw: unknown) => {
          const r = data[(raw as { dataIndex: number }[])[0].dataIndex];
          return `<b>${r.label}</b><br/>${r.videos} videos<br/>${compact(r.total_views)} combined views`;
        },
      },
      xAxis: { type: "category", data: data.map((d) => d.label), axisTick: { show: false }, axisLabel: { color: COLORS.text } },
      yAxis: { type: "value", minInterval: 1, axisLabel: { color: COLORS.text }, splitLine: { lineStyle: { color: COLORS.grid } } },
      series: [{ type: "bar", data: data.map((d) => d.videos), barMaxWidth: 40, itemStyle: { color: COLORS.teal, borderRadius: [6, 6, 0, 0] } }],
    }),
    [data],
  );
  return <EChart option={option} height={260} label="Bar chart of video lengths among trending videos" />;
}

export default function CreatorInsights({ continents, continent, onSelectContinent, refreshKey }: Props) {
  const insights = useApi((s) => api.insights(continent, s), [continent, refreshKey]);
  const d = insights.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Creator insights</h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
          <Database className="h-4 w-4 text-brand-500" aria-hidden />
          Every insight below is calculated from the collected trending records. Nothing here is AI-generated.
        </p>
      </div>

      <ContinentSelector compact continents={continents} selected={continent} onSelect={onSelectContinent} />

      {insights.error ? (
        <ErrorState message={insights.error} onRetry={insights.reload} />
      ) : insights.loading && !d ? (
        <LoadingState height={240} label="Loading insights" />
      ) : d && d.facts.length === 0 ? (
        <EmptyState title="No data for these insights yet" message="Collect trending data with the ETL, then refresh." />
      ) : d ? (
        <>
          <section aria-label="Key findings" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {d.facts.map((f) => (
              <div key={f.title} className="rounded-3xl border border-line bg-white p-4 shadow-card">
                <p className="text-sm font-semibold text-ink">{f.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{f.detail}</p>
              </div>
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Categories with the most trending videos">
              <CategoryChart data={d.top_categories} />
            </Card>
            <Card title="Video length" subtitle="How long trending videos are">
              <FormatChart data={d.duration_formats} />
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card title="Channels appearing more than once" subtitle="Trending slots in the latest snapshots">
              {d.frequent_channels.length === 0 ? (
                <EmptyState title="No repeat channels" message="No channel appears more than once in the current snapshots." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-ink-faint">
                      <tr><th className="pb-2 font-medium">Channel</th><th className="pb-2 text-right font-medium">Slots</th><th className="pb-2 text-right font-medium">Regions</th><th className="pb-2 text-right font-medium">Views</th></tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {d.frequent_channels.map((c) => (
                        <tr key={c.channel_name ?? "unknown"}>
                          <td className="py-2 pr-3 font-medium text-ink">{c.channel_name ?? "Unknown"}</td>
                          <td className="py-2 text-right">{c.appearances}</td>
                          <td className="py-2 text-right">{c.regions}</td>
                          <td className="py-2 text-right">{compact(c.total_views)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card title="Words that recur in titles" subtitle="Words appearing in 2+ trending titles (works best for space-separated languages)">
              {d.title_keywords.length === 0 ? (
                <EmptyState title="No repeated words" message="No word appears in more than one title yet." />
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {d.title_keywords.map((k) => (
                    <li key={k.word} className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-500">
                      <span className="font-medium">{k.word}</span> <span className="text-ink-faint">· {k.videos}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card title="Combined views by region">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-ink-faint">
                  <tr><th className="pb-2 font-medium">Region</th><th className="pb-2 text-right font-medium">Videos</th><th className="pb-2 text-right font-medium">Views</th><th className="pb-2 text-right font-medium">Like-to-view</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {d.regions.map((r) => (
                    <tr key={r.region_code}>
                      <td className="py-2 font-medium text-ink">{r.region_name} <span className="text-ink-faint">· {r.continent}</span></td>
                      <td className="py-2 text-right">{r.records}</td>
                      <td className="py-2 text-right">{compact(r.total_views)}</td>
                      <td className="py-2 text-right">{r.like_to_view_ratio === null ? "-" : `${r.like_to_view_ratio.toFixed(2)}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
