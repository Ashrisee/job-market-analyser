const API_BASE = '/api';

export const API = {
  async fetchJobs(keyword, location = 'India', limit = 30) {
    const params = new URLSearchParams({ keyword, location, limit });
    const res = await fetch(`${API_BASE}/jobs?${params}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async matchJobs(profile) {
    const res = await fetch(`${API_BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to match jobs');
    return res.json();
  },

  async getAnalysis() {
    const res = await fetch(`${API_BASE}/analysis`);
    if (!res.ok) throw new Error('Failed to get analysis');
    return res.json();
  },

  async getSalary() {
    const res = await fetch(`${API_BASE}/salary`);
    if (!res.ok) throw new Error('Failed to get salary data');
    return res.json();
  },

  async getTrends() {
    const res = await fetch(`${API_BASE}/trends`);
    if (!res.ok) throw new Error('Failed to get trends');
    return res.json();
  },

  async getSkillsGap(skills) {
    const res = await fetch(`${API_BASE}/skills-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) throw new Error('Failed to analyze skills gap');
    return res.json();
  },

  async getInsights(profile) {
    const res = await fetch(`${API_BASE}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to get insights');
    return res.json();
  },
};
