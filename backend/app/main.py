"""TrendTube API.  Run:  uvicorn app.main:app --reload --port 8000"""
import logging
from contextlib import asynccontextmanager
from typing import Annotated, Literal

import psycopg
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from psycopg_pool import PoolTimeout

from . import queries
from .db import close_pool
from .schemas import (CategoryStat, ContinentInfo, Health, Insights, Kpis,
                      RegionStat, VideosPage)
from .settings import cors_origins

log = logging.getLogger("trendtube")

Continent = Literal["Asia", "Europe", "North America", "South America",
                    "Africa", "Oceania", "Antarctica"]
ContinentQ = Annotated[Continent | None, Query(description="One of the seven continents")]
RegionQ = Annotated[str | None, Query(pattern="^[A-Za-z]{2}$", description="ISO country code, e.g. IN")]


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    close_pool()


app = FastAPI(title="TrendTube API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.exception_handler(psycopg.Error)
@app.exception_handler(PoolTimeout)
async def database_error(_: Request, exc: Exception):
    # Log the type only - never echo connection details to clients.
    log.error("Database error: %s", type(exc).__name__)
    return JSONResponse(status_code=503, content={"detail": "Database unavailable. Please try again shortly."})


def _region(value: str | None) -> str | None:
    return value.upper() if value else None


@app.get("/api/health", response_model=Health)
def health():
    queries.ping()
    return Health(status="ok", database="ok")


@app.get("/api/continents", response_model=list[ContinentInfo])
def get_continents():
    return queries.continents()


@app.get("/api/overview", response_model=Kpis)
def get_overview(continent: ContinentQ = None, region: RegionQ = None):
    return queries.overview(continent, _region(region))


@app.get("/api/regions", response_model=list[RegionStat])
def get_regions(continent: ContinentQ = None):
    return queries.regions(continent)


@app.get("/api/videos", response_model=VideosPage)
def get_videos(
    continent: ContinentQ = None,
    region: RegionQ = None,
    search: Annotated[str | None, Query(max_length=100)] = None,
    category_id: Annotated[int | None, Query(ge=0, le=1000)] = None,
    sort: Literal["views", "likes", "comments", "rank"] = "views",
    limit: Annotated[int, Query(ge=1, le=100)] = 24,
    offset: Annotated[int, Query(ge=0, le=10000)] = 0,
):
    return queries.videos(continent, _region(region), search, category_id, sort, limit, offset)


@app.get("/api/categories", response_model=list[CategoryStat])
def get_categories(continent: ContinentQ = None, region: RegionQ = None):
    return queries.categories(continent, _region(region))


@app.get("/api/insights", response_model=Insights)
def get_insights(continent: ContinentQ = None):
    return queries.insights(continent)
