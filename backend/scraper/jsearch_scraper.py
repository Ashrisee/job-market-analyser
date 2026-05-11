"""JSearch API scraper (via RapidAPI). Aggregates jobs from LinkedIn, Indeed, Glassdoor, etc."""

import requests
import logging
from typing import List, Dict
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class JSearchScraper(BaseScraper):
    """Scrape jobs from JSearch API on RapidAPI."""

    API_URL = "https://jsearch.p.rapidapi.com/search"

    def __init__(self, api_key: str):
        super().__init__("JSearch")
        self.api_key = api_key

    def scrape(self, keyword: str, location: str = 'India', limit: int = 50) -> List[Dict]:
        if not self.api_key:
            logger.warning("JSearch API key not configured")
            return []

        query = f"{keyword} in {location}" if location else keyword
        params = {
            "query": query,
            "page": 1,
            "num_pages": min((limit // 10) + 1, 5),
            "date_posted": "all"
        }
        headers = {
            "x-rapidapi-key": self.api_key,
            "x-rapidapi-host": "jsearch.p.rapidapi.com"
        }

        try:
            response = requests.get(self.API_URL, headers=headers, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()

            jobs = []
            for job in (data.get('data') or [])[:limit]:
                sal_min = job.get('job_min_salary') or job.get('job_salary_min') or 0
                sal_max = job.get('job_max_salary') or job.get('job_salary_max') or 0

                city = job.get('job_city') or ''
                country = job.get('job_country') or ''
                loc = f"{city}, {country}".strip(', ') if city else (country or 'Remote')

                jobs.append({
                    'title': job.get('job_title', 'N/A'),
                    'company': job.get('employer_name', 'N/A'),
                    'location': loc,
                    'salary': self.extract_salary_text(sal_min, sal_max),
                    'salary_min': sal_min or 0,
                    'salary_max': sal_max or 0,
                    'job_type': job.get('job_employment_type', 'Full-time'),
                    'description': job.get('job_description', ''),
                    'url': job.get('job_apply_link', ''),
                    'source': 'JSearch',
                    'posted_date': (job.get('job_posted_at_datetime_utc') or '')[:10],
                    'experience_months': (job.get('job_required_experience') or {}).get('required_experience_in_months', 0) or 0,
                    'employer_logo': job.get('employer_logo', ''),
                    'is_remote': job.get('job_is_remote', False),
                })

            logger.info(f"JSearch: scraped {len(jobs)} jobs for '{keyword}'")
            return jobs

        except requests.exceptions.RequestException as e:
            logger.error(f"JSearch API error: {e}")
            return []
