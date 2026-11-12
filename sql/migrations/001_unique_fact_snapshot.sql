-- Migration 001 - make ON CONFLICT (video_key, region_key, fetched_at) valid.
-- Run against an EXISTING database. Nothing here deletes data.
--
-- STEP 1: look for duplicates (must return 0 rows before STEP 2 can succeed).
SELECT video_key, region_key, fetched_at, COUNT(*) AS copies
FROM fact_trending
GROUP BY video_key, region_key, fetched_at
HAVING COUNT(*) > 1;

-- STEP 2: create the unique index (only if STEP 1 returned no rows).
-- CREATE INDEX CONCURRENTLY cannot run inside a transaction block;
-- psql -f runs each statement on its own, so this is fine.
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS ux_fact_region_fetched_video
    ON fact_trending (region_key, fetched_at, video_key);

-- STEP 2b (ONLY if STEP 1 found duplicates): back up first, e.g.
--   pg_dump -U postgres youtube_trending > backup.sql
-- then review and run inside a transaction you can ROLLBACK:
--   BEGIN;
--   DELETE FROM fact_trending a
--   USING fact_trending b
--   WHERE a.video_key = b.video_key AND a.region_key = b.region_key
--     AND a.fetched_at = b.fetched_at AND a.trending_key > b.trending_key;
--   -- check counts, then COMMIT; (or ROLLBACK;)
-- and afterwards re-run STEP 2.
