import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging
from typing import List, Dict, Tuple
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class JobAnalyzer:
    """Analyze and process job listings"""

    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.skill_categories = {
            'programming_languages': ['python', 'java', 'javascript', 'c++', 'c#', 'golang', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'typescript'],
            'web_frameworks': ['django', 'flask', 'fastapi', 'spring', 'react', 'angular', 'vue', 'express', 'rails', 'laravel', 'asp.net'],
            'databases': ['sql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'firestore', 'oracle'],
            'cloud_platforms': ['aws', 'azure', 'gcp', 'heroku', 'digital ocean', 'linode', 'kubernetes', 'docker', 'docker compose'],
            'ml_ai': ['machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch', 'scikit-learn', 'keras', 'hugging face'],
            'devops': ['ci/cd', 'jenkins', 'gitlab', 'github', 'terraform', 'ansible', 'linux', 'docker', 'kubernetes', 'monitoring'],
            'soft_skills': ['communication', 'leadership', 'teamwork', 'problem solving', 'project management', 'agile', 'scrum'],
        }

    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract skills from job description"""
        text_lower = text.lower()
        skills_found = {}

        for category, skills in self.skill_categories.items():
            found_skills = []
            for skill in skills:
                if skill.lower() in text_lower:
                    found_skills.append(skill)
            if found_skills:
                skills_found[category] = found_skills

        return skills_found

    def extract_salary_range(self, salary_str: str) -> Tuple[float, float]:
        """Extract numeric salary range from string"""
        if not salary_str or salary_str == "Not mentioned":
            return (0, 0)

        numbers = re.findall(r'\d+', str(salary_str).replace(',', ''))
        if len(numbers) >= 2:
            return (float(numbers[0]), float(numbers[1]))
        elif len(numbers) == 1:
            return (float(numbers[0]), float(numbers[0]))
        return (0, 0)

    def analyze_jobs(self, df: pd.DataFrame) -> pd.DataFrame:
        """Analyze jobs and extract features"""
        if df.empty:
            logger.warning("Empty dataframe provided")
            return df

        df_copy = df.copy()

        # Ensure description column exists
        if 'description' not in df_copy.columns:
            df_copy['description'] = ''

        # Extract skills
        df_copy['skills'] = df_copy['description'].apply(self.extract_skills)
        df_copy['skill_count'] = df_copy['skills'].apply(len)

        # Extract salary
        df_copy[['salary_min', 'salary_max']] = df_copy['salary'].apply(
            lambda x: pd.Series(self.extract_salary_range(x))
        )
        df_copy['salary_avg'] = (df_copy['salary_min'] + df_copy['salary_max']) / 2

        # Text features
        df_copy['description_length'] = df_copy['description'].apply(lambda x: len(str(x).split()))
        df_copy['title_length'] = df_copy['title'].apply(lambda x: len(str(x).split()))

        # Remote work indicator
        if 'location' in df_copy.columns:
            df_copy['is_remote'] = df_copy['location'].apply(
                lambda x: 1 if 'remote' in str(x).lower() else 0
            )
        else:
            df_copy['is_remote'] = 0

        logger.info(f"Analyzed {len(df_copy)} jobs")
        return df_copy

    def calculate_job_score(self, job_row: pd.Series, user_skills: List[str], user_experience_level: str) -> float:
        """Calculate match score for a job based on user profile"""
        score = 0
        max_score = 100

        # Skill match (40%)
        if 'skills' in job_row and user_skills:
            job_skills_str = str(job_row['skills']).lower()
            matching_skills = sum(1 for skill in user_skills if skill.lower() in job_skills_str)
            skill_score = (matching_skills / max(len(user_skills), 1)) * 40
            score += min(skill_score, 40)

        # Experience level match (30%)
        title_lower = str(job_row['title']).lower()
        if user_experience_level == 'junior' and any(word in title_lower for word in ['junior', 'entry', 'intern', 'graduate']):
            score += 30
        elif user_experience_level == 'mid' and any(word in title_lower for word in ['senior', 'lead', 'principal', 'staff']) == False:
            score += 30
        elif user_experience_level == 'senior' and any(word in title_lower for word in ['senior', 'lead', 'principal', 'staff', 'architect']):
            score += 30

        # Remote preference (20%)
        if job_row.get('is_remote', 0) == 1:
            score += 20

        # Salary preference (10%)
        if job_row.get('salary_avg', 0) > 0:
            score += 10

        return round(score, 2)

    def get_top_matching_jobs(self, df: pd.DataFrame, user_profile: Dict, top_n: int = 10) -> pd.DataFrame:
        """Get top matching jobs for user"""
        if df.empty:
            return df

        user_skills = user_profile.get('skills', [])
        experience_level = user_profile.get('experience_level', 'mid')

        df['match_score'] = df.apply(
            lambda row: self.calculate_job_score(row, user_skills, experience_level),
            axis=1
        )

        top_jobs = df.nlargest(top_n, 'match_score')[
            ['title', 'company', 'location', 'match_score', 'salary', 'source', 'url']
        ]

        return top_jobs

    def get_skill_statistics(self, df: pd.DataFrame) -> Dict:
        """Get statistics about required skills across all jobs"""
        if df.empty or 'skills' not in df.columns:
            return {}

        skill_count = {}
        for skills_dict in df['skills']:
            for category, skills_list in skills_dict.items():
                for skill in skills_list:
                    skill_count[skill] = skill_count.get(skill, 0) + 1

        sorted_skills = sorted(skill_count.items(), key=lambda x: x[1], reverse=True)
        return dict(sorted_skills[:20])  # Top 20 skills

    def get_salary_statistics(self, df: pd.DataFrame) -> Dict:
        """Get salary statistics"""
        salary_data = df[df['salary_avg'] > 0]
        if salary_data.empty:
            return {}

        return {
            'average_salary': salary_data['salary_avg'].mean(),
            'min_salary': salary_data['salary_min'].min(),
            'max_salary': salary_data['salary_max'].max(),
            'median_salary': salary_data['salary_avg'].median(),
            'count': len(salary_data)
        }


if __name__ == "__main__":
    analyzer = JobAnalyzer()
    df = pd.read_csv("data/jobs_raw.csv")
    analyzed_df = analyzer.analyze_jobs(df)
    print(analyzed_df.head())
