"""Static lookups: continents, country names, official YouTube category names."""

CONTINENTS = [
    "Asia", "Europe", "North America", "South America",
    "Africa", "Oceania", "Antarctica",
]

COUNTRY_NAMES = {
    "IN": "India", "JP": "Japan", "GB": "United Kingdom", "DE": "Germany",
    "US": "United States", "CA": "Canada", "BR": "Brazil",
    "ZA": "South Africa", "AU": "Australia",
}

# YouTube Data API v3 videoCategories (US-region list). Unknown IDs are shown
# as "Category <id>" and flagged as unmapped - names are never invented.
CATEGORY_NAMES = {
    1: "Film & Animation", 2: "Autos & Vehicles", 10: "Music",
    15: "Pets & Animals", 17: "Sports", 18: "Short Movies",
    19: "Travel & Events", 20: "Gaming", 21: "Videoblogging",
    22: "People & Blogs", 23: "Comedy", 24: "Entertainment",
    25: "News & Politics", 26: "Howto & Style", 27: "Education",
    28: "Science & Technology", 29: "Nonprofits & Activism", 30: "Movies",
    31: "Anime/Animation", 32: "Action/Adventure", 33: "Classics",
    34: "Comedy (Movies)", 35: "Documentary", 36: "Drama", 37: "Family",
    38: "Foreign", 39: "Horror", 40: "Sci-Fi/Fantasy", 41: "Thriller",
    42: "Shorts", 43: "Shows", 44: "Trailers",
}


def category_name(category_id: int | None) -> tuple[str, bool]:
    """Return (name, mapped)."""
    if category_id is None:
        return "Uncategorised", True
    name = CATEGORY_NAMES.get(category_id)
    return (name, True) if name else (f"Category {category_id}", False)


def country_name(code: str) -> str:
    return COUNTRY_NAMES.get(code, code)
