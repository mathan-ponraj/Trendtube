"""All SQL lives here. Every query is parameterised (no string-built values).

"Latest snapshot" = for each region, the rows whose fetched_at equals that
region's own MAX(fetched_at). Regions are NOT assumed to share a timestamp.
"""
import re
from collections import Counter
from typing import Any

from .db import fetch_all, fetch_one
from .lookups import CONTINENTS, category_name, country_name

SNAPSHOT_CTE = """
WITH latest AS (
    SELECT region_key, MAX(fetched_at) AS fetched_at
    FROM fact_trending
    GROUP BY region_key
),
snap AS (
    SELECT f.video_key, f.rank, f.view_count, f.like_count, f.comment_count,
           f.fetched_at, r.region_code, r.continent,
           v.video_id, v.title, v.channel_id, v.channel_name,
           v.category_id, v.duration_seconds
    FROM fact_trending f
    JOIN latest l      ON l.region_key = f.region_key AND l.fetched_at = f.fetched_at
    JOIN dim_region r  ON r.region_key = f.region_key
    JOIN dim_video v   ON v.video_key  = f.video_key
    WHERE (%(continent)s::text IS NULL OR r.continent = %(continent)s::text)
      AND (%(region)s::text    IS NULL OR r.region_code = %(region)s::text)
)
"""

RATIO_PARTS = """
    COALESCE(SUM(like_count) FILTER (WHERE like_count > 0), 0)::bigint AS likes_visible,
    COALESCE(SUM(view_count) FILTER (WHERE like_count > 0), 0)::bigint AS views_with_likes
"""


def _scope(continent: str | None, region: str | None = None) -> dict[str, Any]:
    return {"continent": continent, "region": region}


def _ratio(likes: int, views: int) -> float | None:
    """Like-to-view ratio in percent, or None when it cannot be computed."""
    return round(likes / views * 100, 2) if views > 0 else None


def ping() -> bool:
    return fetch_one("SELECT 1 AS ok") is not None


def continents() -> list[dict[str, Any]]:
    rows = fetch_all(
        """
        WITH latest AS (
            SELECT region_key, MAX(fetched_at) AS fetched_at
            FROM fact_trending GROUP BY region_key
        )
        SELECT r.continent, r.region_code,
               COUNT(f.trending_key) AS records
        FROM dim_region r
        LEFT JOIN latest l ON l.region_key = r.region_key
        LEFT JOIN fact_trending f
               ON f.region_key = l.region_key AND f.fetched_at = l.fetched_at
        GROUP BY r.continent, r.region_code
        """
    )
    totals = fetch_all(
        """
        SELECT r.continent, COUNT(*) AS records_all_time
        FROM fact_trending f JOIN dim_region r USING (region_key)
        GROUP BY r.continent
        """
    )
    all_time = {t["continent"]: t["records_all_time"] for t in totals}
    out = []
    for name in CONTINENTS:
        mine = [r for r in rows if r["continent"] == name]
        records = sum(r["records"] for r in mine)
        out.append({
            "name": name,
            "available": records > 0,
            "regions": len(mine),
            "region_codes": sorted(r["region_code"] for r in mine),
            "records": records,
            "records_all_time": all_time.get(name, 0),
            "note": None if mine else "Data unavailable - no region is collected for this continent.",
        })
    return out


def overview(continent: str | None, region: str | None = None) -> dict[str, Any]:
    row = fetch_one(
        SNAPSHOT_CTE + f"""
        SELECT COUNT(*) AS video_records,
               COUNT(DISTINCT video_id) AS unique_videos,
               COUNT(DISTINCT region_code) AS regions,
               COALESCE(SUM(view_count), 0)::bigint AS total_views,
               COALESCE(SUM(like_count), 0)::bigint AS total_likes,
               COALESCE(SUM(comment_count), 0)::bigint AS total_comments,
               COUNT(*) FILTER (WHERE like_count = 0) AS hidden_likes,
               {RATIO_PARTS},
               MAX(fetched_at) AS latest_fetched_at
        FROM snap
        """,
        _scope(continent, region),
    ) or {}
    return {
        "continent": continent,
        "video_records": row.get("video_records", 0),
        "unique_videos": row.get("unique_videos", 0),
        "regions": row.get("regions", 0),
        "total_views": row.get("total_views", 0),
        "total_likes": row.get("total_likes", 0),
        "total_comments": row.get("total_comments", 0),
        "like_to_view_ratio": _ratio(row.get("likes_visible", 0), row.get("views_with_likes", 0)),
        "videos_with_hidden_likes": row.get("hidden_likes", 0),
        "latest_fetched_at": row.get("latest_fetched_at"),
    }


