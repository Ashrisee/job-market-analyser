import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from '../ui/GlassCard';

const COLORS = { fresher: '#00d4ff', junior: '#a855f7', mid: '#10b981', senior: '#f59e0b' };

export default function SalaryChart({ data = {} }) {
  const byExperience = (data.by_experience || []).filter(d => d.avg_salary > 0);
  const byLocation = (data.by_location || []).slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* By Experience */}
      <GlassCard hover={false}>
        <h3 className="text-sm font-semibold text-white/70 mb-4">Salary by Experience</h3>
        {byExperience.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byExperience} margin={{ left: 0, right: 10 }}>
              <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,12,41,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#e2e8f0' }}
                formatter={v => [`$${v.toLocaleString()}`, 'Avg Salary']}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="avg_salary" radius={[6, 6, 0, 0]} animationDuration={1200}>
                {byExperience.map((entry) => (
                  <Cell key={entry.level} fill={COLORS[entry.level] || '#6366f1'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-white/30 text-center py-8">No salary data available</p>
        )}
      </GlassCard>

      {/* By Location */}
      <GlassCard hover={false}>
        <h3 className="text-sm font-semibold text-white/70 mb-4">Salary by Location</h3>
        {byLocation.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byLocation} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="location" tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,12,41,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', color: '#e2e8f0' }}
                formatter={v => [`$${v.toLocaleString()}`, 'Avg Salary']}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="avg_salary" radius={[0, 6, 6, 0]} fill="#a855f7" fillOpacity={0.7} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-white/30 text-center py-8">No location salary data</p>
        )}
      </GlassCard>
    </div>
  );
}
