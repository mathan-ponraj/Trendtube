import { useMemo, useState } from "react";
import type { CategoryStat } from "../types";
import { compact } from "../utils/format";
import { COLORS } from "../utils/theme";
import EChart from "./EChart";

type Metric = "videos" | "views";

export default function CategoryChart({ data }: { data: CategoryStat[] }) {
  const [metric, setMetric] = useState<Metric>("videos");

  const option = useMemo(() => {
    const rows = [...data]
      .sort((a, b) => (metric === "videos" ? b.videos - a.videos : b.total_views - a.total_views))
      .slice(0, 10)
      .reverse(); // ECharts draws the first category at the bottom
    return {
      grid: { left: 8, right: 56, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (raw: unknown) => {
          const first = (raw as { dataIndex: number }[])[0];
          const r = rows[first.dataIndex];
          return `<b>${r.category_name}</b><br/>${r.videos} videos<br/>${compact(r.total_views)} combined views`;
        },
      },
      xAxis: {
        type: "value",
        minInterval: metric === "videos" ? 1 : undefined,
        axisLabel: { color: COLORS.text, formatter: (v: number) => (metric === "views" ? compact(v) : String(v)) },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      yAxis: {
        type: "category",
        data: rows.map((r) => r.category_name),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: COLORS.text },
      },
      series: [
        {
          type: "bar",
          data: rows.map((r) => (metric === "videos" ? r.videos : r.total_views)),
          barWidth: 14,
          itemStyle: { color: metric === "videos" ? COLORS.brand : COLORS.violet, borderRadius: [0, 6, 6, 0] },
          label: {
            show: true,
            position: "right",
            color: COLORS.text,
            formatter: (p: { value: number }) => (metric === "views" ? compact(p.value) : String(p.value)),
          },
        },
      ],
    };
  }, [data, metric]);

  return (
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-line bg-ivory p-0.5 text-sm" role="group" aria-label="Chart metric">
        {(["videos", "views"] as Metric[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            aria-pressed={metric === m}
            className={`rounded-md px-3 py-1 font-medium ${metric === m ? "bg-white text-ink shadow-sm" : "text-ink-soft"}`}
          >
            {m === "videos" ? "Videos" : "Total views"}
          </button>
        ))}
      </div>
      <EChart option={option} height={Math.max(220, Math.min(data.length, 10) * 34 + 24)} label="Bar chart of popular categories" />
    </div>
  );
}
