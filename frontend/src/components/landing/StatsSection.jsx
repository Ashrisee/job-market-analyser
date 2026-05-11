import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimatedCounter from '../ui/AnimatedCounter';

const stats = [
  { value: 100000, suffix: '+', label: 'Jobs Analyzed', color: '#00d4ff' },
  { value: 85, suffix: '+', label: 'Skills Tracked', color: '#a855f7' },
  { value: 500, suffix: '+', label: 'Companies', color: '#10b981' },
  { value: 94, suffix: '%', label: 'Match Accuracy', color: '#f59e0b' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="stats" style={{ padding: '5rem 0' }}>
      <div className="container-xl">
        <div ref={ref} className="glass-strong" style={{ borderRadius: '1.5rem', padding: '4rem 3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: stat.color, marginBottom: '0.5rem' }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
