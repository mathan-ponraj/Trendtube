from datetime import datetime

from config.config import REGIONS
from src.database import get_connection
from src.transform import transform_all_regions


def load_regions():
    """Load region information into dim_region."""

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            for region_code, continent in REGIONS.items():
                cursor.execute(
                    """
                    INSERT INTO dim_region (region_code, region_name, continent)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (region_code)
                    DO NOTHING;
                    """,
                    (region_code, region_code, continent),
                )

        connection.commit()
        print("Region data loaded successfully.")

    except Exception as error:
        connection.rollback()
        print("Failed to load region data.")
        print(error)

    finally:
        connection.close()


def load_dates(records):
    """Load snapshot dates into dim_date."""

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            dates = set()

            for record in records:
                fetched_at = datetime.strptime(record["fetched_at"], "%Y%m%d_%H%M%S")
                dates.add(fetched_at.date())

            for full_date in dates:
                date_key = int(full_date.strftime("%Y%m%d"))

                cursor.execute(
                    """
                    INSERT INTO dim_date (
                        date_key, full_date, year, month,
                        month_name, quarter, day
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (date_key)
                    DO NOTHING;
                    """,
                    (
                        date_key,
                        full_date,
                        full_date.year,
                        full_date.month,
                        full_date.strftime("%B"),
                        ((full_date.month - 1) // 3) + 1,
                        full_date.day,
                    ),
                )

        connection.commit()
        print("Date data loaded successfully.")

    except Exception as error:
        connection.rollback()
        print("Failed to load date data.")
        print(error)

    finally:
        connection.close()


def load_videos(records):
    """Load unique video information into dim_video."""

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            for record in records:

                category_id = record["category_id"]

                if category_id:
                    category_id = int(category_id)
                else:
                    category_id = None

                cursor.execute(
                    """
                    INSERT INTO dim_video (
                        video_id, title, description, channel_id,
                        channel_name, category_id, duration_seconds,
                        definition, caption, tags, published_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (video_id)
                    DO NOTHING;
                    """,
                    (
                        record["video_id"],
                        record["title"],
                        record["description"],
                        record["channel_id"],
                        record["channel_name"],
                        category_id,
                        record["duration_seconds"],
                        record["definition"],
                        record["caption"],
                        record["tags"],
                        record["published_at"],
                    ),
                )

        connection.commit()
        print("Video data loaded successfully.")

    except Exception as error:
        connection.rollback()
        print("Failed to load video data.")
        print(error)

    finally:
        connection.close()


def load_trending(records):
    """Load trending observations into fact_trending."""

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            for record in records:

                fetched_at = datetime.strptime(record["fetched_at"], "%Y%m%d_%H%M%S")
                date_key = int(fetched_at.strftime("%Y%m%d"))

                # Find the video's database key
                cursor.execute(
                    "SELECT video_key FROM dim_video WHERE video_id = %s;",
                    (record["video_id"],),
                )
                video_result = cursor.fetchone()

                if not video_result:
                    continue

                video_key = video_result[0]

                # Find the region's database key
                cursor.execute(
                    "SELECT region_key FROM dim_region WHERE region_code = %s;",
                    (record["region_code"],),
                )
                region_result = cursor.fetchone()

                if not region_result:
                    continue

                region_key = region_result[0]

                # Requires the unique index created in sql/schema.sql
                # (region_key, fetched_at, video_key).
                cursor.execute(
                    """
                    INSERT INTO fact_trending (
                        video_key, region_key, date_key, rank,
                        view_count, like_count, comment_count, fetched_at
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (video_key, region_key, fetched_at)
                    DO NOTHING;
                    """,
                    (
                        video_key,
                        region_key,
                        date_key,
                        record["rank"],
                        record["view_count"],
                        record["like_count"],
                        record["comment_count"],
                        fetched_at,
                    ),
                )

        connection.commit()
        print("Trending data loaded successfully.")

    except Exception as error:
        connection.rollback()
        print("Failed to load trending data.")
        print(error)

    finally:
        connection.close()


if __name__ == "__main__":

    records = transform_all_regions()

    if records:
        load_regions()
        load_dates(records)
        load_videos(records)
        load_trending(records)
