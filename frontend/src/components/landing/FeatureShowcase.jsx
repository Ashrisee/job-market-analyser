import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Zap, TrendingUp, BarChart3, Activity, Brain } from 'lucide-react';
import { FEATURES } from '../../utils/constants';

const iconMap = { Target, Zap, TrendingUp, BarChart3, Activity, Brain };

export default function FeatureShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
      <div className="container-xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Features</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            Everything You Need to <span className="text-gradient">Win the Job Market</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '1rem', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Powered by real-time data scraping and intelligent analysis
          </p>
        </motion.div>

        {/* Feature grid */}
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass"
                style={{
                  borderRadius: '1rem',
                  padding: '2rem',
                  cursor: 'default',
                  transition: 'background 0.4s',
                }}
              >
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <Icon size={22} style={{ color: '#00d4ff' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
