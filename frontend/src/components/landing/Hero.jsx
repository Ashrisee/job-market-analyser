import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import GlowButton from '../ui/GlowButton';

const TYPED_STRINGS = [
  'Find Where Your Skills Actually Matter.',
  'Decode the Job Market with AI.',
  'Land Your Dream Role, Faster.',
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = TYPED_STRINGS[textIndex];
    let timeout;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), 50);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), 30);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex(i => (i + 1) % TYPED_STRINGS.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  const scrollToForm = () => {
    document.getElementById('profile-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Blobs */}
      <div className="blob blob-blue w-[600px] h-[600px] -top-40 -left-40 animate-float" />
      <div className="blob blob-purple w-[500px] h-[500px] top-1/3 -right-32 animate-float" style={{ animationDelay: '2s' }} />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#03010a_70%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 container-lg text-center py-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm text-white/70 mb-10"
        >
          <Sparkles size={14} className="text-[#00d4ff]" />
          <span>AI-Powered Job Intelligence Platform</span>
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] mb-6 font-black tracking-tight"
        >
          <span className="text-gradient">{TYPED_STRINGS[textIndex].substring(0, charIndex)}</span>
          <span className="inline-block w-[3px] h-[0.8em] bg-[#00d4ff] ml-1 align-middle animate-pulse" />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-white/40 max-w-[600px] mx-auto mb-12 leading-relaxed"
        >
          Real-time job scraping, AI-powered skill matching, salary analytics, and career insights — all in one premium dashboard.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <GlowButton size="lg" onClick={scrollToForm}>
            <Sparkles size={18} />
            Start Analyzing
          </GlowButton>
          <GlowButton variant="secondary" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            See Features
          </GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/20"
          >
            <ArrowDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
