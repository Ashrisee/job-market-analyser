import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../ui/GlassCard';
import { CheckCircle } from 'lucide-react';

const TOOLTIP_STYLE = {
  background: 'rgba(15,12,41,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e2e8f0'
};

export default function SkillGapRadar({ data = {} }) {
  const matched = data.matched_skills || {};
  const missing = data.missing_skills || {};
  const roadmap = data.roadmap || [];

  // Build radar data
  const allSkills = { ...matched, ...missing };
  const radarData = Object.entries(allSkills).slice(0, 10).map(([skill, demand]) => ({
    skill,
    demand,
    yours: matched[skill] ? demand : 0,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar */}
      <GlassCard hover={false}>
        <h3 className="text-sm font-semibold text-white/70 mb-4">Skills vs Market Demand</h3>
        {radarData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Radar name="Market Demand" dataKey="demand" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Your Skills" dataKey="yours" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-white/30 text-center py-8">No skill data available</p>
        )}
        {data.match_percentage !== undefined && (
          <div className="text-center mt-2">
            <span className="text-2xl font-black text-gradient">{data.match_percentage}%</span>
            <span className="text-xs text-white/40 ml-2">market alignment</span>
          </div>
        )}
      </GlassCard>

      {/* Learning Roadmap */}
      <GlassCard hover={false}>
        <h3 className="text-sm font-semibold text-white/70 mb-4">Learning Roadmap</h3>
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
          {roadmap.length > 0 ? roadmap.map((item, i) => (
            <div key={item.skill} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                item.priority === 'medium' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' :
                'bg-[#10b981]/20 text-[#10b981]'
              }`}>{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80">{item.skill}</p>
                <p className="text-[11px] text-white/30">{item.category} · {item.demand} job{item.demand !== 1 ? 's' : ''} require this</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                item.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                item.priority === 'medium' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                'bg-[#10b981]/10 text-[#10b981]'
              }`}>{item.priority}</span>
            </div>
          )) : (
            <div className="flex flex-col items-center py-8 text-white/30">
              <CheckCircle size={32} className="mb-2 text-[#10b981]" />
              <p className="text-sm">Great job! No critical skill gaps found.</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
