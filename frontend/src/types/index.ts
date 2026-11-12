export interface ContinentInfo {
  name: string;
  available: boolean;
  regions: number;
  region_codes: string[];
  records: number;
  records_all_time: number;
  note: string | null;
}

export interface Kpis {
  continent: string | null;
  video_records: number;
  unique_videos: number;
  regions: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  like_to_view_ratio: number | null;
  videos_with_hidden_likes: number;
  latest_fetched_at: string | null;
}

export interface RegionStat {
  region_code: string;
  region_name: string;
  continent: string | null;
  records: number;
  total_views: number;
  total_likes: number;
  total_comments: number;
  like_to_view_ratio: number | null;
  latest_fetched_at: string | null;
}

export interface Video {
  video_id: string;
  title: string | null;
  channel_name: string | null;
  region_code: string;
  region_name: string;
  continent: string | null;
  rank: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  like_to_view_ratio: number | null;
  category_id: number | null;
  category_name: string;
  duration_seconds: number | null;
  fetched_at: string;
  thumbnail_url: string;
  youtube_url: string;
}

export interface VideosPage {
  total: number;
  limit: number;
  offset: number;
  items: Video[];
}

export interface CategoryStat {
  category_id: number | null;
  category_name: string;
  mapped: boolean;
  videos: number;
  total_views: number;
  total_likes: number;
  like_to_view_ratio: number | null;
}

export interface ChannelStat {
  channel_name: string | null;
  appearances: number;
  regions: number;
  total_views: number;
}

export interface BucketStat {
  label: string;
  videos: number;
  total_views: number;
}

export interface KeywordStat {
  word: string;
  videos: number;
}

export interface Fact {
  title: string;
  detail: string;
}

export interface Insights {
  continent: string | null;
  facts: Fact[];
  top_categories: CategoryStat[];
  regions: RegionStat[];
  frequent_channels: ChannelStat[];
  duration_formats: BucketStat[];
  title_keywords: KeywordStat[];
}

export type Page = "overview" | "videos" | "insights";
export type VideoSort = "views" | "likes" | "comments" | "rank";
