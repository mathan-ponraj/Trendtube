-- Read-only health checks. Run with: psql -U postgres -d youtube_trending -f sql/diagnostics.sql

SELECT 'dim_video' AS tbl, COUNT(*) FROM dim_video
UNION ALL SELECT 'dim_region', COUNT(*) FROM dim_region
UNION ALL SELECT 'dim_date', COUNT(*) FROM dim_date
UNION ALL SELECT 'fact_trending', COUNT(*) FROM fact_trending;

SELECT r.region_code, r.continent,
       COUNT(DISTINCT f.fetched_at) AS snapshots,
       MIN(f.fetched_at) AS first_fetch,
       MAX(f.fetched_at) AS last_fetch,
       COUNT(*) AS records
FROM fact_trending f JOIN dim_region r USING (region_key)
GROUP BY 1, 2 ORDER BY 1;

SELECT video_key, region_key, fetched_at, COUNT(*)
FROM fact_trending GROUP BY 1, 2, 3 HAVING COUNT(*) > 1 LIMIT 20;

SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public';

SELECT category_id, COUNT(*) FROM dim_video GROUP BY 1 ORDER BY 2 DESC;
