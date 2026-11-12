"""PostgreSQL connection helper used by the ETL loaders.

NOTE: this file was recreated because the original was not available.
If you have your own src/database.py, keep yours - it only needs to
expose get_connection() returning a psycopg 3 connection.
"""
import psycopg

from config.config import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER


def get_connection():
    return psycopg.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )
