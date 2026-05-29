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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container-xl h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-[1.1rem] font-bold tracking-tight">
            Career<span className="text-gradient">Scope</span>{' '}
            <span className="text-[0.7rem] font-medium px-1.5 py-0.5 rounded bg-white/10 text-[#00d4ff] ml-1">
              AI
            </span>
          </span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-white/60 bg-transparent border-0 cursor-pointer hover:text-white transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          {location.pathname !== '/dashboard' && (
            <motion.button
              onClick={() => scrollTo('profile-form')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#a855f7] text-white border-0 cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.2)]"
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,212,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Dashboard
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden bg-transparent border-0 text-white/80 cursor-pointer hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
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
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="py-4 px-6 flex flex-col gap-3">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="block w-full text-left text-white/70 py-2 bg-transparent border-0 cursor-pointer hover:text-white transition-colors"
                >
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
