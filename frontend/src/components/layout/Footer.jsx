const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Support: ['Help Center', 'Community', 'Status', 'Contact'],
  Legal:   ['Privacy', 'Terms', 'Cookies', 'Security'],
};

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--midnight)',
      color: 'rgba(255,255,255,0.7)',
      padding: '64px 0 32px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: 40,
          paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexWrap: 'wrap',
        }}>

          {/* Brand */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg, var(--iris), #3A3A7A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17,
              }}>✓</div>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18,
                color: '#fff',
              }}>Task<span style={{ color: 'var(--iris-light)' }}>Flow</span></span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: 240, marginBottom: 24,
            }}>
              The productivity platform that makes your team actually love getting things done.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: 10 }}>
              {['𝕏', 'in', 'f', '📧'].map(s => (
                <div key={s} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                >{s}</div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 16,
              }}>{category}</h4>
              {links.map(link => (
                <a key={link} href="#" style={{
                  display: 'block', marginBottom: 10,
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >{link}</a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.3)',
          }}>
            © 2025 TaskFlow. Made with ❤️ for productive people.
          </span>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--leaf)',
              animation: 'ping 2s ease infinite',
            }}/>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.3)',
            }}>All systems operational</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}