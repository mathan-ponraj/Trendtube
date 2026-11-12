import os
from pathlib import Path

from dotenv import load_dotenv


# Project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env in the project root
load_dotenv(BASE_DIR / ".env")


# YouTube API configuration
API_KEY = os.getenv("YT_API_KEY", "")
MAX_RESULTS = int(os.getenv("MAX_RESULTS", "50"))


# Regional configuration
# Country code -> Continent
REGIONS = {
    "IN": "Asia",
    "JP": "Asia",
    "GB": "Europe",
    "DE": "Europe",
    "US": "North America",
    "CA": "North America",
    "BR": "South America",
    "ZA": "Africa",
    "AU": "Oceania",
}


# PostgreSQL configuration
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "youtube_trending")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Raw data directory
RAW_DATA_DIR = BASE_DIR / "data" / "raw"
