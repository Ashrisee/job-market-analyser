# Adzuna API scraper. Real job listings from Adzuna's job search engine.

import requests
import logging
from typing import List, Dict
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class AdzunaScraper(BaseScraper):
    """Scrape jobs from Adzuna API."""

    API_URL = "https://api.adzuna.com/v1/api/jobs/{country}/search/{page}"

    def __init__(self, app_id: str, app_key: str):
        super().__init__("Adzuna")
        self.app_id = app_id
        self.app_key = app_key

    def scrape(self, keyword: str, location: str = '', limit: int = 50, country: str = 'in') -> List[Dict]:
        if not self.app_id or not self.app_key:
            logger.warning("Adzuna credentials not configured")
            return []

        url = self.API_URL.format(country=country, page=1)
        params = {
            "app_id": self.app_id,
            "app_key": self.app_key,
            "what": keyword,
            "results_per_page": min(limit, 50),
            "full_time": 1,
            "sort_by": "relevance",
        }
        if location:
            params["where"] = location

        try:
            response = requests.get(url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()

            jobs = []
            for job in (data.get('results') or []):
                sal_min = job.get('salary_min') or 0
                sal_max = job.get('salary_max') or 0

                jobs.append({
                    'title': job.get('title', 'N/A'),
                    'company': (job.get('company') or {}).get('display_name', 'N/A'),
                    'location': (job.get('location') or {}).get('display_name', 'Not specified'),
                    'salary': self.extract_salary_text(sal_min, sal_max),
                    'salary_min': sal_min,
                    'salary_max': sal_max,
                    'job_type': 'Full-time',
                    'description': job.get('description', ''),
                    'url': job.get('redirect_url', ''),
                    'source': 'Adzuna',
                    'posted_date': (job.get('created') or '')[:10],
                    'experience_months': 0,
                    'employer_logo': '',
                    'is_remote': 'remote' in (job.get('title') or '').lower() or 'remote' in (job.get('description') or '').lower(),
                })

            logger.info(f"Adzuna: scraped {len(jobs)} jobs for '{keyword}'")
            return jobs

        except requests.exceptions.RequestException as e:
            logger.error(f"Adzuna API error: {e}")
            return []
