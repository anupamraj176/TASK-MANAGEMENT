import { useState, useEffect, useRef } from 'react';

const NAV_LINKS = [
  { label: 'Features',    href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Gamification', href: '#gamification' },
  { label: 'Team',        href: '#team' },
];

function AuthDropdown({ label, color, links, isOpen, onToggle }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onToggle(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onToggle]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => onToggle(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 18px',
          background: isOpen ? color : 'transparent',
          color: isOpen ? '#fff' : color,
          border: `2px solid ${color}`,
          borderRadius: 10,
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          if (!isOpen) {
            e.currentTarget.style.background = color + '18';
          }
        }}
        onMouseLeave={e => {
          if (!isOpen) e.currentTarget.style.background = 'transparent';
        }}
      >
        {label}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#fff',
          border: '1px solid var(--pebble)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(26,26,46,0.12)',
          overflow: 'hidden',
          minWidth: 160,
          animation: 'fade-in-up 0.2s ease',
          zIndex: 100,
        }}>
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px',
                color: 'var(--midnight)',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--cloud)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 7,
                background: color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userDropOpen, setUserDrop]   = useState(false);
  const [adminDropOpen, setAdminDrop] = useState(false);
  const [activeSection, setActive]    = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const userLinks = [
    { label: 'Log In',   href: '/user/login',  icon: '🔑' },
    { label: 'Sign Up',  href: '/user/signup', icon: '✨' },
  ];
  const adminLinks = [
    { label: 'Admin Login',  href: '/admin/login',  icon: '🛡️' },
    { label: 'Admin Sign Up', href: '/admin/signup', icon: '⚙️' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--nav-height)',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled
        ? 'rgba(255,255,255,0.92)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--pebble)' : 'none',
      boxShadow: scrolled ? '0 2px 24px rgba(26,26,46,0.06)' : 'none',
    }}>
      <div className="container" style={{
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          textDecoration: 'none',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--iris), var(--midnight))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 4px 12px rgba(92,106,196,0.35)',
          }}>
            ✓
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800, fontSize: 20,
            color: 'var(--midnight)',
            letterSpacing: '-0.5px',
          }}>
            Task<span style={{ color: 'var(--iris)' }}>Flow</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <div style={{
          display: 'flex', gap: 4,
          '@media(max-width:768px)': { display: 'none' },
        }} className="nav-links">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                padding: '6px 14px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500, fontSize: 14,
                color: 'var(--midnight)',
                textDecoration: 'none',
                borderRadius: 8,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--mist)';
                e.currentTarget.style.color = 'var(--iris)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--midnight)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <AuthDropdown
            label="User"
            color="var(--iris)"
            links={userLinks}
            isOpen={userDropOpen}
            onToggle={v => { setUserDrop(v); if (v) setAdminDrop(false); }}
          />
          <AuthDropdown
            label="Admin"
            color="var(--midnight)"
            links={adminLinks}
            isOpen={adminDropOpen}
            onToggle={v => { setAdminDrop(v); if (v) setUserDrop(false); }}
          />
        </div>

      </div>

      {/* Mobile nav (hidden by default, toggled via mobileOpen) */}
      {mobileOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid var(--pebble)',
          padding: '16px 24px',
        }}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} style={{
              display: 'block', padding: '12px 0',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 15,
              color: 'var(--midnight)', textDecoration: 'none',
              borderBottom: '1px solid var(--cloud)',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}