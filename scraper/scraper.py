import requests
import pandas as pd
import logging
import os
import json
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class JobScraper:
    """Scrape real job listings from multiple APIs"""

    def __init__(self):
        # Load API credentials from .env
        self.adzuna_app_id = os.getenv('ADZUNA_APP_ID', '')
        self.adzuna_app_key = os.getenv('ADZUNA_APP_KEY', '')
        self.jsearch_api_key = os.getenv('JSEARCH_API_KEY', '')

        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.jobs_data = []
        os.makedirs('data', exist_ok=True)

    def scrape_all_sources(self, keyword: str, limit: int = 50) -> pd.DataFrame:
        """Scrape jobs from all available sources"""
        all_jobs = []

        # Try JSearch API first (most reliable)
        try:
            jsearch_jobs = self.scrape_jsearch(keyword, min(limit, 50))
            all_jobs.extend(jsearch_jobs)
            logger.info(f"JSearch: Found {len(jsearch_jobs)} jobs")
        except Exception as e:
            logger.error(f"JSearch scraping failed: {str(e)}")

        # Try Adzuna API as backup
        try:
            remaining = limit - len(all_jobs)
            if remaining > 0:
                adzuna_jobs = self.scrape_adzuna(keyword, min(remaining, 50))
                all_jobs.extend(adzuna_jobs)
                logger.info(f"Adzuna: Found {len(adzuna_jobs)} jobs")
        except Exception as e:
            logger.error(f"Adzuna scraping failed: {str(e)}")

        # Remove duplicates by title + company
        seen = set()
        unique_jobs = []
        for job in all_jobs:
            key = (job.get('title', '').lower(), job.get('company', '').lower())
            if key not in seen:
                seen.add(key)
                unique_jobs.append(job)

        logger.info(f"Total unique jobs scraped: {len(unique_jobs)}")
        return pd.DataFrame(unique_jobs) if unique_jobs else pd.DataFrame()

    def scrape_jsearch(self, keyword: str, limit: int = 50) -> List[Dict]:
        """Scrape from JSearch API (RapidAPI)"""
        if not self.jsearch_api_key:
            logger.warning("JSearch API key not configured")
            return []

        url = "https://jsearch.p.rapidapi.com/search"

        params = {
            "query": f"{keyword} in India",
            "page": 1,
            "num_pages": 1,
            "date_posted": "all"
        }

        headers = {
            "x-rapidapi-key": self.jsearch_api_key,
            "x-rapidapi-host": "jsearch.p.rapidapi.com"
        }

        try:
            response = requests.get(url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            jobs = []
            if 'data' in data:
                for job in data['data'][:limit]:
                    jobs.append({
                        'title': job.get('job_title', 'N/A'),
                        'company': job.get('employer_name', 'N/A'),
                        'location': job.get('job_city', 'Remote') + ', ' + job.get('job_country', ''),
                        'salary': self._extract_salary(job.get('job_salary_min'), job.get('job_salary_max')),
                        'job_type': job.get('job_employment_type', 'Full-time'),
                        'description': job.get('job_description', ''),
                        'url': job.get('job_apply_link', ''),
                        'source': 'JSearch',
                        'posted_date': job.get('job_posted_at_datetime_utc', '')[:10],
                        'required_experience': job.get('job_required_experience', {}).get('required_experience_in_months', 0)
                    })
            logger.info(f"JSearch: Successfully scraped {len(jobs)} jobs")
            return jobs

        except Exception as e:
            logger.error(f"JSearch API error: {str(e)}")
            return []

    def scrape_adzuna(self, keyword: str, limit: int = 50) -> List[Dict]:
        """Scrape from Adzuna API"""
        if not self.adzuna_app_id or not self.adzuna_app_key:
            logger.warning("Adzuna credentials not configured")
            return []

        url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

        params = {
            "app_id": self.adzuna_app_id,
            "app_key": self.adzuna_app_key,
            "what": keyword,
            "results_per_page": min(limit, 50),
            "full_time": True
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            jobs = []
            if 'results' in data:
                for job in data['results']:
                    salary_min = job.get('salary_min', 0)
                    salary_max = job.get('salary_max', 0)

                    salary_text = "Not mentioned"
                    if salary_min and salary_max:
                        salary_text = f"${salary_min:,.0f} - ${salary_max:,.0f}"
                    elif salary_min:
                        salary_text = f"${salary_min:,.0f}"

                    jobs.append({
                        'title': job.get('title', 'N/A'),
                        'company': job.get('company', {}).get('display_name', 'N/A'),
                        'location': job.get('location', {}).get('display_name', 'Not specified'),
                        'salary': salary_text,
                        'job_type': 'Full-time',
                        'description': job.get('description', ''),
                        'url': job.get('redirect_url', ''),
                        'source': 'Adzuna',
                        'posted_date': job.get('created', '')[:10],
                        'required_experience': 0
                    })
            logger.info(f"Adzuna: Successfully scraped {len(jobs)} jobs")
            return jobs

        except Exception as e:
            logger.error(f"Adzuna API error: {str(e)}")
            return []

    def _extract_salary(self, min_sal, max_sal):
        """Extract salary range"""
        if min_sal and max_sal:
            return f"${int(min_sal):,.0f} - ${int(max_sal):,.0f}"
        elif min_sal:
            return f"${int(min_sal):,.0f}"
        elif max_sal:
            return f"${int(max_sal):,.0f}"
        return "Not mentioned"

    def save_to_csv(self, df: pd.DataFrame, filename: str = 'data/jobs_raw.csv') -> bool:
        """Save jobs to CSV file"""
        try:
            df.to_csv(filename, index=False)
            logger.info(f"Saved {len(df)} jobs to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving to CSV: {str(e)}")
            return False

    def save_to_json(self, df: pd.DataFrame, filename: str = 'data/jobs_raw.json') -> bool:
        """Save jobs to JSON file"""
        try:
            df.to_json(filename, orient='records', indent=2)
            logger.info(f"Saved {len(df)} jobs to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving to JSON: {str(e)}")
            return False

    def load_from_csv(self, filename: str = 'data/jobs_raw.csv') -> pd.DataFrame:
        """Load jobs from CSV file"""
        try:
            if os.path.exists(filename):
                df = pd.read_csv(filename)
                logger.info(f"Loaded {len(df)} jobs from {filename}")
                return df
        except Exception as e:
            logger.error(f"Error loading from CSV: {str(e)}")
        return pd.DataFrame()

    def load_from_json(self, filename: str = 'data/jobs_raw.json') -> pd.DataFrame:
        """Load jobs from JSON file"""
        try:
            if os.path.exists(filename):
                with open(filename, 'r') as f:
                    jobs = json.load(f)
                df = pd.DataFrame(jobs)
                logger.info(f"Loaded {len(df)} jobs from {filename}")
                return df
        except Exception as e:
            logger.error(f"Error loading from JSON: {str(e)}")
        return pd.DataFrame()


if __name__ == "__main__":
    scraper = JobScraper()
    jobs_df = scraper.scrape_all_sources("Python Developer", limit=20)
    print(f"Scraped {len(jobs_df)} jobs")
    print(jobs_df[['title', 'company', 'location', 'salary']].head())
