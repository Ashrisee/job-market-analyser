import { Sparkles, Globe, MessageCircle, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '6rem' }}>
      <div className="container-xl" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={16} style={{ color: 'white' }} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>CareerScope <span style={{ color: '#00d4ff' }}>AI</span></span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', maxWidth: '400px', lineHeight: 1.6 }}>
              Decode the job market with AI-powered intelligence. Find where your skills actually matter. Built with real-time data scraping, analytics, and intelligent matching.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
              <li>Job Match Engine</li>
              <li>Salary Analytics</li>
              <li>Skill Gap Analysis</li>
              <li>Market Trends</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tech Stack</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
              <li>React + Vite</li>
              <li>Python Flask</li>
              <li>JSearch & Adzuna APIs</li>
              <li>Recharts & Framer Motion</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
            © 2026 CareerScope AI. Built as a portfolio project.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {[Globe, MessageCircle, Users].map((Icon, i) => (
              <button key={i} style={{
                width: '2rem', height: '2rem', borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.05)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.3s',
              }}>
                <Icon size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
