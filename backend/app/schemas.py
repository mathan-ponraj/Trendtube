"""Pydantic response models."""
from datetime import datetime

from pydantic import BaseModel


class Health(BaseModel):
    status: str
    database: str


class ContinentInfo(BaseModel):
    name: str
    available: bool
    regions: int
    region_codes: list[str]
    records: int              # records in the latest snapshot of each region
    records_all_time: int     # every stored observation
    note: str | None = None


class Kpis(BaseModel):
    continent: str | None
    video_records: int
    unique_videos: int
    regions: int
    total_views: int
    total_likes: int
    total_comments: int
    like_to_view_ratio: float | None   # percent, videos with visible likes only
    videos_with_hidden_likes: int
    latest_fetched_at: datetime | None


class RegionStat(BaseModel):
    region_code: str
    region_name: str
    continent: str | None
    records: int
    total_views: int
    total_likes: int
    total_comments: int
    like_to_view_ratio: float | None
    latest_fetched_at: datetime | None


class Video(BaseModel):
    video_id: str
    title: str | None
    channel_name: str | None
    region_code: str
    region_name: str
    continent: str | None
    rank: int
    view_count: int
    like_count: int
    comment_count: int
    like_to_view_ratio: float | None
    category_id: int | None
    category_name: str
    duration_seconds: int | None
    fetched_at: datetime
    thumbnail_url: str
    youtube_url: str


class VideosPage(BaseModel):
    total: int
    limit: int
    offset: int
    items: list[Video]


class CategoryStat(BaseModel):
    category_id: int | None
    category_name: str
    mapped: bool
    videos: int
    total_views: int
    total_likes: int
    like_to_view_ratio: float | None


class ChannelStat(BaseModel):
    channel_name: str | None
    appearances: int
    regions: int
    total_views: int


class BucketStat(BaseModel):
    label: str
    videos: int
    total_views: int


class KeywordStat(BaseModel):
    word: str
    videos: int


class Fact(BaseModel):
    title: str
    detail: str


class Insights(BaseModel):
    continent: str | None
    facts: list[Fact]
    top_categories: list[CategoryStat]
    regions: list[RegionStat]
    frequent_channels: list[ChannelStat]
    duration_formats: list[BucketStat]
    title_keywords: list[KeywordStat]
