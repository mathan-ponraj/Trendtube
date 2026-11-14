# TrendTube

Find what's trending. Create what's next. A Python ETL pipeline and dashboard that show what is trending on YouTube across 9 regions.

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-Visit%20Dashboard-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://trendtube-five.vercel.app/)

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![YouTube API](https://img.shields.io/badge/YouTube%20Data%20API%20v3-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## Problem Statement

YouTube creators need to know what is trending around the world before they decide what to make. Trending data is spread across regions and changes often, so it is hard to compare by hand.

## What I Built

In this project, I built an automated Python ETL pipeline that collects trending videos from 9 regions through the YouTube Data API and stores them in a PostgreSQL star schema. I then built a React and FastAPI dashboard that shows regional trends, video insights, and engagement metrics. I deployed the frontend on Vercel, the backend on Render, and the database on Neon.

## Key Features

- Collects trending videos from 9 countries through the YouTube Data API v3.
- Runs an ETL pipeline that extracts, transforms, and loads the data.
- Stores video data in a PostgreSQL star schema for analytical queries.
- Serves analytics through REST API endpoints built with FastAPI.
- Shows views, likes, comments, and like-to-view ratio on a dashboard.
- Compares trending categories and engagement across regions and continents.

## Tech Stack

| Area                  | Tools                       |
| --------------------- | --------------------------- |
| Language              | Python                      |
| Data source           | YouTube Data API v3         |
| Data engineering      | ETL, data transformation    |
| Data processing       | Pandas, NumPy               |
| Database              | PostgreSQL (Neon)           |
| Database connection   | Psycopg                     |
| Backend               | FastAPI, REST APIs          |
| Frontend              | React, TypeScript, Vite     |
| Charts and styling    | Apache ECharts, Tailwind CSS|
| Configuration         | Python-dotenv               |
| Deployment            | Vercel, Render, Neon        |
| Version control       | Git, GitHub                 |

## Project Structure

```text
TrendTube/
│
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app and routes
│   │   ├── db.py           # Database connection
│   │   ├── queries.py      # SQL queries for the API
│   │   └── schemas.py      # API response models
│   └── requirements.txt    # Backend dependencies
│
├── frontend/
│   ├── src/                # React and TypeScript code
│   ├── public/             # Static files
│   └── package.json        # Dependencies and npm scripts
│
├── config/
│   └── config.py           # Project settings
│
├── src/
│   ├── extract.py          # Gets trending videos from the YouTube API
│   ├── transform.py        # Cleans and structures the raw data
│   ├── load.py             # Loads data into PostgreSQL
│   └── database.py         # Database helper functions
│
├── sql/
│   ├── schema.sql          # Star schema tables
│   ├── diagnostics.sql     # Data check queries
│   └── migrations/         # Database changes
│
├── main.py                 # Runs the ETL pipeline
├── requirements.txt        # Pipeline dependencies
├── render.yaml             # Render deployment settings
├── .env.example            # Template for environment variables
├── .gitignore              # Files Git should ignore
└── README.md               # Project documentation
```

## Data

- **Source:** YouTube Data API v3, trending videos for each configured country.
- **Coverage:** 9 countries across 6 continents. Antarctica has no data because no region is set there.

| Country        | Code | Continent     |
| -------------- | ---- | ------------- |
| India          | IN   | Asia          |
| Japan          | JP   | Asia          |
| United Kingdom | GB   | Europe        |
| Germany        | DE   | Europe        |
| United States  | US   | North America |
| Canada         | CA   | North America |
| Brazil         | BR   | South America |
| South Africa   | ZA   | Africa        |
| Australia      | AU   | Oceania       |

- **Size:** [TODO: add the number of videos and snapshots collected so far]
- **Star schema:**

| Table           | Purpose                                         |
| --------------- | ----------------------------------------------- |
| `dim_video`     | Video details such as title and category        |
| `dim_region`    | Country and continent                           |
| `dim_date`      | Date information                                |
| `fact_trending` | Trending records with views, likes, and comments |

- **Columns:** [TODO: list the main columns of each table]
- **Cleaning steps:**
  - Save the raw API responses as JSON files.
  - Read the JSON files and keep only the fields needed.
  - Normalise the values and shape them into structured records.
  - Load region, date, and video records first, then the trending records.

## Approach / Methodology

1. Set the countries and settings in the config file.
2. Extract trending videos from the YouTube Data API v3 for each country.
3. Save the raw responses as JSON files.
4. Transform the data with Python and Pandas into clean records.
5. Load region, date, and video records into the PostgreSQL dimension tables.
6. Load the trending records into the fact table.
7. Run the pipeline again to add a new snapshot without overwriting old ones.
8. Build FastAPI endpoints that run SQL queries on the database.
9. Build the React and TypeScript dashboard with charts.
10. Deploy the frontend on Vercel, the backend on Render, and the database on Neon.

**Data flow:**

```text
YouTube Data API v3
        |
        v
Python ETL (extract -> transform -> load)
        |
        v
PostgreSQL star schema (Neon)
        |
        v
FastAPI REST API (Render)
        |
        v
React + TypeScript dashboard (Vercel)
```

The ETL pipeline runs on its own and loads data into Neon. The deployed API reads the database and sends the data to the dashboard.

**Metric definitions:**

- Combined views: the sum of recorded video view counts.
- Like-to-view ratio: total likes divided by total views, times 100.
- Latest snapshot: the most recent collection for each region.
- Growth over time needs more than one snapshot.

**API endpoints:**

| Endpoint          | What it returns                                  |
| ----------------- | ------------------------------------------------ |
| `/api/health`     | Backend and database health check                |
| `/api/continents` | Available continents                             |
| `/api/overview`   | Global overview                                  |
| `/api/regions`    | Trending information by region                   |
| `/api/videos`     | Trending video records                           |
| `/api/categories` | Category analytics                               |
| `/api/insights`   | Insights, with a continent filter                |

Example: `/api/insights?continent=Asia`. API docs are at `/docs` when the backend is running.

## Results and Insights

- Live and deployed: [trendtube-five.vercel.app](https://trendtube-five.vercel.app/)
- Regions covered: 9 countries across 6 continents.
- Dashboard metrics: combined views, trending and unique videos, total likes and comments, like-to-view ratio, category mix, and regional comparisons.
- Videos collected: [TODO: add the number]
- Snapshots collected: [TODO: add the number]
- Example insight: [TODO: add one real finding, such as the most common category in a region]

## How to Run Locally

Clone the repository:

```bash
git clone https://github.com/mathan-ponraj/Trendtube.git
```

Go to the project folder:

```bash
cd Trendtube
```

Create and activate a Python environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

On macOS or Linux, use `source venv/bin/activate` instead.

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
YT_API_KEY=your_youtube_api_key
MAX_RESULTS=50
DATABASE_URL=your_postgresql_connection_string
```

For a local PostgreSQL database, you can use these settings instead of `DATABASE_URL`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=youtube_trending
DB_USER=postgres
DB_PASSWORD=your_database_password
```

Never commit your `.env` file or share your API keys and database passwords.

Create the database and apply the schema:

```bash
createdb youtube_trending
psql -U postgres -d youtube_trending -f sql/schema.sql
```

If you use Neon, run the contents of `sql/schema.sql` in the Neon SQL Editor instead.

Run the ETL pipeline:

```bash
python main.py
```

To reuse the saved JSON files without new API requests:

```bash
python main.py --skip-extract
```

Start the backend in a new terminal:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000` and its docs at `http://localhost:8000/docs`.

Start the frontend in another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. To build for production, run `npm run build`.

## Screenshots

| Global overview | Regional comparison |
| --------------- | ------------------- |
| ![Overview](screenshots/overview.png) | ![Regions](screenshots/regions.png) |

| Trending videos | Category analytics |
| --------------- | ------------------ |
| ![Videos](screenshots/videos.png) | ![Categories](screenshots/categories.png) |

<!-- [TODO: add your screenshots to a screenshots/ folder with these file names, or update the paths] -->

## What I Learned and Future Improvements

**What I learned**

- Built an ETL pipeline that pulls data from a REST API, cleans it, and loads it into a database.
- Designed a star schema with dimension and fact tables for analytical queries.
- Wrote SQL queries and defined clear metrics, such as the like-to-view ratio.
- Built REST API endpoints with FastAPI to serve analytics.
- Built a React and TypeScript dashboard with charts.
- Deployed three connected services: the frontend on Vercel, the backend on Render, and the database on Neon.
- Kept API keys and database passwords out of the code with environment variables.

**Future improvements**

- Schedule the ETL pipeline automatically with Apache Airflow.
- Track history over time to measure growth in views and engagement.
- Add content recommendations for creators.
- Predict which categories are likely to trend.

## Contact

[![Live Demo](https://img.shields.io/badge/Live%20Demo-TrendTube-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://trendtube-five.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-mathan--ponraj-181717?style=for-the-badge&logo=github)](https://github.com/mathan-ponraj)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mathan03-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/mathan03/)

---

Developed by Mathan
