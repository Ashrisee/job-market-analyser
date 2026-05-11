"""
CareerScope AI — Flask API Server
All endpoints for job scraping, analysis, matching, salary, and trends.
"""

import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

from config import Config
from scraper import JSearchScraper, AdzunaScraper
from analytics import JobAnalyzer, JobMatcher, SalaryAnalytics, TrendAnalyzer

# ── Setup ──────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(name)s] %(levelname)s: %(message)s')
logger = logging.getLogger('careerscope')

Config.ensure_dirs()

app = Flask(__name__)
CORS(app)

# ── Singletons ─────────────────────────────────────────────────
jsearch = JSearchScraper(Config.JSEARCH_API_KEY)
adzuna = AdzunaScraper(Config.ADZUNA_APP_ID, Config.ADZUNA_APP_KEY)
analyzer = JobAnalyzer()
matcher = JobMatcher()
salary_analytics = SalaryAnalytics()
trend_analyzer = TrendAnalyzer()

# In-memory cache for current session
_cache = {'jobs': [], 'analyzed': [], 'profile': {}}


def _scrape_jobs(keyword: str, location: str, limit: int) -> list:
    """Scrape from all sources and deduplicate."""
    all_jobs = []

    # JSearch
    try:
        all_jobs.extend(jsearch.scrape(keyword, location, limit))
    except Exception as e:
        logger.error(f"JSearch failed: {e}")

    # Adzuna
    try:
        remaining = max(limit - len(all_jobs), 10)
        all_jobs.extend(adzuna.scrape(keyword, location, remaining))
    except Exception as e:
        logger.error(f"Adzuna failed: {e}")

    # Deduplicate
    seen = set()
    unique = []
    for job in all_jobs:
        key = (job['title'].lower().strip(), job['company'].lower().strip())
        if key not in seen:
            seen.add(key)
            unique.append(job)

    logger.info(f"Scraped {len(unique)} unique jobs for '{keyword}' in '{location}'")
    return unique


# ── API Routes ─────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'CareerScope AI API'})


@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """
    Scrape jobs. Query params: keyword, location, limit.
    Returns raw + analyzed jobs.
    """
    keyword = request.args.get('keyword', '').strip()
    location = request.args.get('location', 'India').strip()
    limit = min(int(request.args.get('limit', 30)), 100)

    if not keyword:
        return jsonify({'error': 'keyword is required'}), 400

    raw_jobs = _scrape_jobs(keyword, location, limit)
    if not raw_jobs:
        return jsonify({'jobs': [], 'count': 0, 'message': 'No jobs found. Try a different keyword.'})

    analyzed = analyzer.analyze_jobs(raw_jobs)
    _cache['jobs'] = raw_jobs
    _cache['analyzed'] = analyzed

    # Strip long descriptions for response
    response_jobs = []
    for j in analyzed:
        rj = {k: v for k, v in j.items() if k not in ('description', 'skills_by_category')}
        rj['description'] = j.get('description', '')[:250]
        response_jobs.append(rj)

    return jsonify({'jobs': response_jobs, 'count': len(response_jobs)})


@app.route('/api/match', methods=['POST'])
def match_jobs():
    """
    Match jobs against user profile.
    Body: { skills, experience_level, location, expected_salary, work_mode, preferred_role, tech_stack }
    """
    profile = request.get_json(force=True)
    if not profile:
        return jsonify({'error': 'Profile data required'}), 400

    _cache['profile'] = profile

    # Use cached analyzed jobs, or scrape fresh if none
    analyzed = _cache.get('analyzed', [])
    if not analyzed:
        keyword = profile.get('preferred_role', 'developer')
        location = profile.get('location', 'India')
        raw = _scrape_jobs(keyword, location, 30)
        analyzed = analyzer.analyze_jobs(raw)
        _cache['analyzed'] = analyzed

    matched = matcher.match_jobs(analyzed, profile)
    summary = matcher.get_match_summary(matched)

    return jsonify({
        'matched_jobs': matched[:50],
        'summary': summary,
        'total': len(matched),
    })


@app.route('/api/analysis', methods=['GET'])
def get_analysis():
    """Return skill statistics and analysis of scraped jobs."""
    analyzed = _cache.get('analyzed', [])
    if not analyzed:
        return jsonify({'error': 'No jobs data. Call /api/jobs first.'}), 400

    skill_stats = analyzer.get_skill_statistics(analyzed)
    total = len(analyzed)
    remote = sum(1 for j in analyzed if j.get('is_remote'))

    return jsonify({
        'total_jobs': total,
        'remote_jobs': remote,
        'skill_statistics': skill_stats,
        'avg_skills_per_job': round(sum(j.get('skill_count', 0) for j in analyzed) / max(total, 1), 1),
    })


@app.route('/api/salary', methods=['GET'])
def get_salary():
    """Salary analytics for scraped jobs."""
    analyzed = _cache.get('analyzed', [])
    if not analyzed:
        return jsonify({'error': 'No jobs data. Call /api/jobs first.'}), 400

    result = salary_analytics.analyze(analyzed)
    return jsonify(result)


