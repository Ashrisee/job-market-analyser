"""Abstract base class for all job scrapers."""

from abc import ABC, abstractmethod
from typing import List, Dict
import logging
import re

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Base scraper interface. All scrapers must implement scrape()."""

    def __init__(self, name: str):
        self.name = name
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

    @abstractmethod
    def scrape(self, keyword: str, location: str = '', limit: int = 50) -> List[Dict]:
        """
        Scrape jobs matching keyword and location.
        Returns list of job dicts with standardized keys:
            title, company, location, salary, salary_min, salary_max,
            job_type, description, url, source, posted_date, experience_months
        """
        pass

    @staticmethod
    def extract_salary_text(min_sal, max_sal, currency: str = '$') -> str:
        """Format salary range into human-readable string."""
        if min_sal and max_sal:
            return f"{currency}{int(min_sal):,} - {currency}{int(max_sal):,}"
        elif min_sal:
            return f"{currency}{int(min_sal):,}"
        elif max_sal:
            return f"{currency}{int(max_sal):,}"
        return "Not disclosed"

    @staticmethod
    def parse_salary_from_text(text: str):
        """Extract numeric salary values from a text string."""
        if not text or text == "Not disclosed":
            return 0, 0
        numbers = re.findall(r'[\d,]+', str(text).replace(',', ''))
        nums = [int(n) for n in numbers if n]
        if len(nums) >= 2:
            return nums[0], nums[1]
        elif len(nums) == 1:
            return nums[0], nums[0]
        return 0, 0
