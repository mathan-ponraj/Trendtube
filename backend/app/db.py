"""Read-only PostgreSQL access (psycopg 3 + a small connection pool)."""
from typing import Any

from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from .settings import database_conninfo

_pool: ConnectionPool | None = None


def _make_read_only(conn) -> None:
    # Every transaction on this connection is READ ONLY, so the API can never
    # modify the ETL tables, even by mistake.
    conn.read_only = True


def get_pool() -> ConnectionPool:
    global _pool
    if _pool is None:
        _pool = ConnectionPool(
            conninfo=database_conninfo(),
            min_size=1,
            max_size=5,
            open=False,
            configure=_make_read_only,
            kwargs={"row_factory": dict_row, "connect_timeout": 10},
        )
        _pool.open(wait=False)
    return _pool


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.close()
        _pool = None


def fetch_all(sql: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    with get_pool().connection(timeout=8) as conn:
        return conn.execute(sql, params or {}).fetchall()


def fetch_one(sql: str, params: dict[str, Any] | None = None) -> dict[str, Any] | None:
    with get_pool().connection(timeout=8) as conn:
        return conn.execute(sql, params or {}).fetchone()
