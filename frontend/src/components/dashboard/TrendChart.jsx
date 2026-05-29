import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from '../ui/GlassCard';

const COLORS = ['#00d4ff', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#d946ef', '#22c55e', '#eab308', '#ef4444', '#3b82f6'];

const TOOLTIP_STYLE = {
  background: 'rgba(15,12,41,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#e2e8f0'
};

export default function TrendChart({ data = [], title = 'Trending Skills' }) {
  if (!data.length) return null;

  return (
    <GlassCard hover={false} className="h-full">
      <h3 className="text-sm font-semibold text-white/70 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="skill" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="demand" radius={[0, 6, 6, 0]} animationDuration={1200}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
