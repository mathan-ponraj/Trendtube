<div align="center">

# 🌍 TrendTube

### Global YouTube  Content Creators Intelligence Platform

**Discover what's trending across the world. Turn video trends into content opportunities.**

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Visit_Dashboard-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://trendtube-five.vercel.app/)
[![GitHub](https://img.shields.io/badge/GITHUB-View_Source_Code-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mathan-ponraj/Trendtube)

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
</p>

*An end-to-end data engineering and analytics application that collects YouTube trending data, processes it through a Python ETL pipeline, stores structured records in PostgreSQL, and delivers global content insights through an interactive dashboard.*

</div>

---

## 📌 About TrendTube

TrendTube is a global YouTube creator intelligence platform built to help content creators understand what audiences are watching across different regions.

The application collects trending video information using the **YouTube Data API v3**, processes the data through a Python ETL pipeline, and stores it in a PostgreSQL star schema.

A FastAPI backend provides analytical REST endpoints, while a React and TypeScript dashboard transforms the data into interactive visual insights.

Creators can explore trending videos, compare regional performance, discover popular categories, and identify potential content opportunities.

## ✨ Key Features

- **Global Trend Monitoring:** Explore trending content across six populated continents.
- **Regional Analytics:** Monitor YouTube trends across nine configured countries.
- **Trending Videos:** Discover popular videos with views, likes, comments, and rankings.
- **Creator Intelligence:** Explore content patterns and potential video opportunities.
- **Category Analytics:** Understand popular YouTube content categories.
- **Regional Comparison:** Compare video performance across geographical regions.
- **Interactive Visualizations:** Analyze trends through charts and dashboard components.
- **Automated ETL Pipeline:** Extract, transform, and load YouTube data.
- **Star Schema Database:** Organize video observations for analytical queries.
- **REST API:** Deliver structured analytics through FastAPI.

## 🏗️ System Architecture

```text
          YOUTUBE DATA API v3
                   |
                   v
           PYTHON ETL PIPELINE
                   |
          +--------+--------+
          |                 |
          v                 v
      Extraction       Transformation
          |                 |
          +--------+--------+
                   |
                   v
             PostgreSQL
              Star Schema
                   |
                   v
             FASTAPI BACKEND
               REST APIs
                   |
                   v
            REACT + TYPESCRIPT
               FRONTEND
                   |
                   v
          GLOBAL ANALYTICS
              DASHBOARD
```

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Programming | Python |
| Data Source | YouTube Data API v3 |
| Data Engineering | ETL, Data Transformation |
| Data Processing | Pandas, NumPy |
| Backend | FastAPI, REST APIs |
| Frontend | React, TypeScript, Vite |
| Data Visualization | Apache ECharts |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| Database Connectivity | Psycopg |
| Configuration | Python-dotenv |
| Version Control | Git, GitHub |
| Deployment | Render, Vercel, Neon |

## 📊 Database Design

TrendTube uses a PostgreSQL star schema to organize video metadata, geographical information, dates, and trending observations.

| Table | Purpose |
|---|---|
| `dim_video` | Stores video metadata and descriptive information. |
| `dim_region` | Stores country and continent information. |
| `dim_date` | Stores date-related information. |
| `fact_trending` | Stores trending observations and video metrics. |

### ETL Pipeline

**1. Extract**
- Connects to YouTube Data API v3.
- Retrieves trending videos from configured countries.
- Saves raw API responses as JSON files.

**2. Transform**
- Reads collected JSON files.
- Extracts relevant video attributes.
- Normalizes and prepares structured records.

**3. Load**
- Connects to PostgreSQL.
- Loads region, date, and video dimension records.
- Loads trending observations into the fact table.
- Supports repeatable snapshot-based data collection.

## 📈 Dashboard Analytics

The dashboard provides:

- Combined video views.
- Total trending videos and unique videos.
- Total likes and comments.
- Like-to-view ratio.
- Regional content distribution.
- Popular video categories.
- Trending video rankings.
- Regional engagement comparisons.

**Metric definitions:**

- Combined views = Sum of recorded video view counts.
- Like-to-view ratio = Total likes ÷ Total views × 100.
- Latest snapshot = Most recent collection available for each region.
- Historical growth analysis requires multiple snapshots.

## 🌎 Data Coverage

The current collection is configured for nine countries:

| Country | Code | Continent |
|---|---|---|
| India | IN | Asia |
| Japan | JP | Asia |
| United Kingdom | GB | Europe |
| Germany | DE | Europe |
| United States | US | North America |
| Canada | CA | North America |
| Brazil | BR | South America |
| South Africa | ZA | Africa |
| Australia | AU | Oceania |

The dashboard displays six populated continents. Antarctica is shown without data because no collection region is configured there.

## 📁 Project Structure

```text
TrendTube/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── queries.py
│   │   ├── schemas.py
│   │   └── ...
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── config/
│   └── config.py
│
├── src/
│   ├── extract.py
│   ├── transform.py
│   ├── load.py
│   └── database.py
│
├── sql/
│   ├── schema.sql
│   ├── diagnostics.sql
│   └── migrations/
│
├── main.py
├── requirements.txt
├── render.yaml
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mathan-ponraj/Trendtube.git
cd Trendtube
```

### 2. Create a Python Environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
YT_API_KEY=your_youtube_api_key
MAX_RESULTS=50

DATABASE_URL=your_postgresql_connection_string
```

For a local PostgreSQL installation, the database can alternatively be configured using:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=youtube_trending
DB_USER=postgres
DB_PASSWORD=your_database_password
```

Never commit your `.env` file or expose API keys and database credentials.

### 4. Initialize the Database

Create the PostgreSQL database:

```bash
createdb youtube_trending
```

Apply the schema:

```bash
psql -U postgres -d youtube_trending -f sql/schema.sql
```

For Neon PostgreSQL, you can execute the contents of `sql/schema.sql` through the Neon SQL Editor.

### 5. Run the ETL Pipeline

```bash
python main.py
```

To process previously collected raw JSON files without making new API requests:

```bash
python main.py --skip-extract
```

### 6. Start the FastAPI Backend

Open a terminal:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 7. Start the React Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

## 🔌 Backend API Endpoints

| Endpoint | Description |
|---|---|
| `/api/health` | Backend and database health check |
| `/api/continents` | Available continent information |
| `/api/overview` | Global analytics overview |
| `/api/regions` | Regional trending information |
| `/api/videos` | Trending video records |
| `/api/categories` | Video category analytics |
| `/api/insights` | Analytical insights with continent filtering |

Example:

```text
/api/insights?continent=Asia
```

Interactive API documentation is available at `/docs`.

## ☁️ Cloud Deployment

TrendTube uses a separate deployment architecture for its frontend, backend, and database.

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| PostgreSQL Database | Neon |
| Source Code | GitHub |

### Production Architecture

```text
                USERS
                  |
                  v
           VERCEL HOSTING
          React Dashboard
                  |
                  v
           RENDER HOSTING
           FastAPI Backend
                  |
                  v
           NEON POSTGRESQL
            Cloud Database
```

The ETL pipeline runs separately and loads collected data into Neon PostgreSQL. The deployed API reads the database and supplies information to the dashboard.

## 🔮 Future Enhancements

- Automated ETL scheduling using Apache Airflow.
- Historical trend tracking and growth analysis.
- Advanced regional content comparisons.
- AI-powered content recommendations.
- Predictive analysis of trending categories.
- Additional creator intelligence metrics.

## 👨‍💻 Developer

<div align="center">

### Mathan Ponraj

**M.E. Computer Science | Python | Data Engineering | AI & Analytics**

Building practical data-driven applications through Python, backend development, database engineering, and intelligent analytics.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mathan03/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/mathan-ponraj)
[![Portfolio](https://img.shields.io/badge/Portfolio-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://mathan-portfolio-ten.vercel.app/)

</div>

---

<div align="center">

**Turning global video trends into actionable creator intelligence.**

Built with Python, PostgreSQL, FastAPI, and React.

</div>
