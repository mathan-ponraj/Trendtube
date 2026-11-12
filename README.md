<div align="center">

# 🌍 TrendTube

### Global YouTube Creator Intelligence Platform

**Discover what's trending across the world. Turn video trends into content opportunities.**

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
</p>

<br/>

<a href="https://github.com/mathan-ponraj/Trendtube">
  <img src="https://img.shields.io/badge/VIEW_SOURCE_CODE-7C3AED?style=for-the-badge&logo=github&logoColor=white" />
</a>

<br/><br/>

*An end-to-end data engineering and analytics platform that collects global YouTube trending data, transforms it into structured PostgreSQL records, and presents actionable insights through an interactive dashboard.*

</div>

---

## 📌 About the Project

TrendTube is a Global YouTube Creator Intelligence Platform designed to help content creators understand trending video patterns across different geographical regions.

The application integrates the YouTube Data API v3 with a Python-based ETL pipeline to collect, transform, validate, and store trending video information in a PostgreSQL star schema.

A FastAPI backend exposes analytical data through REST APIs, while a React and TypeScript frontend presents the information through an interactive analytics dashboard.

The platform helps creators explore regional trends, discover popular content categories, and identify potential content opportunities.

## ✨ Key Features

- **Global Trend Monitoring:** Explore YouTube trending content across seven continents.
- **Regional Analytics:** Analyze trending videos across nine configured countries.
- **Interactive Dashboard:** Explore global trending information through a clean analytics interface.
- **Video Intelligence:** Examine video titles, channels, views, likes, and engagement metrics.
- **Category Analysis:** Understand popular content categories across different regions.
- **Regional Comparison:** Compare trending content across geographical locations.
- **Automated ETL Pipeline:** Extract, transform, validate, and load YouTube data.
- **Star Schema Database:** Organize analytical data using dimension and fact tables.
- **REST API Integration:** Deliver structured analytical data through FastAPI endpoints.

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
             Data Validation
                   |
                   v
              PostgreSQL
              Star Schema
                   |
                   v
             FASTAPI BACKEND
             REST Endpoints
                   |
                   v
             REACT FRONTEND
             TYPESCRIPT
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
| Data Processing | Pandas |
| Backend | FastAPI, REST APIs |
| Frontend | React, TypeScript, Vite |
| Visualization | Apache ECharts |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| Database Driver | Psycopg |
| Configuration | Python-dotenv |
| Version Control | Git, GitHub |
| Deployment | Render, Vercel |

## 📊 Database Design

TrendTube uses a PostgreSQL star schema to organize trending video information for analytical queries.

| Table | Description |
|---|---|
| `dim_video` | Stores video metadata and descriptive information. |
| `dim_region` | Stores geographical region information. |
| `dim_date` | Stores date-related information. |
| `fact_trending` | Stores trending video observations and metrics. |

### Data Processing

The ETL pipeline follows three major stages:

**1. Extract**
- Connects to YouTube Data API v3.
- Retrieves trending video information.
- Collects data from nine configured countries.
- Stores raw API responses.

**2. Transform**
- Processes raw JSON responses.
- Extracts relevant video attributes.
- Normalizes records.
- Prepares structured data for database loading.

**3. Load**
- Connects to PostgreSQL.
- Loads dimensional and fact records.
- Supports snapshot-based data storage.
- Maintains structured analytical data.

## 📈 Analytics & Metrics

The dashboard provides insights into:

- Total recorded video views.
- Trending video distribution.
- Regional content performance.
- Popular video categories.
- Video engagement metrics.
- Regional trending comparisons.

**Metric definitions:**

- Combined views represent the sum of recorded video view counts.
- Like-to-view ratio = Likes / Views × 100.
- Latest snapshot is determined independently for each region.
- Historical growth analysis requires multiple snapshots.

## 📁 Project Structure

```text
TrendTube/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
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

### 2. Backend & ETL Environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
YT_API_KEY=your_youtube_api_key
MAX_RESULTS=50

DB_HOST=localhost
DB_PORT=5432
DB_NAME=youtube_trending
DB_USER=postgres
DB_PASSWORD=your_database_password
```

### 4. Database Setup

Create the PostgreSQL database:

```bash
createdb youtube_trending
```

Apply the database schema:

```bash
psql -U postgres -d youtube_trending -f sql/schema.sql
```

**Note:** If you already have an existing database, check the migration instructions before applying any schema changes.

### 5. Run the ETL Pipeline

Execute the complete pipeline:

```bash
python main.py
```

To reload existing raw data without extracting again:

```bash
python main.py --skip-extract
```

### 6. Start the Backend

```powershell
cd backend

python -m venv venv
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

Backend API:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 7. Start the Frontend

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

Interactive API documentation is available through FastAPI Swagger UI at `/docs`.

## ☁️ Cloud Deployment

The application is designed for separate frontend, backend, and database deployment.

| Component | Deployment Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| PostgreSQL | Neon |
| Source Code | GitHub |

### Deployment Architecture

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

Environment variables are configured separately on the respective hosting platforms.

## 🎯 Project Objectives

- Build an end-to-end data engineering application.
- Develop practical API integration workflows.
- Implement a dimensional database model.
- Expose analytical data through REST APIs.
- Develop an interactive data visualization dashboard.
- Explore global YouTube content trends through structured analytics.

## 🔮 Future Enhancements

- Automated ETL scheduling using Apache Airflow.
- Historical trend and growth analysis.
- Advanced regional content comparisons.
- AI-powered content recommendations.
- Predictive analysis of trending video categories.
- Additional engagement and creator intelligence metrics.

## 👨‍💻 Developer

<div align="center">

### Mathan Ponraj

**M.E. Computer Science | Python | Data Engineering | AI & Analytics**

Building practical data-driven applications through Python, database engineering, and intelligent analytics.

<br/>

<a href="https://www.linkedin.com/in/mathan03/">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

<a href="https://github.com/mathan-ponraj">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

<a href="https://mathan-portfolio-ten.vercel.app/">
  <img src="https://img.shields.io/badge/Portfolio-7C3AED?style=for-the-badge&logo=vercel&logoColor=white" />
</a>

</div>

---

<div align="center">

**Turning global video trends into actionable creator intelligence.**

Built with Python, PostgreSQL, FastAPI and React.

</div>
