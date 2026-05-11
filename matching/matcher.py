import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class JobMatcher:
    """Match jobs with user profiles based on skills and preferences"""

    def __init__(self):
        self.weights = {
            'skill': 0.40,
            'experience': 0.25,
            'location': 0.15,
            'salary': 0.12,
            'job_type': 0.08
        }

    def calculate_skill_match_score(self, job_skills: Dict, user_skills: List[str]) -> float:
        """Calculate skill match percentage (0-100)"""
        if not user_skills:
            return 0

        matched_skills = []
        for category, skills_list in job_skills.items():
            for skill in skills_list:
                if any(user_skill.lower() in skill.lower() or skill.lower() in user_skill.lower()
                       for user_skill in user_skills):
                    matched_skills.append(skill)

        if not matched_skills:
            return 0

        match_percentage = (len(matched_skills) / max(len(user_skills), 1)) * 100
        return min(match_percentage, 100)

    def calculate_experience_match_score(self, job_title: str, user_level: str) -> float:
        """Calculate experience level match (0-100)"""
        title_lower = job_title.lower()

        junior_keywords = ['junior', 'entry', 'intern', 'graduate', 'trainee', 'associate']
        mid_keywords = ['mid', 'intermediate', 'level', 'engineer']
        senior_keywords = ['senior', 'lead', 'principal', 'staff', 'architect', 'expert']

        if user_level == 'junior':
            if any(kw in title_lower for kw in junior_keywords):
                return 100
            elif any(kw in title_lower for kw in mid_keywords):
                return 60
            else:
                return 30

        elif user_level == 'mid':
            if any(kw in title_lower for kw in mid_keywords):
                return 100
            elif any(kw in title_lower for kw in [*junior_keywords, *senior_keywords]):
                return 50
            else:
                return 70

        elif user_level == 'senior':
            if any(kw in title_lower for kw in senior_keywords):
                return 100
            elif any(kw in title_lower for kw in mid_keywords):
                return 70
            else:
                return 40

        return 50

    def calculate_location_match_score(self, job_location: str, user_locations: List[str], allow_remote: bool) -> float:
        """Calculate location match score (0-100)"""
        job_loc_lower = str(job_location).lower()

        if 'remote' in job_loc_lower and allow_remote:
            return 100

        for user_loc in user_locations:
            if user_loc.lower() in job_loc_lower or 'remote' in user_loc.lower():
                if 'remote' in job_loc_lower:
                    return 100
                return 80

        return 0 if not allow_remote else 50

    def calculate_salary_match_score(self, job_salary_avg: float, user_min: float, user_max: float) -> float:
        """Calculate salary match score (0-100)"""
        if job_salary_avg == 0 or (user_min == 0 and user_max == 0):
            return 50  # Neutral if no salary info

        if user_min > 0 and job_salary_avg < user_min:
            return max(0, 100 - ((user_min - job_salary_avg) / user_min * 100))
        elif user_max > 0 and job_salary_avg > user_max:
            return max(0, 100 - ((job_salary_avg - user_max) / user_max * 100))
        else:
            return 100

    def calculate_job_type_match_score(self, job_type: str, user_job_types: List[str]) -> float:
        """Calculate job type match score (0-100)"""
        job_type_lower = str(job_type).lower()

        for user_type in user_job_types:
            if user_type.lower() in job_type_lower:
                return 100

        # Partial matches
        if any(kw in job_type_lower for kw in ['contract', 'temporary', 'part-time'] if kw in user_job_types):
            return 70

        return 50

    def match_jobs(self, jobs_df: pd.DataFrame, user_profile: Dict) -> pd.DataFrame:
        """Match all jobs with user profile and return scored results"""
        if jobs_df.empty:
            logger.warning("Empty jobs dataframe")
            return pd.DataFrame()

        results = []

        for idx, job in jobs_df.iterrows():
            scores = {
                'skill_match': self.calculate_skill_match_score(
                    job.get('skills', {}),
                    user_profile.get('skills', [])
                ),
                'experience_match': self.calculate_experience_match_score(
                    job.get('title', ''),
                    user_profile.get('experience_level', 'mid')
                ),
                'location_match': self.calculate_location_match_score(
                    job.get('location', ''),
                    user_profile.get('preferred_locations', ['Remote']),
                    user_profile.get('remote_preference', True)
                ),
                'salary_match': self.calculate_salary_match_score(
                    job.get('salary_avg', 0),
                    user_profile.get('min_salary', 0),
                    user_profile.get('max_salary', 0)
                ),
                'job_type_match': self.calculate_job_type_match_score(
                    job.get('job_type', ''),
                    user_profile.get('preferred_job_types', ['Full-time'])
                )
            }

            # Calculate weighted total score
            total_score = sum(scores[key] * self.weights[key.replace('_match', '')]
                            for key in scores)

            results.append({
                'title': job.get('title', 'N/A'),
                'company': job.get('company', 'N/A'),
                'location': job.get('location', 'N/A'),
                'salary': job.get('salary', 'N/A'),
                'source': job.get('source', 'Unknown'),
                'url': job.get('url', ''),
                'overall_score': round(total_score, 2),
                'skill_match': round(scores['skill_match'], 2),
                'experience_match': round(scores['experience_match'], 2),
                'location_match': round(scores['location_match'], 2),
                'salary_match': round(scores['salary_match'], 2),
                'job_type_match': round(scores['job_type_match'], 2),
            })

        result_df = pd.DataFrame(results)
        result_df = result_df.sort_values('overall_score', ascending=False)
        logger.info(f"Matched {len(result_df)} jobs")
        return result_df

    def get_match_analysis(self, matched_jobs_df: pd.DataFrame) -> Dict:
        """Get analysis of job matches"""
        if matched_jobs_df.empty:
            return {}

        return {
            'total_matches': len(matched_jobs_df),
            'avg_overall_score': round(matched_jobs_df['overall_score'].mean(), 2),
            'avg_skill_match': round(matched_jobs_df['skill_match'].mean(), 2),
            'avg_experience_match': round(matched_jobs_df['experience_match'].mean(), 2),
            'avg_location_match': round(matched_jobs_df['location_match'].mean(), 2),
            'avg_salary_match': round(matched_jobs_df['salary_match'].mean(), 2),
            'high_matches': len(matched_jobs_df[matched_jobs_df['overall_score'] >= 80]),
            'medium_matches': len(matched_jobs_df[(matched_jobs_df['overall_score'] >= 60) & (matched_jobs_df['overall_score'] < 80)]),
            'low_matches': len(matched_jobs_df[matched_jobs_df['overall_score'] < 60]),
        }


if __name__ == "__main__":
    matcher = JobMatcher()
    print("Job matcher initialized")
