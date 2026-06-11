// Mock data for demo mode when backend is unavailable

export const MOCK_JOBS = [
  {
    title: 'Senior React Developer',
    company: 'TechCorp India',
    location: 'Bangalore',
    salary: '₹18,00,000 - ₹28,00,000',
    salary_min: 1800000,
    salary_max: 2800000,
    overall_score: 92,
    is_remote: true,
    job_type: 'Full-time',
    source: 'JSearch',
    url: '#',
    skills_flat: ['React', 'TypeScript', 'Node.js', 'Redux', 'AWS'],
    posted_date: '2026-06-10',
  },
  {
    title: 'Full Stack Engineer',
    company: 'Startup Ventures',
    location: 'Remote',
    salary: '₹12,00,000 - ₹20,00,000',
    salary_min: 1200000,
    salary_max: 2000000,
    overall_score: 87,
    is_remote: true,
    job_type: 'Full-time',
    source: 'Adzuna',
    url: '#',
    skills_flat: ['React', 'Python', 'PostgreSQL', 'Docker'],
    posted_date: '2026-06-09',
  },
  {
    title: 'Frontend Developer',
    company: 'GlobalTech Solutions',
    location: 'Hyderabad',
    salary: '₹8,00,000 - ₹14,00,000',
    salary_min: 800000,
    salary_max: 1400000,
    overall_score: 78,
    is_remote: false,
    job_type: 'Full-time',
    source: 'JSearch',
    url: '#',
    skills_flat: ['React', 'JavaScript', 'CSS', 'Tailwind'],
    posted_date: '2026-06-08',
  },
  {
    title: 'Python Backend Developer',
    company: 'DataFlow Analytics',
    location: 'Mumbai',
    salary: '₹10,00,000 - ₹18,00,000',
    salary_min: 1000000,
    salary_max: 1800000,
    overall_score: 73,
    is_remote: false,
    job_type: 'Full-time',
    source: 'Internshala',
    url: '#',
    skills_flat: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    posted_date: '2026-06-07',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudNative Inc',
    location: 'Pune',
    salary: '₹15,00,000 - ₹25,00,000',
    salary_min: 1500000,
    salary_max: 2500000,
    overall_score: 65,
    is_remote: true,
    job_type: 'Full-time',
    source: 'JSearch',
    url: '#',
    skills_flat: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
    posted_date: '2026-06-06',
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'Bangalore',
    salary: '₹20,00,000 - ₹35,00,000',
    salary_min: 2000000,
    salary_max: 3500000,
    overall_score: 81,
    is_remote: true,
    job_type: 'Full-time',
    source: 'JSearch',
    url: '#',
    skills_flat: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP'],
    posted_date: '2026-06-10',
  },
  {
    title: 'React Native Developer',
    company: 'MobiTech',
    location: 'Delhi NCR',
    salary: '₹9,00,000 - ₹16,00,000',
    salary_min: 900000,
    salary_max: 1600000,
    overall_score: 58,
    is_remote: false,
    job_type: 'Full-time',
    source: 'Adzuna',
    url: '#',
    skills_flat: ['React Native', 'JavaScript', 'TypeScript', 'Redux'],
    posted_date: '2026-06-05',
  },
  {
    title: 'Data Scientist',
    company: 'Analytics Hub',
    location: 'Hyderabad',
    salary: '₹12,00,000 - ₹22,00,000',
    salary_min: 1200000,
    salary_max: 2200000,
    overall_score: 69,
    is_remote: true,
    job_type: 'Full-time',
    source: 'JSearch',
    url: '#',
    skills_flat: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'SQL'],
    posted_date: '2026-06-09',
  },
  {
    title: 'Node.js Backend Engineer',
    company: 'FinTech Startup',
    location: 'Bangalore',
    salary: '₹11,00,000 - ₹19,00,000',
    salary_min: 1100000,
    salary_max: 1900000,
    overall_score: 76,
    is_remote: true,
    job_type: 'Contract',
    source: 'Internshala',
    url: '#',
    skills_flat: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
    posted_date: '2026-06-08',
  },
  {
    title: 'Software Engineer - Generative AI',
    company: 'FutureAI Labs',
    location: 'Remote',
    salary: '₹25,00,000 - ₹45,00,000',
    salary_min: 2500000,
    salary_max: 4500000,
    overall_score: 88,
    is_remote: true,
    job_type: 'Full-time',
    source: 'JSearch',
    url: '#',
    skills_flat: ['Python', 'LLM', 'Generative AI', 'FastAPI', 'Vector DB'],
    posted_date: '2026-06-11',
  },
];

