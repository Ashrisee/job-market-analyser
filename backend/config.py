import os
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))


class Config:
    """Application configuration loaded from environment variables."""

    JSEARCH_API_KEY = os.getenv('JSEARCH_API_KEY', '').strip()
    ADZUNA_APP_ID = os.getenv('ADZUNA_APP_ID', '').strip()
    ADZUNA_APP_KEY = os.getenv('ADZUNA_APP_KEY', '').strip()

    FLASK_PORT = int(os.getenv('FLASK_PORT', 5001))
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'

    DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

    @classmethod
    def ensure_dirs(cls):
        os.makedirs(cls.DATA_DIR, exist_ok=True)