def regions(continent: str | None = None) -> list[dict[str, Any]]:
    rows = fetch_all(
        SNAPSHOT_CTE + f"""
        SELECT region_code, MAX(continent) AS continent, COUNT(*) AS records,
               COALESCE(SUM(view_count), 0)::bigint AS total_views,
               COALESCE(SUM(like_count), 0)::bigint AS total_likes,
               COALESCE(SUM(comment_count), 0)::bigint AS total_comments,
               {RATIO_PARTS},
               MAX(fetched_at) AS latest_fetched_at
        FROM snap
        GROUP BY region_code
        ORDER BY total_views DESC
        """,
        _scope(continent),
    )
    return [{
        "region_code": r["region_code"],
        "region_name": country_name(r["region_code"]),
        "continent": r["continent"],
        "records": r["records"],
        "total_views": r["total_views"],
        "total_likes": r["total_likes"],
        "total_comments": r["total_comments"],
        "like_to_view_ratio": _ratio(r["likes_visible"], r["views_with_likes"]),
        "latest_fetched_at": r["latest_fetched_at"],
    } for r in rows]


_SORTS = {
    "views": "view_count DESC, rank ASC",
    "likes": "like_count DESC, rank ASC",
    "comments": "comment_count DESC, rank ASC",
    "rank": "rank ASC, view_count DESC",
}


def _like_pattern(text: str | None) -> str | None:
    if not text or not text.strip():
        return None
    escaped = text.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"


def videos(continent, region, search, category_id, sort, limit, offset) -> dict[str, Any]:
    order = _SORTS[sort]  # sort is validated against this whitelist by the API layer
    params = {
        **_scope(continent, region),
        "search": _like_pattern(search),
        "category": category_id,
        "limit": limit,
        "offset": offset,
    }
    rows = fetch_all(
        SNAPSHOT_CTE + f"""
        SELECT video_id, title, channel_name, region_code, continent, rank,
               view_count, like_count, comment_count, category_id,
               duration_seconds, fetched_at, COUNT(*) OVER () AS total
        FROM snap
        WHERE (%(search)s::text IS NULL
               OR title ILIKE %(search)s::text ESCAPE '\\'
               OR channel_name ILIKE %(search)s::text ESCAPE '\\')
          AND (%(category)s::int IS NULL OR category_id = %(category)s::int)
        ORDER BY {order}
        LIMIT %(limit)s OFFSET %(offset)s
        """,
        params,
    )
    items = []
    for r in rows:
        name, _ = category_name(r["category_id"])
        items.append({
            "video_id": r["video_id"],
            "title": r["title"],
            "channel_name": r["channel_name"],
            "region_code": r["region_code"],
            "region_name": country_name(r["region_code"]),
            "continent": r["continent"],
            "rank": r["rank"],
            "view_count": r["view_count"],
            "like_count": r["like_count"],
            "comment_count": r["comment_count"],
            "like_to_view_ratio": _ratio(r["like_count"], r["view_count"]) if r["like_count"] > 0 else None,
            "category_id": r["category_id"],
            "category_name": name,
            "duration_seconds": r["duration_seconds"],
            "fetched_at": r["fetched_at"],
            "thumbnail_url": f"https://i.ytimg.com/vi/{r['video_id']}/hqdefault.jpg",
            "youtube_url": f"https://www.youtube.com/watch?v={r['video_id']}",
        })
    total = rows[0]["total"] if rows else 0
    return {"total": total, "limit": limit, "offset": offset, "items": items}


def categories(continent: str | None, region: str | None = None) -> list[dict[str, Any]]:
    rows = fetch_all(
        SNAPSHOT_CTE + f"""
        SELECT category_id, COUNT(*) AS videos,
               COALESCE(SUM(view_count), 0)::bigint AS total_views,
               COALESCE(SUM(like_count), 0)::bigint AS total_likes,
               {RATIO_PARTS}
        FROM snap
        GROUP BY category_id
        ORDER BY videos DESC, total_views DESC
        """,
        _scope(continent, region),
    )
    out = []
    for r in rows:
        name, mapped = category_name(r["category_id"])
        out.append({
            "category_id": r["category_id"],
            "category_name": name,
            "mapped": mapped,
            "videos": r["videos"],
            "total_views": r["total_views"],
            "total_likes": r["total_likes"],
            "like_to_view_ratio": _ratio(r["likes_visible"], r["views_with_likes"]),
        })
    return out


