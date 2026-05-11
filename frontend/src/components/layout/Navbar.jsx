import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (!isLanding) { navigate('/'); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { label: 'Features', id: 'features' },
    { label: 'Stats', id: 'stats' },
    { label: 'Get Started', id: 'profile-form' },
  ];

  return (
    <motion.nav
      className={scrolled ? 'glass-strong' : ''}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.5s',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container-xl" style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} style={{ color: 'white' }} />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Career<span className="text-gradient">Scope</span>{' '}
            <span style={{ fontSize: '0.7rem', fontWeight: 500, padding: '0.15rem 0.4rem', borderRadius: '0.3rem', background: 'rgba(255,255,255,0.1)', color: '#00d4ff' }}>AI</span>
          </span>
        </motion.div>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.3s' }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              {link.label}
            </button>
          ))}
          {location.pathname !== '/dashboard' && (
            <motion.button
              onClick={() => scrollTo('profile-form')}
              style={{
                padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600,
                borderRadius: '0.5rem', background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                color: 'white', border: 'none', cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,212,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Dashboard
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }} className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {links.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)} style={{ display: 'block', width: '100%', textAlign: 'left', color: 'rgba(255,255,255,0.7)', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
