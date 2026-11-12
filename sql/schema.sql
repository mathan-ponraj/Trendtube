-- TrendTube - PostgreSQL star schema (analytics layer)
-- Apply with:  psql -U postgres -d youtube_trending -f sql/schema.sql

-- 1. Video dimension
CREATE TABLE IF NOT EXISTS dim_video (
    video_key SERIAL PRIMARY KEY,
    video_id VARCHAR(20) UNIQUE NOT NULL,

    title TEXT,
    description TEXT,

    channel_id VARCHAR(50),
    channel_name TEXT,

    category_id INTEGER,

    duration_seconds INTEGER,

    definition VARCHAR(10),
    caption VARCHAR(10),

    tags TEXT[],

    published_at TIMESTAMP
);

-- 2. Region dimension
CREATE TABLE IF NOT EXISTS dim_region (
    region_key SERIAL PRIMARY KEY,

    region_code VARCHAR(10) UNIQUE NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    continent VARCHAR(100)
);

-- 3. Date dimension
CREATE TABLE IF NOT EXISTS dim_date (
    date_key INTEGER PRIMARY KEY,

    full_date DATE UNIQUE NOT NULL,

    year INTEGER,
    month INTEGER,
    month_name VARCHAR(20),
    quarter INTEGER,
    day INTEGER
);

-- 4. Trending fact table
CREATE TABLE IF NOT EXISTS fact_trending (
    trending_key BIGSERIAL PRIMARY KEY,

    video_key INTEGER NOT NULL,
    region_key INTEGER NOT NULL,
    date_key INTEGER NOT NULL,

    rank INTEGER NOT NULL,

    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,

    fetched_at TIMESTAMP NOT NULL,

    FOREIGN KEY (video_key)  REFERENCES dim_video(video_key),
    FOREIGN KEY (region_key) REFERENCES dim_region(region_key),
    FOREIGN KEY (date_key)   REFERENCES dim_date(date_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fact_video  ON fact_trending(video_key);
CREATE INDEX IF NOT EXISTS idx_fact_region ON fact_trending(region_key);
CREATE INDEX IF NOT EXISTS idx_fact_date   ON fact_trending(date_key);

-- Required by the loader's ON CONFLICT (video_key, region_key, fetched_at)
-- and used by the dashboard's "latest snapshot per region" queries.
-- For an EXISTING database use sql/migrations/001_unique_fact_snapshot.sql instead.
CREATE UNIQUE INDEX IF NOT EXISTS ux_fact_region_fetched_video
    ON fact_trending (region_key, fetched_at, video_key);
