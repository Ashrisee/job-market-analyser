"""Internshala scraper — scrapes jobs from internshala.com."""

import requests
from bs4 import BeautifulSoup
import logging
from typing import List, Dict
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class InternshalaScaper(BaseScraper):
    """Scrape job listings from Internshala."""

    BASE_URL = "https://internshala.com"

    def __init__(self):
        super().__init__("Internshala")

    def scrape(self, keyword: str, location: str = '', limit: int = 20) -> List[Dict]:
        """Scrape jobs matching the keyword from Internshala."""
        # Build search URL
        search_term = keyword.lower().replace(' ', '-')
        url = f"{self.BASE_URL}/jobs/keywords-{search_term}"

        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            jobs = []
            # Internshala job cards have class 'individual_internship'
            cards = soup.select('.individual_internship')[:limit]

            for card in cards:
                title_el = card.select_one('.job-internship-name a, .profile a, h3 a')
                company_el = card.select_one('.company-name a, .company_name a, p.company-name')
                location_el = card.select_one('.locations a, .location_link a, #location_names a')
                stipend_el = card.select_one('.salary-container span, .stipend, span.desktop-text')

                title = title_el.get_text(strip=True) if title_el else 'N/A'
                company = company_el.get_text(strip=True) if company_el else 'N/A'
                job_location = location_el.get_text(strip=True) if location_el else 'Not specified'
                salary_text = stipend_el.get_text(strip=True) if stipend_el else 'Not disclosed'

                link = ''
                if title_el and title_el.get('href'):
                    link = self.BASE_URL + title_el['href']

                jobs.append({
                    'title': title,
                    'company': company,
                    'location': job_location,
                    'salary': salary_text,
                    'salary_min': 0,
                    'salary_max': 0,
                    'job_type': 'Full-time',
                    'description': f"{title} role at {company} in {job_location}.",
                    'url': link,
                    'source': 'Internshala',
                    'posted_date': '',
                    'experience_months': 0,
                    'employer_logo': '',
                    'is_remote': 'remote' in job_location.lower() or 'work from home' in job_location.lower(),
                })

            logger.info(f"Internshala: scraped {len(jobs)} jobs for '{keyword}'")
            return jobs

        except requests.exceptions.RequestException as e:
            logger.error(f"Internshala scraping error: {e}")
            return []
