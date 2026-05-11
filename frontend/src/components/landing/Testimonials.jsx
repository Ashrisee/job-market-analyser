import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  { name: 'Arjun Patel', role: 'Full Stack Developer', text: 'CareerScope showed me exactly which skills I was missing. Got my first offer within 3 weeks!', avatar: 'AP' },
  { name: 'Priya Sharma', role: 'Data Scientist', text: 'The salary analytics alone saved me from undervaluing myself by 40%. Incredible tool.', avatar: 'PS' },
  { name: 'Rahul Verma', role: 'DevOps Engineer', text: 'I\'ve never seen a job platform this beautiful AND functional. The skill gap analysis is spot-on.', avatar: 'RV' },
  { name: 'Sneha Kulkarni', role: 'ML Engineer', text: 'The AI insights recommended projects that directly helped me ace my interviews. Game changer.', avatar: 'SK' },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ padding: '6rem 0', overflow: 'hidden' }}>
      <div className="container-lg" style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Testimonials</span>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, marginTop: '0.75rem', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
          What Developers Say
        </h2>

        <div style={{ position: 'relative', minHeight: '280px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="glass-strong"
              style={{ borderRadius: '1.25rem', padding: '3rem' }}
            >
              <Quote size={32} style={{ color: 'rgba(168,85,247,0.3)', margin: '0 auto 1.25rem' }} />
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                &ldquo;{testimonials[current].text}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700,
                }}>
                  {testimonials[current].avatar}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{testimonials[current].name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? '1.5rem' : '0.5rem',
                height: '0.5rem',
                borderRadius: '999px',
                background: i === current ? '#a855f7' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
