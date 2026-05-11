"""Job analysis engine — skill extraction, salary parsing, and job feature analysis."""

import re
import logging
from typing import List, Dict, Tuple

logger = logging.getLogger(__name__)


class JobAnalyzer:
    """Analyze job listings to extract structured insights."""

    SKILL_CATEGORIES = {
        'programming_languages': [
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'golang', 'go',
            'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'dart', 'lua'
        ],
        'frontend': [
            'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'html', 'css',
            'sass', 'tailwind', 'bootstrap', 'redux', 'jquery', 'webpack', 'vite'
        ],
        'backend': [
            'django', 'flask', 'fastapi', 'spring', 'express', 'rails', 'laravel',
            'asp.net', 'node.js', 'nest.js', 'gin', 'fiber', 'graphql', 'rest'
        ],
        'databases': [
            'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
            'cassandra', 'dynamodb', 'firebase', 'supabase', 'oracle', 'sqlite'
        ],
        'cloud_devops': [
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
            'jenkins', 'github actions', 'gitlab ci', 'ci/cd', 'linux', 'nginx'
        ],
        'ai_ml': [
            'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow',
            'pytorch', 'scikit-learn', 'keras', 'hugging face', 'langchain', 'llm',
            'generative ai', 'openai', 'data science', 'pandas', 'numpy'
        ],
        'mobile': [
            'react native', 'flutter', 'ios', 'android', 'swiftui', 'jetpack compose'
        ],
        'tools': [
            'git', 'jira', 'figma', 'postman', 'vs code', 'intellij', 'vim'
        ],
    }

    # Flatten for quick lookup
    ALL_SKILLS = []
    for cat_skills in SKILL_CATEGORIES.values():
        ALL_SKILLS.extend(cat_skills)

    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """Extract categorized skills from job description text."""
        text_lower = text.lower()
        found = {}
        for category, skills in self.SKILL_CATEGORIES.items():
            matched = [s for s in skills if s in text_lower]
            if matched:
                found[category] = matched
        return found

    def extract_flat_skills(self, text: str) -> List[str]:
        """Extract flat list of skills from text."""
        text_lower = text.lower()
        return [s for s in self.ALL_SKILLS if s in text_lower]

    @staticmethod
    def extract_salary_range(salary_str: str) -> Tuple[float, float]:
        """Parse salary range from string."""
        if not salary_str or salary_str in ("Not disclosed", "Not mentioned"):
            return (0.0, 0.0)
        numbers = re.findall(r'[\d]+', str(salary_str).replace(',', ''))
        nums = [float(n) for n in numbers]
        if len(nums) >= 2:
            return (nums[0], nums[1])
        elif len(nums) == 1:
            return (nums[0], nums[0])
        return (0.0, 0.0)

    def analyze_jobs(self, jobs: List[Dict]) -> List[Dict]:
        """Enrich job listings with extracted features."""
        analyzed = []
        for job in jobs:
            desc = job.get('description', '')
            enriched = {**job}

            # Skills
            enriched['skills_by_category'] = self.extract_skills(desc)
            enriched['skills_flat'] = self.extract_flat_skills(desc)
            enriched['skill_count'] = len(enriched['skills_flat'])

            # Salary
            sal_min = job.get('salary_min', 0)
            sal_max = job.get('salary_max', 0)
            if not sal_min and not sal_max:
                sal_min, sal_max = self.extract_salary_range(job.get('salary', ''))
            enriched['salary_min'] = sal_min
            enriched['salary_max'] = sal_max
            enriched['salary_avg'] = (sal_min + sal_max) / 2 if (sal_min or sal_max) else 0

            # Text features
            enriched['description_length'] = len(desc.split())
            enriched['is_remote'] = job.get('is_remote', False) or 'remote' in desc.lower() or 'remote' in job.get('location', '').lower()

            analyzed.append(enriched)

        logger.info(f"Analyzed {len(analyzed)} jobs")
        return analyzed

    def get_skill_statistics(self, jobs: List[Dict]) -> Dict[str, int]:
        """Aggregate skill frequency across all jobs."""
        skill_count = {}
        for job in jobs:
            for skill in job.get('skills_flat', []):
                skill_count[skill] = skill_count.get(skill, 0) + 1
        return dict(sorted(skill_count.items(), key=lambda x: x[1], reverse=True)[:25])

    def get_skill_gap(self, user_skills: List[str], jobs: List[Dict]) -> Dict:
        """Identify skills the user is missing that are in high demand."""
        market_skills = self.get_skill_statistics(jobs)
        user_skills_lower = [s.lower() for s in user_skills]

        missing = {}
        matched = {}
        for skill, count in market_skills.items():
            if skill.lower() in user_skills_lower:
                matched[skill] = count
            else:
                missing[skill] = count

        # Generate learning roadmap
        roadmap = []
        priority_order = sorted(missing.items(), key=lambda x: x[1], reverse=True)
        for i, (skill, demand) in enumerate(priority_order[:10]):
            priority = 'high' if i < 3 else ('medium' if i < 6 else 'low')
            roadmap.append({
                'skill': skill,
                'demand': demand,
                'priority': priority,
                'category': self._find_category(skill),
            })

        return {
            'user_skills': user_skills,
            'matched_skills': matched,
            'missing_skills': missing,
            'roadmap': roadmap,
            'match_percentage': round(len(matched) / max(len(market_skills), 1) * 100, 1),
        }

    def _find_category(self, skill: str) -> str:
        """Find which category a skill belongs to."""
        for cat, skills in self.SKILL_CATEGORIES.items():
            if skill.lower() in [s.lower() for s in skills]:
                return cat.replace('_', ' ').title()
        return 'Other'
