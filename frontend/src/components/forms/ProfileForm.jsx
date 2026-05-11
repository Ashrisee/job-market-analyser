import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, MapPin, Briefcase, DollarSign, Wifi, Code, Search } from 'lucide-react';
import SkillInput from './SkillInput';
import GlowButton from '../ui/GlowButton';
import { EXPERIENCE_LEVELS, WORK_MODES, POPULAR_LOCATIONS } from '../../utils/constants';
import { API } from '../../services/api';

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
    try {
      const keyword = form.preferred_role || form.skills.slice(0, 3).join(' ');
      await API.fetchJobs(keyword, form.location || 'India', 30);
      navigate('/dashboard', { state: { profile: form } });
    } catch (err) {
      console.error('Error:', err);
      navigate('/dashboard', { state: { profile: form } });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' };
  const inputStyle = { width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', outline: 'none' };

  return (
    <section id="profile-form" style={{ padding: '6rem 0' }}>
      <div className="container-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Get Started</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            Tell Us About <span className="text-gradient">You</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.75rem', fontSize: '0.95rem' }}>No sign-up needed. Enter your details and get instant insights.</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-strong glow-blue"
          style={{ borderRadius: '1.5rem', padding: '2.5rem' }}
        >
          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            {/* Skills */}
            <div>
              <label style={labelStyle}>
                <Code size={16} style={{ color: '#00d4ff' }} />
                Your Skills
              </label>
              <SkillInput selected={form.skills} onChange={v => update('skills', v)} />
            </div>

            {/* Preferred Role */}
            <div>
              <label style={labelStyle}>
                <Search size={16} style={{ color: '#a855f7' }} />
                Preferred Role
              </label>
              <input
                value={form.preferred_role}
                onChange={e => update('preferred_role', e.target.value)}
                placeholder="e.g., Full Stack Developer, Data Scientist, ML Engineer"
                style={inputStyle}
              />
            </div>

            {/* Location + Salary row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>
                  <MapPin size={16} style={{ color: '#10b981' }} />
                  Preferred Location
                </label>
                <select
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="" style={{ background: '#0c0a24' }}>Any Location</option>
                  {POPULAR_LOCATIONS.map(loc => (
                    <option key={loc} value={loc} style={{ background: '#0c0a24' }}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  <DollarSign size={16} style={{ color: '#f59e0b' }} />
                  Expected Salary (Annual)
                </label>
                <input
                  type="number"
                  value={form.expected_salary}
                  onChange={e => update('expected_salary', parseInt(e.target.value) || '')}
                  placeholder="e.g., 800000"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label style={labelStyle}>
                <Briefcase size={16} style={{ color: '#ec4899' }} />
                Experience Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => update('experience_level', level.value)}
                    className={form.experience_level === level.value ? '' : 'glass'}
                    style={{
                      padding: '0.875rem 0.5rem',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: form.experience_level === level.value ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                      background: form.experience_level === level.value ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15))' : undefined,
                      color: form.experience_level === level.value ? 'white' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>{level.icon}</span>
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <label style={labelStyle}>
                <Wifi size={16} style={{ color: '#00d4ff' }} />
                Work Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {WORK_MODES.map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => update('work_mode', mode.value)}
                    className={form.work_mode === mode.value ? '' : 'glass'}
                    style={{
                      padding: '0.875rem 0.5rem',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: form.work_mode === mode.value ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                      background: form.work_mode === mode.value ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15))' : undefined,
                      color: form.work_mode === mode.value ? 'white' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>{mode.icon}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div style={{ paddingTop: '0.75rem' }}>
              <GlowButton
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={loading || (!form.skills.length && !form.preferred_role)}
              >
                {loading ? (
                  <>
                    <span style={{ width: '1.25rem', height: '1.25rem', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
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
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '0.75rem' }}>Add at least one skill or preferred role to continue</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
