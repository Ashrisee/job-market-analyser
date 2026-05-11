import { motion } from 'framer-motion';
import { Bookmark, ExternalLink, MapPin, Building2, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function JobMatchCard({ job, index = 0 }) {
  const [bookmarked, setBookmarked] = useState(false);
  const score = job.overall_score || 0;

  const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl p-5 hover:bg-white/[0.04] transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white/90 truncate">{job.title}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold glass" style={{ color: scoreColor, borderColor: `${scoreColor}40`, borderWidth: 1 }}>
              {score}%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mb-3">
            <span className="flex items-center gap-1"><Building2 size={12} />{job.company}</span>
            <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
            {job.salary && job.salary !== 'Not disclosed' && (
              <span className="flex items-center gap-1"><DollarSign size={12} />{job.salary}</span>
            )}
          </div>

          {/* Skill pills */}
          {job.skills_flat?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.skills_flat.slice(0, 5).map(skill => (
                <span key={skill} className="px-2 py-0.5 rounded-md bg-[#00d4ff]/5 text-[11px] text-[#00d4ff]/70 border border-[#00d4ff]/10">
                  {skill}
                </span>
              ))}
              {job.skills_flat.length > 5 && (
                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-white/40">+{job.skills_flat.length - 5}</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium glass text-white/40">{job.source}</span>
            {job.is_remote && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#10b981]/10 text-[#10b981]">Remote</span>}
            {job.job_type && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium glass text-white/30">{job.job_type}</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {/* Score ring */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke={scoreColor} strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: scoreColor }}>{score}</span>
          </div>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Bookmark size={16} className={bookmarked ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-white/30'} />
          </button>

          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <ExternalLink size={16} className="text-white/30 hover:text-[#00d4ff]" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
