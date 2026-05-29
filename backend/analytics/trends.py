# Trend analysis module — hiring demand, growing skills, role popularity.

import logging
from typing import List, Dict
from collections import defaultdict

logger = logging.getLogger(__name__)


class TrendAnalyzer:
    """Analyze market trends from job data."""

    def analyze(self, jobs: List[Dict]) -> Dict:
        """Generate full trend analysis."""
        return {
            'trending_skills': self._trending_skills(jobs),
            'role_demand': self._role_demand(jobs),
            'hiring_by_source': self._hiring_by_source(jobs),
            'remote_vs_onsite': self._remote_stats(jobs),
            'top_companies': self._top_companies(jobs),
            'job_type_distribution': self._job_type_dist(jobs),
        }

    def _trending_skills(self, jobs: List[Dict]) -> List[Dict]:
        """Skills ranked by market demand."""
        skill_count = defaultdict(int)
        total = len(jobs) or 1
        for j in jobs:
            for skill in j.get('skills_flat', []):
                skill_count[skill] += 1

        results = []
        for skill, count in sorted(skill_count.items(), key=lambda x: x[1], reverse=True)[:15]:
            results.append({
                'skill': skill,
                'demand': count,
                'percentage': round(count / total * 100, 1),
                'trend': 'hot' if count / total > 0.3 else ('growing' if count / total > 0.15 else 'stable'),
            })
        return results

    def _role_demand(self, jobs: List[Dict]) -> List[Dict]:
        """Most in-demand roles."""
        role_count = defaultdict(int)
        for j in jobs:
            # Simplify title to role category
            title = j.get('title', '').lower()
            role = self._categorize_role(title)
            role_count[role] += 1

        results = []
        for role, count in sorted(role_count.items(), key=lambda x: x[1], reverse=True)[:10]:
            results.append({'role': role, 'count': count})
        return results

    def _categorize_role(self, title: str) -> str:
        """Map job title to a broad role category."""
        mappings = [
            (['data scientist', 'data science'], 'Data Scientist'),
            (['data engineer'], 'Data Engineer'),
            (['data analyst'], 'Data Analyst'),
            (['machine learning', 'ml engineer', 'ai engineer'], 'ML/AI Engineer'),
            (['frontend', 'front-end', 'front end', 'react', 'angular', 'vue'], 'Frontend Developer'),
            (['backend', 'back-end', 'back end'], 'Backend Developer'),
            (['full stack', 'fullstack', 'full-stack'], 'Full Stack Developer'),
            (['devops', 'sre', 'platform engineer'], 'DevOps Engineer'),
            (['mobile', 'ios', 'android', 'flutter', 'react native'], 'Mobile Developer'),
            (['qa', 'test', 'sdet', 'quality'], 'QA Engineer'),
            (['cloud', 'aws', 'azure'], 'Cloud Engineer'),
            (['product manager', 'product owner'], 'Product Manager'),
            (['designer', 'ux', 'ui'], 'Designer'),
        ]
        for keywords, role in mappings:
            if any(k in title for k in keywords):
                return role
        return 'Software Developer'

    def _hiring_by_source(self, jobs: List[Dict]) -> List[Dict]:
        """Job count by source."""
        source_count = defaultdict(int)
        for j in jobs:
            source_count[j.get('source', 'Unknown')] += 1
        return [{'source': s, 'count': c} for s, c in source_count.items()]

    def _remote_stats(self, jobs: List[Dict]) -> Dict:
        """Remote vs onsite breakdown."""
        remote = sum(1 for j in jobs if j.get('is_remote'))
        total = len(jobs) or 1
        return {
            'remote': remote,
            'onsite': total - remote,
            'remote_percentage': round(remote / total * 100, 1),
        }

    def _top_companies(self, jobs: List[Dict]) -> List[Dict]:
        """Companies with most open positions."""
        company_count = defaultdict(int)
        for j in jobs:
            company = j.get('company', 'Unknown')
            if company and company != 'N/A':
                company_count[company] += 1
        return [
            {'company': c, 'openings': n}
            for c, n in sorted(company_count.items(), key=lambda x: x[1], reverse=True)[:10]
        ]

    def _job_type_dist(self, jobs: List[Dict]) -> List[Dict]:
        """Distribution of job types."""
        type_count = defaultdict(int)
        for j in jobs:
            type_count[j.get('job_type', 'Full-time')] += 1
        return [{'type': t, 'count': c} for t, c in type_count.items()]
