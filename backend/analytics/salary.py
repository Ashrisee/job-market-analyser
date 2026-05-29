# Salary analytics module — breakdowns by location, experience, and role.

import logging
from typing import List, Dict
from collections import defaultdict

logger = logging.getLogger(__name__)


class SalaryAnalytics:
    """Generate salary insights from job data."""

    def analyze(self, jobs: List[Dict]) -> Dict:
        """Full salary analysis."""
        jobs_with_salary = [j for j in jobs if j.get('salary_avg', 0) > 0]

        if not jobs_with_salary:
            return {
                'overview': {'avg': 0, 'min': 0, 'max': 0, 'median': 0, 'count': 0},
                'by_location': [],
                'by_experience': [],
                'distribution': [],
            }

        avgs = sorted([j['salary_avg'] for j in jobs_with_salary])
        mid = len(avgs) // 2
        median = avgs[mid] if len(avgs) % 2 else (avgs[mid - 1] + avgs[mid]) / 2

        return {
            'overview': {
                'avg': round(sum(avgs) / len(avgs)),
                'min': round(min(avgs)),
                'max': round(max(avgs)),
                'median': round(median),
                'count': len(jobs_with_salary),
            },
            'by_location': self._by_location(jobs_with_salary),
            'by_experience': self._by_experience(jobs_with_salary),
            'distribution': self._distribution(avgs),
        }

    def _by_location(self, jobs: List[Dict]) -> List[Dict]:
        """Average salary by location."""
        loc_salaries = defaultdict(list)
        for j in jobs:
            loc = j.get('location', 'Unknown')
            # Simplify location (take first part before comma)
            loc = loc.split(',')[0].strip()
            loc_salaries[loc].append(j['salary_avg'])

        results = []
        for loc, sals in loc_salaries.items():
            results.append({
                'location': loc,
                'avg_salary': round(sum(sals) / len(sals)),
                'min_salary': round(min(sals)),
                'max_salary': round(max(sals)),
                'count': len(sals),
            })
        results.sort(key=lambda x: x['avg_salary'], reverse=True)
        return results[:10]

    def _by_experience(self, jobs: List[Dict]) -> List[Dict]:
        """Estimated salary by experience level."""
        levels = {'fresher': [], 'junior': [], 'mid': [], 'senior': []}
        for j in jobs:
            title = j.get('title', '').lower()
            if any(k in title for k in ['intern', 'trainee', 'fresher', 'graduate']):
                levels['fresher'].append(j['salary_avg'])
            elif any(k in title for k in ['junior', 'entry', 'associate']):
                levels['junior'].append(j['salary_avg'])
            elif any(k in title for k in ['senior', 'lead', 'principal', 'staff', 'architect']):
                levels['senior'].append(j['salary_avg'])
            else:
                levels['mid'].append(j['salary_avg'])

        results = []
        for level, sals in levels.items():
            if sals:
                results.append({
                    'level': level,
                    'avg_salary': round(sum(sals) / len(sals)),
                    'count': len(sals),
                })
            else:
                results.append({'level': level, 'avg_salary': 0, 'count': 0})
        return results

    def _distribution(self, sorted_avgs: List[float]) -> List[Dict]:
        """Create salary distribution buckets."""
        if not sorted_avgs:
            return []

        min_s = sorted_avgs[0]
        max_s = sorted_avgs[-1]
        if min_s == max_s:
            return [{'range': f"${int(min_s):,}", 'count': len(sorted_avgs)}]

        bucket_count = min(8, len(sorted_avgs))
        bucket_size = (max_s - min_s) / bucket_count
        buckets = []

        for i in range(bucket_count):
            low = min_s + i * bucket_size
            high = low + bucket_size
            count = sum(1 for s in sorted_avgs if low <= s < high) if i < bucket_count - 1 else sum(1 for s in sorted_avgs if low <= s <= high)
            buckets.append({
                'range': f"${int(low):,} - ${int(high):,}",
                'low': round(low),
                'high': round(high),
                'count': count,
            })
        return buckets
