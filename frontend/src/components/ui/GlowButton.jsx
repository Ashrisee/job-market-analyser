import { motion } from 'framer-motion';

export default function GlowButton({ children, onClick, className = '', variant = 'primary', size = 'md', disabled = false }) {
  const base = 'relative font-semibold rounded-xl transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2 overflow-hidden';
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  const variants = {
    primary: 'bg-gradient-to-r from-[#00d4ff] to-[#a855f7] text-white hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]',
    secondary: 'glass text-white hover:bg-white/10',
    ghost: 'bg-transparent text-[#00d4ff] hover:bg-white/5',
  };

  return (
    <motion.button
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      {/* Shimmer overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
