"""ETL entry point:  python main.py [--skip-extract]

1. Extract  - call the YouTube API for every region in config.REGIONS
              (saves raw JSON into data/raw/).
2. Transform + Load - process all raw files and load PostgreSQL.

Re-running is safe: the unique index on fact_trending makes the load idempotent.
"""
import sys

from config.config import REGIONS
from src.extract import extract_trending_videos
from src.load import load_dates, load_regions, load_trending, load_videos
from src.transform import transform_all_regions


def run(skip_extract: bool = False) -> None:
    if not skip_extract:
        for region_code, continent in REGIONS.items():
            print(f"\nExtracting {region_code} ({continent})...")
            try:
                videos = extract_trending_videos(region_code)
                print(f"  {len(videos)} videos extracted.")
            except Exception as error:  # keep going with the other regions
                print(f"  Extraction failed for {region_code}: {error}")

    records = transform_all_regions()

    if not records:
        print("Nothing to load.")
        return

    load_regions()
    load_dates(records)
    load_videos(records)
    load_trending(records)


if __name__ == "__main__":
    run(skip_extract="--skip-extract" in sys.argv)
