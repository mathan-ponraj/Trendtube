import { useMemo } from "react";
import type { RegionStat, Video } from "../types";
import { compact } from "../utils/format";
import { COLORS } from "../utils/theme";
import EChart from "./EChart";

/** Combined recorded views per region (bars) with the like-to-view ratio (line). */
export function RegionEngagementChart({ regions }: { regions: RegionStat[] }) {
  const option = useMemo(
    () => ({
      grid: { left: 8, right: 8, top: 36, bottom: 8, containLabel: true },
      legend: { top: 0, textStyle: { color: COLORS.text } },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "category", data: regions.map((r) => r.region_name), axisTick: { show: false }, axisLabel: { color: COLORS.text } },
      yAxis: [
        { type: "value", axisLabel: { color: COLORS.text, formatter: (v: number) => compact(v) }, splitLine: { lineStyle: { color: COLORS.grid } } },
        { type: "value", axisLabel: { color: COLORS.text, formatter: "{value}%" }, splitLine: { show: false } },
      ],
      series: [
        {
          name: "Combined views",
          type: "bar",
          data: regions.map((r) => r.total_views),
          barMaxWidth: 36,
          itemStyle: { color: COLORS.brand, borderRadius: [6, 6, 0, 0] },
        },
        {
          name: "Like-to-view ratio",
          type: "line",
          yAxisIndex: 1,
          data: regions.map((r) => r.like_to_view_ratio),
          symbolSize: 8,
          lineStyle: { width: 2 },
          itemStyle: { color: COLORS.coral },
        },
      ],
    }),
    [regions],
  );
  return <EChart option={option} height={320} label="Views and like-to-view ratio by region" />;
}

/** Each dot is one trending video: views vs likes (log scales). */
export function ViewsLikesScatter({ videos }: { videos: Video[] }) {
  const option = useMemo(() => {
    const rows = videos.filter((v) => v.like_count > 0 && v.view_count > 0);
    return {
      grid: { left: 8, right: 16, top: 16, bottom: 28, containLabel: true },
      tooltip: {
        trigger: "item",
        formatter: (raw: unknown) => {
          const v = rows[(raw as { dataIndex: number }).dataIndex];
          const title = (v.title ?? "Untitled").replace(/[<>&]/g, "");
          return `<b>${title}</b><br/>${compact(v.view_count)} views &middot; ${compact(v.like_count)} likes<br/>${v.like_to_view_ratio?.toFixed(2)}% like-to-view`;
        },
      },
      xAxis: { type: "log", name: "Views", nameLocation: "middle", nameGap: 28, axisLabel: { color: COLORS.text, formatter: (v: number) => compact(v) }, splitLine: { lineStyle: { color: COLORS.grid } } },
      yAxis: { type: "log", name: "Likes", axisLabel: { color: COLORS.text, formatter: (v: number) => compact(v) }, splitLine: { lineStyle: { color: COLORS.grid } } },
      series: [{ type: "scatter", symbolSize: 9, itemStyle: { color: COLORS.violet, opacity: 0.75 }, data: rows.map((v) => [v.view_count, v.like_count]) }],
    };
  }, [videos]);
  return <EChart option={option} height={320} label="Scatter plot of views versus likes for trending videos" />;
}
