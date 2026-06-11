import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SKILLS_LIST } from '../../utils/constants';

export default function SkillInput({ selected = [], onChange }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const filtered = SKILLS_LIST.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !selected.includes(s)
  ).slice(0, 8);

  const addSkill = (skill) => {
    if (!selected.includes(skill)) {
      onChange([...selected, skill]);
    }
    setInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeSkill = (skill) => {
    onChange(selected.filter(s => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const match = filtered[0];
      addSkill(match || input.trim());
    }
    if (e.key === 'Backspace' && !input && selected.length) {
      removeSkill(selected[selected.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="glass rounded-xl p-3 flex flex-wrap gap-2 min-h-[52px] focus-within:ring-1 focus-within:ring-[#00d4ff]/30 transition-all">
        <AnimatePresence>
          {selected.map(skill => (
            <motion.span
              key={skill}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00d4ff]/10 to-[#a855f7]/10 border border-[#00d4ff]/20 text-sm font-medium text-[#00d4ff]"
            >
              {skill}
              <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors cursor-pointer">
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length ? 'Add more...' : 'Type a skill (e.g., React, Python)'}
          className="flex-1 min-w-[150px] bg-transparent text-white/80 text-sm outline-none placeholder:text-white/20"
        />
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && input && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0c0a24]/95 border border-[#00d4ff]/20 backdrop-blur-xl rounded-xl overflow-hidden z-50 shadow-2xl"
          >
            {filtered.map(skill => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                {skill}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
