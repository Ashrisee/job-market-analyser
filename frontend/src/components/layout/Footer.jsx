import { Sparkles, Globe, MessageCircle, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="container-xl py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#a855f7] flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-[1.1rem] font-bold text-white">CareerScope <span className="text-[#00d4ff]">AI</span></span>
            </div>
            <p className="text-white/40 text-sm max-w-[400px] leading-relaxed">
              Decode the job market with AI-powered intelligence. Find where your skills actually matter. Built with real-time data scraping, analytics, and intelligent matching.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[0.75rem] font-semibold text-white/80 mb-4 uppercase tracking-[0.1em]">Platform</h4>
            <ul className="list-none p-0 flex flex-col gap-2 text-sm text-white/40">
              <li>Job Match Engine</li>
              <li>Salary Analytics</li>
              <li>Skill Gap Analysis</li>
              <li>Market Trends</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-[0.75rem] font-semibold text-white/80 mb-4 uppercase tracking-[0.1em]">Tech Stack</h4>
            <ul className="list-none p-0 flex flex-col gap-2 text-sm text-white/40">
              <li>React + Vite</li>
              <li>Python Flask</li>
              <li>JSearch & Adzuna APIs</li>
              <li>Recharts & Framer Motion</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © 2026 CareerScope AI. Built as a portfolio project.
          </p>
          <div className="flex items-center gap-3">
            {[Globe, MessageCircle, Users].map((Icon, i) => (
              <button key={i} className="w-8 h-8 rounded-lg bg-white/5 border-0 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                <Icon size={14} className="text-white/50" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
