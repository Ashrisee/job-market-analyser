import { motion } from 'framer-motion';

export default function DashboardLayout({ children, profile }) {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-black tracking-tight">
            Your <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            {profile?.preferred_role ? `Analyzing market for "${profile.preferred_role}"` : 'Personalized job market intelligence'}
            {profile?.skills?.length ? ` · ${profile.skills.length} skills tracked` : ''}
          </p>
        </motion.div>

        {children}
      </div>
    </div>
  );
}
