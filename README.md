<div align="center">

# TrendTube

### YouTube Trending Data Pipeline

**From raw YouTube data to structured, analytics-ready information.**

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/ETL-245A73?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/YouTube_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
</p>

<br/>

<a href="https://github.com/mathan-ponraj/Trending_YouTube_Data_Pipeline">
  <img src="https://img.shields.io/badge/VIEW_SOURCE_CODE-7C3AED?style=for-the-badge&logo=github&logoColor=white" />
</a>

<br/><br/>

*A Python-based ETL pipeline for collecting, transforming, validating, and storing YouTube trending data.*

</div>

---

## About the Project

TrendTube is a Python-based data engineering project that collects trending video information using the YouTube Data API v3 and transforms raw JSON responses into structured PostgreSQL records.

The project explores how raw API data can be converted into organized, analytics-ready information through a practical ETL workflow.

## Key Features

* **API Integration:** Extract trending video information using YouTube Data API v3.
* **Regional Data Collection:** Collect trending information across configured regions.
* **Data Transformation:** Convert raw JSON responses into structured records.
* **Data Validation:** Validate records before database loading.
* **Relational Data Modeling:** Organize information using dimension and fact tables.
* **PostgreSQL Integration:** Store structured data in a relational database.
* **Secure Configuration:** Manage API keys and database credentials using environment variables.

## ETL Pipeline Architecture

```text
       YouTube Data API v3
                |
                v
        Data Extraction
                |
                v
           Raw JSON
                |
                v
       Data Transformation
                |
                v
         Data Validation
                |
                v
           PostgreSQL
                |
                v
          SQL Analytics
                |
                v
        Power BI Dashboard
             (Planned)
```

## Database Design

The project uses a dimensional data model with four PostgreSQL tables.

| Table           | Purpose                             |
| --------------- | ----------------------------------- |
| `dim_video`     | Stores video-related information.   |
| `dim_region`    | Stores regional information.        |
| `dim_date`      | Stores date-related information.    |
| `fact_trending` | Stores trending video observations. |

This structure provides a foundation for analyzing video performance across different regions and dates.

## Technology Stack

| Category         | Technologies        |
| ---------------- | ------------------- |
| Programming      | Python              |
| Data Source      | YouTube Data API v3 |
| Data Format      | JSON                |
| Data Engineering | ETL                 |
| Database         | PostgreSQL          |
| Database Driver  | Psycopg             |
| Configuration    | python-dotenv       |
| Version Control  | Git, GitHub         |
| Visualization    | Power BI (Planned)  |

## Engineering Challenges & Solutions

| Challenge                         | Approach                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Extracting external data          | Integrated YouTube Data API v3.                                                                       |
| Processing unstructured responses | Implemented JSON transformation logic.                                                                |
| Maintaining data quality          | Developed a dedicated validation module.                                                              |
| Organizing relational data        | Designed dimension and fact tables.                                                                   |
| Database connectivity             | Implemented PostgreSQL connectivity using Python and Psycopg.                                         |
| Managing sensitive credentials    | Used environment variables and `.env` configuration.                                                  |
| Maintaining modularity            | Separated extraction, transformation, validation, loading, and orchestration into individual modules. |

## Project Structure

```text
Trending_YouTube_Data_Pipeline/
|
|-- config/
|   `-- config.py
|
|-- sql/
|   `-- schema.sql
|
|-- src/
|   |-- database.py
|   |-- extract.py
|   |-- transform.py
|   |-- validate.py
|   |-- load.py
|   `-- pipeline.py
|
|-- data/
|-- main.py
|-- requirements.txt
|-- .gitignore
|-- .env
`-- README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mathan-ponraj/Trending_YouTube_Data_Pipeline.git
cd Trending_YouTube_Data_Pipeline
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate in Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file:

```env
YT_API_KEY=your_youtube_api_key
MAX_RESULTS=50

DB_HOST=localhost
DB_PORT=5432
DB_NAME=youtube_trending
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
```

### 5. Set Up PostgreSQL

Create a database named `youtube_trending` and apply the schema:

```bash
psql -U postgres -d youtube_trending -f sql/schema.sql
```

**Note:** Complete and verify the pipeline orchestration before running the entire workflow end to end.

## Development Roadmap

* [x] YouTube Data API integration.
* [x] Data transformation module.
* [x] PostgreSQL connection and loading modules.
* [x] Relational database schema.
* [ ] Verify end-to-end pipeline execution.
* [ ] Develop analytical SQL queries.
* [ ] Build Power BI dashboards.
* [ ] Implement scheduled data refreshes.
* [ ] Explore historical trending patterns.

## Skills Demonstrated

* Python Programming
* API Integration
* ETL Pipeline Development
* Data Extraction and Transformation
* JSON Processing
* Data Validation
* PostgreSQL
* Relational Database Design
* Environment Configuration
* Git & GitHub

## Future Enhancements

* Automate pipeline execution using Apache Airflow.
* Build interactive Power BI dashboards.
* Implement historical trend analysis.
* Add incremental data loading.
* Explore cloud-based data storage.
* Introduce automated data quality checks.

## Project Links

<div align="center">

<a href="https://github.com/mathan-ponraj/Trending_YouTube_Data_Pipeline">
  <img src="https://img.shields.io/badge/GITHUB_REPOSITORY-7C3AED?style=for-the-badge&logo=github&logoColor=white" />
</a>

<a href="https://www.linkedin.com/in/mathan03/">
  <img src="https://img.shields.io/badge/LINKEDIN-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

</div>

---

## Developer

<div align="center">

### Mathan Ponraj

**M.E. Computer Science | Python | Data Science | Data Engineering**

*Building practical data solutions through continuous learning and hands-on development.*

</div>

---

<div align="center">

**From API extraction to analytics-ready data. Built with Python and PostgreSQL.**

</div>
