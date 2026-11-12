# TrendTube - Global YouTube Creator Intelligence Platform

Python ETL (YouTube Data API v3 -> PostgreSQL star schema) plus a read-only analytics
dashboard (FastAPI + React/TypeScript/ECharts).

```
trendtube/
  main.py, config/, src/, sql/     ETL + schema (unchanged logic, see notes)
  backend/                         FastAPI read-only API
  frontend/                        React + Vite + Tailwind + ECharts dashboard
  render.yaml                      Render blueprint for the API
```

## 1. Database

```bash
createdb youtube_trending
psql -U postgres -d youtube_trending -f sql/schema.sql
```

**Existing database?** Do NOT re-run schema.sql. Run `sql/migrations/001_unique_fact_snapshot.sql`
step by step instead: it checks for duplicates before creating the unique index that the loader's
`ON CONFLICT (video_key, region_key, fetched_at)` requires. Without that index the fact-table
load fails with "no unique or exclusion constraint matching the ON CONFLICT specification".
`sql/diagnostics.sql` contains read-only health checks.

## 2. ETL

```bash
python -m venv venv && .\venv\Scripts\Activate.ps1      # Windows PowerShell
pip install -r requirements.txt
cp .env.example .env                                    # then fill in real values
python main.py                  # extract + transform + load
python main.py --skip-extract   # re-load existing raw files only
```

## 3. Backend (http://localhost:8000, docs at /docs)

```bash
cd backend
python -m venv venv && .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Reads `backend/.env` or the project-root `.env`. Check `GET /api/health`.

Endpoints: `/api/health`, `/api/continents`, `/api/overview`, `/api/regions`, `/api/videos`,
`/api/categories`, `/api/insights` (continent filter: `?continent=Asia`).
All queries are parameterised and the DB connection is read-only.

## 4. Frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev          # /api is proxied to localhost:8000
npm run build        # type-check + production build
```

## 5. Deploy

**Database**: a hosted PostgreSQL (Render, Neon or Supabase). Your local DB is not reachable from
Render; copy it with `pg_dump` / `psql` (or `pg_restore`) and keep the same schema.

**Backend (Render)**: New > Blueprint (uses `render.yaml`) or a Web Service with root directory `backend`.
Set `DATABASE_URL` (with `?sslmode=require` if your host needs it) and
`CORS_ORIGINS=https://<your-vercel-domain>`. Verify `https://<api>/api/health`.

**Frontend (Vercel)**: import the GitHub repo, set Root Directory to `frontend`, framework Vite.
Set `VITE_API_BASE_URL=https://<your-render-api>` (no trailing slash), then redeploy.

## Data definitions

* Latest snapshot: each region's own `MAX(fetched_at)`; regions are not assumed to share a timestamp.
* Combined views = sum of recorded view counts (not views gained during collection).
* Like-to-view ratio = likes / views x 100 over videos with a visible like count (hidden likes are stored as 0).
* Category names come from the official YouTube category list; unknown IDs show as "Category <id>".
* Coverage = the 9 configured countries (IN, JP, GB, DE, US, CA, BR, ZA, AU). Antarctica shows "Data unavailable".
* No growth/trend-over-time figures are shown: they need multiple snapshots.

## Notes on this package

* `src/database.py` was recreated (original not available). Keep yours if it exposes `get_connection()`.
* `src/validate.py` and `src/pipeline.py` were not available and are not included.
* `.gitignore` no longer ignores `*.json`/`*.csv` globally (that would hide `package.json`); raw data stays ignored via `data/`.

Author: Mathan Ponraj
