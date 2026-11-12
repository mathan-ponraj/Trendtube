from datetime import datetime, timezone
import json

from googleapiclient.discovery import build

from config.config import (
    API_KEY,
    MAX_RESULTS,
    RAW_DATA_DIR,
    REGIONS,
)


def extract_trending_videos(region_code, max_results=MAX_RESULTS):
    """
    Extract trending videos from the YouTube Data API
    for a specific country/region.

    Args:
        region_code (str): YouTube-supported country code.
        max_results (int): Maximum number of videos to retrieve.

    Returns:
        list[dict]: Extracted video records.
    """

    if not API_KEY:
        raise ValueError("YouTube API key is missing. Check your .env file.")

    youtube = build("youtube", "v3", developerKey=API_KEY)

    fetched_at = datetime.now(timezone.utc)

    request = youtube.videos().list(
        part="snippet,statistics,contentDetails",
        chart="mostPopular",
        regionCode=region_code,
        maxResults=max_results,
    )

    response = request.execute()

    videos = []

    for rank, item in enumerate(response.get("items", []), start=1):
        snippet = item.get("snippet", {})
        statistics = item.get("statistics", {})
        content_details = item.get("contentDetails", {})

        video = {
            "video_id": item.get("id"),
            "title": snippet.get("title"),
            "description": snippet.get("description"),
            "published_at": snippet.get("publishedAt"),
            "channel_id": snippet.get("channelId"),
            "channel_name": snippet.get("channelTitle"),
            "category_id": snippet.get("categoryId"),
            "tags": snippet.get("tags", []),
            "duration": content_details.get("duration"),
            "definition": content_details.get("definition"),
            "caption": content_details.get("caption"),
            "view_count": int(statistics.get("viewCount", 0)),
            "like_count": int(statistics.get("likeCount", 0)),
            "comment_count": int(statistics.get("commentCount", 0)),
            "region_code": region_code,
            "rank": rank,
            "fetched_at": fetched_at.isoformat(),
        }

        videos.append(video)

    save_raw_response(
        response=response,
        region_code=region_code,
        fetched_at=fetched_at,
    )

    return videos


def save_raw_response(response, region_code, fetched_at):
    """Save the original YouTube API response as a JSON snapshot."""

    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = fetched_at.strftime("%Y%m%d_%H%M%S")

    file_path = RAW_DATA_DIR / f"trending_{region_code}_{timestamp}.json"

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(response, file, indent=2, ensure_ascii=False)

    print(f"Raw API response saved to: {file_path}")


if __name__ == "__main__":

    for region_code, continent in REGIONS.items():

        print(f"\nExtracting trending videos for {region_code} ({continent})...")

        videos = extract_trending_videos(region_code=region_code)

        print(f"Extracted {len(videos)} videos for {region_code} ({continent}).")