export const MOCK_MATCH_DATA = (skills = [], role = '') => {
  const matched = MOCK_JOBS.map((job, i) => ({
    ...job,
    overall_score: Math.max(40, job.overall_score - Math.floor(Math.random() * 20)),
  })).sort((a, b) => b.overall_score - a.overall_score);

  const scores = matched.map(j => j.overall_score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highMatches = scores.filter(s => s >= 75).length;

  return {
    matched_jobs: matched,
    summary: {
      total: matched.length,
      avg_score: avg,
      high_matches: highMatches,
      top_score: Math.max(...scores),
    },
    total: matched.length,
  };
};

export const MOCK_TRENDS = {
  trending_skills: [
    { skill: 'React', demand: 234 },
    { skill: 'Python', demand: 218 },
    { skill: 'TypeScript', demand: 195 },
    { skill: 'AWS', demand: 176 },
    { skill: 'Node.js', demand: 162 },
    { skill: 'Docker', demand: 148 },
    { skill: 'Kubernetes', demand: 127 },
    { skill: 'Next.js', demand: 115 },
    { skill: 'Generative AI', demand: 108 },
    { skill: 'PostgreSQL', demand: 97 },
  ],
  remote_vs_onsite: {
    remote_percentage: 62,
    onsite_percentage: 20,
    hybrid_percentage: 18,
  },
  top_companies: [
    { company: 'Google', count: 45 },
    { company: 'Microsoft', count: 38 },
    { company: 'Amazon', count: 36 },
    { company: 'Flipkart', count: 29 },
    { company: 'Swiggy', count: 24 },
  ],
  hiring_by_source: [
    { source: 'JSearch', count: 156 },
    { source: 'Adzuna', count: 98 },
    { source: 'Internshala', count: 67 },
  ],
};

export const MOCK_SALARY = {
  overview: {
    avg: 1580000,
    median: 1400000,
    min: 600000,
    max: 4500000,
  },
  by_experience: [
    { level: 'fresher', avg_salary: 650000 },
    { level: 'junior', avg_salary: 1100000 },
    { level: 'mid', avg_salary: 1850000 },
    { level: 'senior', avg_salary: 3200000 },
  ],
  by_location: [
    { location: 'Bangalore', avg_salary: 1850000 },
    { location: 'Mumbai', avg_salary: 1720000 },
    { location: 'Hyderabad', avg_salary: 1600000 },
    { location: 'Pune', avg_salary: 1480000 },
    { location: 'Delhi NCR', avg_salary: 1540000 },
    { location: 'Remote', avg_salary: 1950000 },
    { location: 'Chennai', avg_salary: 1380000 },
  ],
};

export const MOCK_SKILL_GAP = (userSkills = []) => {
  const marketSkills = {
    React: 234,
    TypeScript: 195,
    'Node.js': 162,
    Python: 218,
    AWS: 176,
    Docker: 148,
    PostgreSQL: 97,
    'Generative AI': 108,
    Kubernetes: 127,
    GraphQL: 76,
  };

  const matched = {};
  const missing = {};

  Object.entries(marketSkills).forEach(([skill, demand]) => {
    if (userSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      matched[skill] = demand;
    } else {
      missing[skill] = demand;
    }
  });

  const totalMarket = Object.values(marketSkills).reduce((a, b) => a + b, 0);
  const matchedTotal = Object.values(matched).reduce((a, b) => a + b, 0);
  const matchPercentage = Math.round((matchedTotal / totalMarket) * 100);

  const roadmap = Object.entries(missing)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, demand]) => ({
      skill,
      demand,
      priority: demand > 150 ? 'high' : demand > 100 ? 'medium' : 'low',
      category: getCategoryForSkill(skill),
    }));

  return { matched_skills: matched, missing_skills: missing, roadmap, match_percentage: matchPercentage };
};

function getCategoryForSkill(skill) {
  const categories = {
    React: 'Frontend', TypeScript: 'Language', 'Node.js': 'Backend',
    Python: 'Language', AWS: 'Cloud', Docker: 'DevOps',
    PostgreSQL: 'Database', 'Generative AI': 'AI/ML', Kubernetes: 'DevOps', GraphQL: 'API',
  };
  return categories[skill] || 'Technology';
}

export const MOCK_INSIGHTS = (profile = {}) => ({
  insights: [
    {
      type: 'career_path',
      icon: '🚀',
      title: 'Career Path Suggestion',
      content: `Based on your ${profile.skills?.length ? `skills in ${profile.skills.slice(0, 3).join(', ')}` : 'profile'}, you are well-positioned for ${profile.preferred_role || 'software engineering'} roles. The market shows strong demand for professionals with your background.`,
    },
    {
      type: 'market_warning',
      icon: '⚠️',
      title: 'Market Intelligence',
      content: '62% of current listings are remote-friendly. Great news for remote workers! The trend towards distributed teams continues to accelerate.',
    },
    {
      type: 'growing_skills',
      icon: '📈',
      title: 'Fastest Growing Skills',
      content: 'Top in-demand skills right now: React, Python, TypeScript, AWS, Generative AI. Generative AI roles have surged 340% in the last 6 months alone.',
    },
    {
      type: 'project_recommendation',
      icon: '💡',
      title: 'Recommended Project',
      content: 'Build a full-stack AI-powered dashboard with React + FastAPI. Include real-time data visualization and deploy on AWS to showcase cloud skills to recruiters.',
    },
    {
      type: 'career_advice',
      icon: '🎯',
      title: `Advice for ${(profile.experience_level || 'fresher').charAt(0).toUpperCase() + (profile.experience_level || 'fresher').slice(1)} Level`,
      content: profile.experience_level === 'senior'
        ? 'Focus on mentorship, system design, and strategic thinking. Consider speaking at conferences or writing technical blogs to build your personal brand.'
        : profile.experience_level === 'mid'
        ? 'Demonstrate leadership on projects. Consider specializing deeper in your domain or broadening into architecture and system design.'
        : profile.experience_level === 'junior'
        ? 'Start contributing to team projects and learn about system design. Consider AWS/GCP certification to stand out from the crowd.'
        : 'Focus on building a strong portfolio with 3–4 projects. Open-source contributions and hackathons can significantly boost your profile.',
    },
  ],
});
