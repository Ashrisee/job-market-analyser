import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, DollarSign, Target, Brain, ArrowLeft, Download } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import TrendChart from '../components/dashboard/TrendChart';
import SalaryChart from '../components/dashboard/SalaryChart';
import SkillGapRadar from '../components/dashboard/SkillGapRadar';
import JobListings from '../components/dashboard/JobListings';
import AIInsights from '../components/dashboard/AIInsights';
import { CardShimmer } from '../components/ui/ShimmerLoader';
import GlowButton from '../components/ui/GlowButton';
import Footer from '../components/layout/Footer';
import { API } from '../services/api';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [salary, setSalary] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [insights, setInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!profile) { navigate('/'); return; }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [matchRes, trendRes, salaryRes, gapRes, insightRes] = await Promise.allSettled([
        API.matchJobs(profile),
        API.getTrends(),
        API.getSalary(),
        API.getSkillsGap(profile.skills || []),
        API.getInsights(profile),
      ]);

      if (matchRes.status === 'fulfilled') setMatchData(matchRes.value);
      if (trendRes.status === 'fulfilled') setTrends(trendRes.value);
      if (salaryRes.status === 'fulfilled') setSalary(salaryRes.value);
      if (gapRes.status === 'fulfilled') setSkillGap(gapRes.value);
      if (insightRes.status === 'fulfilled') setInsights(insightRes.value.insights || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'jobs', label: 'Job Listings', icon: Briefcase },
    { id: 'trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'salary', label: 'Salary', icon: DollarSign },
    { id: 'skills', label: 'Skill Gap', icon: Brain },
    { id: 'insights', label: 'AI Insights', icon: Brain },
  ];

  const summary = matchData?.summary || {};

  const exportReport = () => {
    const data = { profile, summary, jobs: matchData?.matched_jobs?.slice(0, 20), trends: trends?.trending_skills, salary: salary?.overview, skillGap: skillGap?.roadmap, insights };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'careerscope-report.json'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!profile) return null;

  return (
    <>
      <DashboardLayout profile={profile}>
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-white/40 bg-transparent border-0 cursor-pointer hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex-1" />
          <GlowButton variant="secondary" size="sm" onClick={exportReport}>
            <Download size={14} /> Export Report
          </GlowButton>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap cursor-pointer transition-all duration-300 border ${
                  isActive
                    ? 'border-[#00d4ff]/20 bg-gradient-to-r from-[#00d4ff]/12 to-[#a855f7]/12 text-white shadow-[0_0_15px_rgba(0,212,255,0.05)]'
                    : 'border-transparent bg-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <CardShimmer key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CardShimmer />
              <CardShimmer />
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Matches" value={summary.total || 0} icon={Briefcase} color="#00d4ff" />
                  <StatCard label="Avg Match Score" value={summary.avg_score || 0} suffix="%" icon={Target} color="#a855f7" />
                  <StatCard label="High Matches (75%+)" value={summary.high_matches || 0} icon={TrendingUp} color="#10b981" />
                  <StatCard label="Top Score" value={summary.top_score || 0} suffix="%" icon={Brain} color="#f59e0b" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrendChart data={trends?.trending_skills || []} title="Top In-Demand Skills" />
                  <AIInsights insights={insights} />
                </div>
                <JobListings jobs={(matchData?.matched_jobs || []).slice(0, 10)} />
              </div>
            )}

            {activeTab === 'jobs' && <JobListings jobs={matchData?.matched_jobs || []} />}

            {activeTab === 'trends' && (
              <div className="flex flex-col gap-6">
                <TrendChart data={trends?.trending_skills || []} title="Trending Skills in Market" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard label="Remote Jobs" value={trends?.remote_vs_onsite?.remote_percentage || 0} suffix="%" icon={Target} color="#10b981" />
                  <StatCard label="Total Companies" value={trends?.top_companies?.length || 0} icon={Briefcase} color="#a855f7" />
                  <StatCard label="Job Sources" value={trends?.hiring_by_source?.length || 0} icon={TrendingUp} color="#00d4ff" />
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div className="flex flex-col gap-6">
                {salary?.overview && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Average Salary" value={`₹${(salary.overview.avg || 0).toLocaleString()}`} icon={DollarSign} color="#10b981" />
                    <StatCard label="Median Salary" value={`₹${(salary.overview.median || 0).toLocaleString()}`} icon={DollarSign} color="#a855f7" />
                    <StatCard label="Min Salary" value={`₹${(salary.overview.min || 0).toLocaleString()}`} icon={DollarSign} color="#f59e0b" />
                    <StatCard label="Max Salary" value={`₹${(salary.overview.max || 0).toLocaleString()}`} icon={DollarSign} color="#00d4ff" />
                  </div>
                )}
                <SalaryChart data={salary || {}} />
              </div>
            )}

            {activeTab === 'skills' && <SkillGapRadar data={skillGap || {}} />}
            {activeTab === 'insights' && <AIInsights insights={insights} />}
          </motion.div>
        )}
      </DashboardLayout>
      <Footer />
    </>
  );
}
