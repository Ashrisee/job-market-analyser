import { motion } from 'framer-motion';

export default function AIAnimation() {
  const rings = [1, 2, 3, 4];

  return (
    <section style={{ padding: '6rem 0', overflow: 'hidden' }}>
      <div className="container-xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem' }}>

        {/* Two column layout */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem', width: '100%' }}>
          {/* AI Visual */}
          <div style={{ position: 'relative', width: '280px', height: '280px', flexShrink: 0, margin: '0 auto' }}>
            {/* Center orb */}
            <div style={{
              position: 'absolute', top: '25%', left: '25%', right: '25%', bottom: '25%',
              borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              opacity: 0.8, filter: 'blur(2px)',
            }} />
            <div style={{
              position: 'absolute', top: '25%', left: '25%', right: '25%', bottom: '25%',
              borderRadius: '50%', background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>AI</span>
            </div>

            {/* Orbiting rings */}
            {rings.map((r) => (
              <motion.div
                key={r}
                style={{
                  position: 'absolute', inset: `${r * 10}px`,
                  borderRadius: '50%', border: '1px solid rgba(0,212,255,0.1)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10 + r * 5, repeat: Infinity, ease: 'linear' }}
              >
                <div style={{
                  position: 'absolute', width: '8px', height: '8px', borderRadius: '50%',
                  background: '#00d4ff', top: 0, left: '50%', transform: 'translate(-50%, -50%)',
                }} />
              </motion.div>
            ))}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: '300px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>AI-Powered</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, marginTop: '0.75rem', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              Intelligence That <span className="text-gradient">Actually Helps</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '500px' }}>
              Our engine scrapes real-time job data, cross-references your skills, analyzes market trends, and generates personalized career insights — all in seconds.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {['Real-Time Scraping', 'Smart Matching', 'Career Roadmaps', 'Salary Insights'].map(tag => (
                <span key={tag} className="glass" style={{ padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
