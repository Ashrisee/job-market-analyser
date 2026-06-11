// CareerScope AI — API Client
// Proxies to Flask backend at localhost:5001 (via Vite proxy /api)
// Falls back to mock data if backend is unreachable.

import {
  MOCK_MATCH_DATA,
  MOCK_TRENDS,
  MOCK_SALARY,
  MOCK_SKILL_GAP,
  MOCK_INSIGHTS,
} from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Singleton backend availability — checked once per page load
let _backendAvailable = null;

async function _checkOnce() {
  if (_backendAvailable !== null) return _backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    _backendAvailable = res.ok;
  } catch {
    _backendAvailable = false;
  }
  return _backendAvailable;
}

export const API = {
  /** Returns true if the Flask backend is reachable */
  async checkBackend() {
    return _checkOnce();
  },

  async fetchJobs(keyword, location = 'India', limit = 30) {
    if (!(await _checkOnce())) return { jobs: [], count: 0 };
    const params = new URLSearchParams({ keyword, location, limit });
    const res = await fetch(`${API_BASE}/jobs?${params}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async matchJobs(profile) {
    if (!(await _checkOnce())) {
      await _delay(700);
      return MOCK_MATCH_DATA(profile.skills, profile.preferred_role);
    }
    const res = await fetch(`${API_BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to match jobs');
    return res.json();
  },

  async getAnalysis() {
    if (!(await _checkOnce())) return {};
    const res = await fetch(`${API_BASE}/analysis`);
    if (!res.ok) throw new Error('Failed to get analysis');
    return res.json();
  },

  async getSalary() {
    if (!(await _checkOnce())) {
      await _delay(400);
      return MOCK_SALARY;
    }
    const res = await fetch(`${API_BASE}/salary`);
    if (!res.ok) throw new Error('Failed to get salary data');
    return res.json();
  },

  async getTrends() {
    if (!(await _checkOnce())) {
      await _delay(300);
      return MOCK_TRENDS;
    }
    const res = await fetch(`${API_BASE}/trends`);
    if (!res.ok) throw new Error('Failed to get trends');
    return res.json();
  },

  async getSkillsGap(skills) {
    if (!(await _checkOnce())) {
      await _delay(500);
      return MOCK_SKILL_GAP(skills);
    }
    const res = await fetch(`${API_BASE}/skills-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) throw new Error('Failed to analyze skills gap');
    return res.json();
  },

  async getInsights(profile) {
    if (!(await _checkOnce())) {
      await _delay(400);
      return MOCK_INSIGHTS(profile);
    }
    const res = await fetch(`${API_BASE}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to get insights');
    return res.json();
  },
};

function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
