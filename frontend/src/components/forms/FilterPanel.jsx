import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';

export default function FilterPanel({ filters, onChange, isOpen, onToggle }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <>
      <button onClick={onToggle} className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-white/60 hover:text-white transition-colors cursor-pointer">
        <Filter size={16} />
        Filters
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-4 mt-3 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-white/70">Filter Jobs</h4>
              <button onClick={onToggle} className="text-white/40 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Min Match %</label>
                <input
                  type="range" min={0} max={100} value={filters.minMatch || 0}
                  onChange={e => update('minMatch', parseInt(e.target.value))}
                  className="w-full accent-[#00d4ff]"
                />
                <span className="text-xs text-white/50">{filters.minMatch || 0}%</span>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Remote Only</label>
                <button
                  onClick={() => update('remoteOnly', !filters.remoteOnly)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${filters.remoteOnly ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30' : 'glass text-white/50'}`}
                >
                  {filters.remoteOnly ? 'Yes' : 'No'}
                </button>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Source</label>
                <select
                  value={filters.source || ''}
                  onChange={e => update('source', e.target.value)}
                  className="w-full glass rounded-lg px-3 py-1.5 bg-transparent text-xs text-white/70 outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#0c0a24]">All</option>
                  <option value="JSearch" className="bg-[#0c0a24]">JSearch</option>
                  <option value="Adzuna" className="bg-[#0c0a24]">Adzuna</option>
                  <option value="Internshala" className="bg-[#0c0a24]">Internshala</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Sort By</label>
                <select
                  value={filters.sortBy || 'score'}
                  onChange={e => update('sortBy', e.target.value)}
                  className="w-full glass rounded-lg px-3 py-1.5 bg-transparent text-xs text-white/70 outline-none cursor-pointer"
                >
                  <option value="score" className="bg-[#0c0a24]">Match Score</option>
                  <option value="salary" className="bg-[#0c0a24]">Salary</option>
                  <option value="date" className="bg-[#0c0a24]">Date Posted</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