@app.route('/api/trends', methods=['GET'])
def get_trends():
    """Market trend analysis."""
    analyzed = _cache.get('analyzed', [])
    if not analyzed:
        return jsonify({'error': 'No jobs data. Call /api/jobs first.'}), 400

    result = trend_analyzer.analyze(analyzed)
    return jsonify(result)


@app.route('/api/skills-gap', methods=['POST'])
def get_skills_gap():
    """
    Skill gap analysis.
    Body: { skills: [...] }
    """
    data = request.get_json(force=True)
    user_skills = data.get('skills', [])

    if not user_skills:
        return jsonify({'error': 'skills array is required'}), 400

    analyzed = _cache.get('analyzed', [])
    if not analyzed:
        return jsonify({'error': 'No jobs data. Call /api/jobs first.'}), 400

    result = analyzer.get_skill_gap(user_skills, analyzed)
    return jsonify(result)


@app.route('/api/insights', methods=['POST'])
def get_insights():
    """
    AI-powered insights (rule-based).
    Body: { skills, experience_level, preferred_role }
    """
    profile = request.get_json(force=True)
    analyzed = _cache.get('analyzed', [])

    skills = profile.get('skills', [])
    level = profile.get('experience_level', 'fresher')
    role = profile.get('preferred_role', 'developer')

    skill_stats = analyzer.get_skill_statistics(analyzed) if analyzed else {}
    top_skills = list(skill_stats.keys())[:5]

    insights = []

    # Career suggestion
    insights.append({
        'type': 'career_path',
        'icon': '🚀',
        'title': 'Career Path Suggestion',
        'content': f"Based on your skills in {', '.join(skills[:3]) if skills else 'your domain'}, "
                   f"consider focusing on roles in {role}. "
                   f"The market shows strong demand for professionals with these skills."
    })

    # Market warning
    if analyzed:
        remote_pct = sum(1 for j in analyzed if j.get('is_remote')) / max(len(analyzed), 1) * 100
        insights.append({
            'type': 'market_warning',
            'icon': '⚠️',
            'title': 'Market Intelligence',
            'content': f"{round(remote_pct)}% of current listings are remote-friendly. "
                       f"{'Great news for remote workers!' if remote_pct > 40 else 'Consider being open to onsite/hybrid roles to increase your chances.'}"
        })

    # Growing skills
    if top_skills:
        insights.append({
            'type': 'growing_skills',
            'icon': '📈',
            'title': 'Fastest Growing Skills',
            'content': f"Top in-demand skills right now: {', '.join(top_skills)}. "
                       f"{'You already know some of these!' if any(s.lower() in [us.lower() for us in skills] for s in top_skills) else 'Consider adding these to your skillset.'}"
        })

    # Project recommendations
    project_map = {
        'python': 'Build a REST API with FastAPI, or a data pipeline with pandas',
        'react': 'Create a dashboard with React + Recharts, or a full-stack app with Next.js',
        'javascript': 'Build a real-time chat app with Socket.io, or a Chrome extension',
        'machine learning': 'Train a model on Kaggle, or build an ML-powered web app',
        'java': 'Build a microservices architecture with Spring Boot',
        'data science': 'Complete an end-to-end EDA project on a real-world dataset',
    }
    for skill in skills:
        sl = skill.lower()
        if sl in project_map:
            insights.append({
                'type': 'project_recommendation',
                'icon': '💡',
                'title': f'Recommended Project ({skill})',
                'content': project_map[sl]
            })
            break

    # Level-specific advice
    level_advice = {
        'fresher': "Focus on building a strong portfolio with 3-4 projects. Open-source contributions and hackathons can significantly boost your profile.",
        'junior': "Start contributing to team projects and learn about system design. Consider AWS/GCP certification to stand out.",
        'mid': "Demonstrate leadership on projects. Consider specializing deeper in your domain or broadening into architecture.",
        'senior': "Focus on mentorship, system design, and strategic thinking. Consider speaking at conferences or writing technical blogs.",
    }
    insights.append({
        'type': 'career_advice',
        'icon': '🎯',
        'title': f'Advice for {level.title()} Level',
        'content': level_advice.get(level, level_advice['fresher'])
    })

    return jsonify({'insights': insights})


# ── Main ───────────────────────────────────────────────────────
if __name__ == '__main__':
    logger.info(f"Starting CareerScope AI API on port {Config.FLASK_PORT}")
    logger.info(f"JSearch API: {'✓ configured' if Config.JSEARCH_API_KEY else '✗ missing'}")
    logger.info(f"Adzuna API:  {'✓ configured' if Config.ADZUNA_APP_ID else '✗ missing'}")
    app.run(host='0.0.0.0', port=Config.FLASK_PORT, debug=Config.FLASK_DEBUG)
