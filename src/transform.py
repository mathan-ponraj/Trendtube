import json
import re

from config.config import RAW_DATA_DIR, REGIONS


def load_raw_data(file_path):
    """Read one raw YouTube JSON file."""

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def convert_duration(duration):
    """Convert YouTube duration like PT3M24S into seconds."""

    if not duration:
        return 0

    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)

    if not match:
        return 0

    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)

    return hours * 3600 + minutes * 60 + seconds


def transform_video(item, region_code):
    """Clean and structure one YouTube video."""

    snippet = item.get("snippet", {})
    statistics = item.get("statistics", {})
    content = item.get("contentDetails", {})

    continent = REGIONS.get(region_code, "Unknown")

    return {
        "video_id": item.get("id"),
        "title": snippet.get("title", "").strip(),
        "description": snippet.get("description", "").strip(),
        "published_at": snippet.get("publishedAt"),
        "channel_id": snippet.get("channelId"),
        "channel_name": snippet.get("channelTitle", "").strip(),
        "category_id": snippet.get("categoryId"),
        "tags": snippet.get("tags", []),
        "duration_seconds": convert_duration(content.get("duration")),
        "definition": content.get("definition"),
        "caption": content.get("caption"),
        "view_count": int(statistics.get("viewCount", 0)),
        "like_count": int(statistics.get("likeCount", 0)),
        "comment_count": int(statistics.get("commentCount", 0)),
        "region_code": region_code,
        "continent": continent,
    }


def transform_file(file_path):
    """Transform all videos from one regional snapshot."""

    data = load_raw_data(file_path)

    # Example filename: trending_IN_20261002_124636.json
    file_name = file_path.stem
    region_code = file_name.split("_")[1]

    records = []

    for rank, item in enumerate(data.get("items", []), start=1):
        video = transform_video(item, region_code)
        video["rank"] = rank

        # Use the timestamp stored in the filename
        video["fetched_at"] = file_name.split("_", 2)[2]

        records.append(video)

    return records


def transform_all_regions():
    """Transform all regional YouTube snapshots."""

    all_records = []

    raw_files = sorted(RAW_DATA_DIR.glob("trending_*.json"))

    if not raw_files:
        print("No raw JSON files found.")
        return []

    print(f"Found {len(raw_files)} raw files.")

    for file_path in raw_files:

        print(f"Transforming {file_path.name}...")

        records = transform_file(file_path)

        # Remove duplicate video IDs within a region
        seen = set()
        unique_records = []

        for record in records:
            key = (record["video_id"], record["region_code"])

            if key not in seen:
                seen.add(key)
                unique_records.append(record)

        all_records.extend(unique_records)

        print(f"  {len(unique_records)} records transformed.")

    print(f"\nTotal records transformed: {len(all_records)}")

    return all_records


if __name__ == "__main__":

    records = transform_all_regions()

    if records:
        print("\nFirst transformed record:")
        print(records[0])