_STOPWORDS = set("""
the and for with from this that you your are was were will not but have has had
how what why who when where official video videos new full part episode trailer
music lyrics audio live feat ft vs into out all one two our its his her they them
their about more most can just than then there here also been being over under
der die das und mit von ist ein eine nicht auf den dem des für zu im
de da do em um uma para com por que os as se no na dos das ao
le la les des est pour dans sur une
""".split())


def _keywords(titles: list[str]) -> list[dict[str, Any]]:
    counter: Counter[str] = Counter()
    for title in titles:
        words = {w.lower() for w in re.findall(r"[^\W\d_]{3,}", title or "")}
        counter.update(w for w in words if w not in _STOPWORDS)
    return [{"word": w, "videos": n} for w, n in counter.most_common(15) if n >= 2][:12]


def insights(continent: str | None) -> dict[str, Any]:
    scope = _scope(continent)
    cats = categories(continent)
    regs = regions(continent)

    channels = fetch_all(
        SNAPSHOT_CTE + """
        SELECT channel_name, COUNT(*) AS appearances,
               COUNT(DISTINCT region_code) AS regions,
               COALESCE(SUM(view_count), 0)::bigint AS total_views
        FROM snap
        GROUP BY channel_id, channel_name
        HAVING COUNT(*) >= 2
        ORDER BY appearances DESC, total_views DESC
        LIMIT 8
        """,
        scope,
    )
    formats = fetch_all(
        SNAPSHOT_CTE + """
        SELECT CASE
                 WHEN duration_seconds IS NULL THEN 'Unknown'
                 WHEN duration_seconds <= 60   THEN 'Up to 1 min'
                 WHEN duration_seconds <= 240  THEN '1-4 min'
                 WHEN duration_seconds <= 600  THEN '4-10 min'
                 WHEN duration_seconds <= 1200 THEN '10-20 min'
                 ELSE 'Over 20 min'
               END AS label,
               MIN(COALESCE(duration_seconds, 0)) AS sort_key,
               COUNT(*) AS videos,
               COALESCE(SUM(view_count), 0)::bigint AS total_views
        FROM snap
        GROUP BY 1
        ORDER BY sort_key
        """,
        scope,
    )
    titles = fetch_all(SNAPSHOT_CTE + "SELECT title FROM snap", scope)

    facts: list[dict[str, str]] = []
    if cats:
        top = cats[0]
        total = sum(c["videos"] for c in cats)
        facts.append({
            "title": f"{top['category_name']} has the most trending videos",
            "detail": f"{top['videos']} of {total} videos ({top['videos'] / total * 100:.0f}%) in the latest snapshots.",
        })
        by_views = max(cats, key=lambda c: c["total_views"])
        if by_views is not top:
            facts.append({
                "title": f"{by_views['category_name']} leads on combined views",
                "detail": f"{by_views['total_views']:,} recorded views across {by_views['videos']} videos.",
            })
    if regs:
        facts.append({
            "title": f"{regs[0]['region_name']} has the highest combined views",
            "detail": f"{regs[0]['total_views']:,} recorded views across {regs[0]['records']} trending videos.",
        })
    if channels:
        c = channels[0]
        facts.append({
            "title": f"{c['channel_name']} appears most often",
            "detail": f"{c['appearances']} trending slots across {c['regions']} region(s).",
        })
    if formats:
        f = max(formats, key=lambda x: x["videos"])
        facts.append({
            "title": f"Most common length: {f['label']}",
            "detail": f"{f['videos']} trending videos fall in this duration range.",
        })

    return {
        "continent": continent,
        "facts": facts,
        "top_categories": cats[:8],
        "regions": regs,
        "frequent_channels": channels,
        "duration_formats": [{k: f[k] for k in ("label", "videos", "total_views")} for f in formats],
        "title_keywords": _keywords([t["title"] for t in titles]),
    }
