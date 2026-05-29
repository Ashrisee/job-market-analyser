import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

export default function AIInsights({ insights = [] }) {
  return (
    <GlassCard hover={false} className="h-full">
      <h3 className="text-sm font-semibold text-white/70 mb-4">AI Career Insights</h3>
      {insights.length > 0 ? (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {insights.map((ins, i) => (
            <InsightCard key={i} insight={ins} delay={i * 0.15} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8 text-white/30">
          <span className="text-3xl mb-2">🤖</span>
          <p className="text-sm">Generating insights...</p>
        </div>
      )}
    </GlassCard>
  );
}

function InsightCard({ insight, delay = 0 }) {
  const colors = {
    career_path: 'border-[#00d4ff]/20',
    market_warning: 'border-[#f59e0b]/20',
    growing_skills: 'border-[#10b981]/20',
    project_recommendation: 'border-[#a855f7]/20',
    career_advice: 'border-[#ec4899]/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl bg-white/[0.02] border ${colors[insight.type] || colors.career_path}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{insight.icon}</span>
        <h4 className="text-sm font-semibold text-white/80">{insight.title}</h4>
      </div>
      <p className="text-xs text-white/50 leading-relaxed">{insight.content}</p>
    </motion.div>
  );
}
