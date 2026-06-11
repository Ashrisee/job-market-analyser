import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, MapPin, Briefcase, DollarSign, Wifi, Code, Search } from 'lucide-react';
import SkillInput from './SkillInput';
import GlowButton from '../ui/GlowButton';
import { EXPERIENCE_LEVELS, WORK_MODES, POPULAR_LOCATIONS } from '../../utils/constants';

export default function ProfileForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    skills: [],
    location: '',
    experience_level: 'fresher',
    expected_salary: '',
    work_mode: 'remote',
    tech_stack: [],
    preferred_role: '',
  });

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.skills.length && !form.preferred_role) return;
    setLoading(true);
    // Navigate directly — the dashboard will fetch data itself (with mock fallback)
    try {
      navigate('/dashboard', { state: { profile: form } });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="profile-form" className="py-24">
      <div className="container-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[0.8rem] font-semibold text-[#00d4ff] uppercase tracking-[0.15em]">Get Started</span>
          <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black mt-3 tracking-tight">
            Tell Us About <span className="text-gradient">You</span>
          </h2>
          <p className="text-white/40 mt-3 text-[0.95rem]">No sign-up needed. Enter your details and get instant insights.</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-strong glow-blue rounded-3xl p-10"
        >
          {/* Form Fields */}
          <div className="flex flex-col gap-7">

            {/* Skills */}
            <div className="relative z-50">
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                <Code size={16} className="text-[#00d4ff]" />
                Your Skills
              </label>
              <SkillInput selected={form.skills} onChange={v => update('skills', v)} />
            </div>

            {/* Preferred Role */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                <Search size={16} className="text-[#a855f7]" />
                Preferred Role
              </label>
              <input
                value={form.preferred_role}
                onChange={e => update('preferred_role', e.target.value)}
                placeholder="e.g., Full Stack Developer, Data Scientist, ML Engineer"
                className="w-full rounded-xl px-4 py-3 bg-white/[0.04] border border-white/10 text-white/80 text-sm outline-none focus:border-[#00d4ff]/30 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Location + Salary row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                  <MapPin size={16} className="text-[#10b981]" />
                  Preferred Location
                </label>
                <select
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white/[0.04] border border-white/10 text-white/80 text-sm outline-none focus:border-[#00d4ff]/30 focus:bg-white/[0.06] transition-all cursor-pointer appearance-none"
                >
                  <option value="" className="bg-[#0c0a24]">Any Location</option>
                  {POPULAR_LOCATIONS.map(loc => (
                    <option key={loc} value={loc} className="bg-[#0c0a24]">{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                  <DollarSign size={16} className="text-[#f59e0b]" />
                  Expected Salary (Annual)
                </label>
                <input
                  type="number"
                  value={form.expected_salary}
                  onChange={e => update('expected_salary', parseInt(e.target.value) || '')}
                  placeholder="e.g., 800000"
                  className="w-full rounded-xl px-4 py-3 bg-white/[0.04] border border-white/10 text-white/80 text-sm outline-none focus:border-[#00d4ff]/30 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                <Briefcase size={16} className="text-[#ec4899]" />
                Experience Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EXPERIENCE_LEVELS.map(level => {
                  const isSelected = form.experience_level === level.value;
                  return (
                    <button
                      key={level.value}
                      onClick={() => update('experience_level', level.value)}
                      className={`px-4 py-3.5 rounded-xl text-center text-xs font-medium cursor-pointer transition-all duration-300 border ${
                        isSelected
                          ? 'border-[#00d4ff]/30 bg-gradient-to-r from-[#00d4ff]/15 to-[#a855f7]/15 text-white'
                          : 'border-transparent glass text-white/50 hover:text-white/75 hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="text-[1.1rem] block mb-1">{level.icon}</span>
                      {level.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-3">
                <Wifi size={16} className="text-[#00d4ff]" />
                Work Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {WORK_MODES.map(mode => {
                  const isSelected = form.work_mode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => update('work_mode', mode.value)}
                      className={`px-4 py-3.5 rounded-xl text-center text-xs font-medium cursor-pointer transition-all duration-300 border ${
                        isSelected
                          ? 'border-[#00d4ff]/30 bg-gradient-to-r from-[#00d4ff]/15 to-[#a855f7]/15 text-white'
                          : 'border-transparent glass text-white/50 hover:text-white/75 hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="text-[1.1rem] block mb-1">{mode.icon}</span>
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <GlowButton
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={loading || (!form.skills.length && !form.preferred_role)}
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <Rocket size={18} />
                    Launch Dashboard
                  </>
                )}
              </GlowButton>
              {!form.skills.length && !form.preferred_role && (
                <p className="text-xs text-white/30 text-center mt-3">Add at least one skill or preferred role to continue</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
