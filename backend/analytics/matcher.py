"""Job matching engine — scores jobs against user profile across multiple dimensions."""

import logging
from typing import Dict, List

logger = logging.getLogger(__name__)


class JobMatcher:
    """Match jobs with user profiles using weighted multi-factor scoring."""

    WEIGHTS = {
        'skill': 0.40,
        'experience': 0.25,
        'location': 0.15,
        'salary': 0.12,
        'job_type': 0.08,
    }

    def score_skill(self, job_skills: List[str], user_skills: List[str]) -> float:
        """Score 0-100 based on skill overlap."""
        if not user_skills:
            return 0
        user_lower = {s.lower() for s in user_skills}
        job_lower = {s.lower() for s in job_skills}
        overlap = user_lower & job_lower
        # Also check partial matches
        for us in user_lower:
            for js in job_lower:
                if us in js or js in us:
                    overlap.add(us)
        return min(len(overlap) / len(user_lower) * 100, 100)

    def score_experience(self, job_title: str, user_level: str) -> float:
        """Score 0-100 based on experience level match."""
        title = job_title.lower()
        junior_kw = ['junior', 'entry', 'intern', 'graduate', 'trainee', 'fresher', 'associate']
        senior_kw = ['senior', 'lead', 'principal', 'staff', 'architect', 'director', 'head']

        is_junior_job = any(k in title for k in junior_kw)
        is_senior_job = any(k in title for k in senior_kw)

        if user_level == 'fresher':
            return 100 if is_junior_job else (40 if is_senior_job else 65)
        elif user_level == 'junior':
            return 100 if is_junior_job else (30 if is_senior_job else 70)
        elif user_level == 'mid':
            return 50 if is_junior_job else (60 if is_senior_job else 100)
        elif user_level == 'senior':
            return 20 if is_junior_job else (100 if is_senior_job else 70)
        return 50

    def score_location(self, job_location: str, user_location: str, user_work_mode: str) -> float:
        """Score 0-100 based on location match."""
        jl = job_location.lower()

        if user_work_mode == 'remote' and ('remote' in jl):
            return 100
        if user_work_mode == 'remote':
            return 40

        if user_location and user_location.lower() in jl:
            return 100
        if 'remote' in jl:
            return 70

        return 30

    def score_salary(self, job_salary_avg: float, user_expected: float) -> float:
        """Score 0-100 based on salary expectations."""
        if not job_salary_avg or not user_expected:
            return 50  # Neutral
        ratio = job_salary_avg / user_expected
        if ratio >= 1.0:
            return 100
        elif ratio >= 0.8:
            return 80
        elif ratio >= 0.6:
            return 60
        return max(ratio * 100, 10)

    def score_job_type(self, job_type: str, user_work_mode: str) -> float:
        """Score based on work mode preference."""
        jt = job_type.lower()
        if user_work_mode == 'remote' and 'remote' in jt:
            return 100
        if user_work_mode in jt:
            return 100
        return 60

    def match_jobs(self, jobs: List[Dict], profile: Dict) -> List[Dict]:
        """Score and rank all jobs against user profile."""
        user_skills = profile.get('skills', [])
        user_level = profile.get('experience_level', 'mid')
        user_location = profile.get('location', '')
        user_salary = profile.get('expected_salary', 0)
        user_work_mode = profile.get('work_mode', 'remote')

        results = []
        for job in jobs:
            scores = {
                'skill_match': self.score_skill(job.get('skills_flat', []), user_skills),
                'experience_match': self.score_experience(job.get('title', ''), user_level),
                'location_match': self.score_location(job.get('location', ''), user_location, user_work_mode),
                'salary_match': self.score_salary(job.get('salary_avg', 0), user_salary),
                'job_type_match': self.score_job_type(job.get('job_type', ''), user_work_mode),
            }

            overall = (
                scores['skill_match'] * self.WEIGHTS['skill'] +
                scores['experience_match'] * self.WEIGHTS['experience'] +
                scores['location_match'] * self.WEIGHTS['location'] +
                scores['salary_match'] * self.WEIGHTS['salary'] +
                scores['job_type_match'] * self.WEIGHTS['job_type']
            )

            results.append({
                'title': job.get('title', 'N/A'),
                'company': job.get('company', 'N/A'),
                'location': job.get('location', 'N/A'),
                'salary': job.get('salary', 'Not disclosed'),
                'salary_min': job.get('salary_min', 0),
                'salary_max': job.get('salary_max', 0),
                'job_type': job.get('job_type', 'Full-time'),
                'url': job.get('url', ''),
                'source': job.get('source', 'Unknown'),
                'posted_date': job.get('posted_date', ''),
                'employer_logo': job.get('employer_logo', ''),
                'is_remote': job.get('is_remote', False),
                'description': job.get('description', '')[:300],
                'skills_flat': job.get('skills_flat', []),
                'overall_score': round(overall, 1),
                **{k: round(v, 1) for k, v in scores.items()},
            })

        results.sort(key=lambda x: x['overall_score'], reverse=True)
        logger.info(f"Matched {len(results)} jobs")
        return results

    def get_match_summary(self, matched_jobs: List[Dict]) -> Dict:
        """Get aggregate match statistics."""
        if not matched_jobs:
            return {}
        scores = [j['overall_score'] for j in matched_jobs]
        return {
            'total': len(matched_jobs),
            'avg_score': round(sum(scores) / len(scores), 1),
            'high_matches': sum(1 for s in scores if s >= 75),
            'medium_matches': sum(1 for s in scores if 50 <= s < 75),
            'low_matches': sum(1 for s in scores if s < 50),
            'top_score': max(scores),
        }
