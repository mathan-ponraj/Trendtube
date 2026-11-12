import type {
  CategoryStat, ContinentInfo, Insights, Kpis, RegionStat, VideoSort, VideosPage,
} from "../types";

const BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

type Params = Record<string, string | number | null | undefined>;

async function get<T>(path: string, params: Params = {}, signal?: AbortSignal): Promise<T> {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") qs.set(key, String(value));
  }
  const query = qs.toString();
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}${query ? `?${query}` : ""}`, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("Cannot reach the TrendTube API. Is the backend running?");
  }
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export interface VideoQuery {
  continent?: string | null;
  region?: string | null;
  search?: string;
  sort?: VideoSort;
  limit?: number;
  offset?: number;
}

export const api = {
  continents: (signal?: AbortSignal) => get<ContinentInfo[]>("/api/continents", {}, signal),
  overview: (continent: string | null, signal?: AbortSignal) =>
    get<Kpis>("/api/overview", { continent }, signal),
  regions: (continent: string | null, signal?: AbortSignal) =>
    get<RegionStat[]>("/api/regions", { continent }, signal),
  categories: (continent: string | null, signal?: AbortSignal) =>
    get<CategoryStat[]>("/api/categories", { continent }, signal),
  insights: (continent: string | null, signal?: AbortSignal) =>
    get<Insights>("/api/insights", { continent }, signal),
  videos: (query: VideoQuery, signal?: AbortSignal) =>
    get<VideosPage>("/api/videos", { ...query }, signal),
};
