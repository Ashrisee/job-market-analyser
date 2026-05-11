import { motion } from 'framer-motion';

export default function DashboardLayout({ children, profile }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '5rem', paddingBottom: '3rem' }}>
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
            Your <span className="text-gradient">Dashboard</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {profile?.preferred_role ? `Analyzing market for "${profile.preferred_role}"` : 'Personalized job market intelligence'}
            {profile?.skills?.length ? ` · ${profile.skills.length} skills tracked` : ''}
          </p>
        </motion.div>

        {children}
      </div>
    </div>
  );
}
