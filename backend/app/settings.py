"""Backend configuration, read from environment variables only."""
import os
from pathlib import Path

from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(_BACKEND_DIR / ".env")          # backend/.env
load_dotenv(_BACKEND_DIR.parent / ".env")   # project-root .env (does not override)


def database_conninfo() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    parts = {
        "host": os.getenv("DB_HOST", "localhost"),
        "port": os.getenv("DB_PORT", "5432"),
        "dbname": os.getenv("DB_NAME", "youtube_trending"),
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", ""),
    }
    sslmode = os.getenv("DB_SSLMODE")
    if sslmode:
        parts["sslmode"] = sslmode
    # psycopg conninfo "key=value" format; values quoted so spaces are safe
    return " ".join(
        "{}='{}'".format(k, str(v).replace("\\", "\\\\").replace("'", "\\'"))
        for k, v in parts.items()
        if v != ""
    )


def cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    return [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]
