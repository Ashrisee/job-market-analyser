import { TECH_STRIP_ITEMS } from '../../utils/constants';

export default function TechStrip() {
  const items = [...TECH_STRIP_ITEMS, ...TECH_STRIP_ITEMS];

  return (
    <section style={{ padding: '3rem 0', overflow: 'hidden', position: 'relative' }}>
      {/* Fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8rem', background: 'linear-gradient(to right, #03010a, transparent)', zIndex: 10 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '8rem', background: 'linear-gradient(to left, #03010a, transparent)', zIndex: 10 }} />

      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="glass"
            style={{
              display: 'inline-flex', alignItems: 'center', margin: '0 0.75rem',
              padding: '0.6rem 1.25rem', borderRadius: '999px',
              fontSize: '0.8rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)',
              cursor: 'default', transition: 'all 0.3s',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00d4ff', marginRight: '0.5rem', opacity: 0.5 }} />
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
