import { useEffect, useRef } from 'react';

// Import all SVGs — Vite resolves these as URLs
import doodle       from '../../assets/task_management_doodle.svg';
import clipboard    from '../../assets/01-clipboard.svg';
import pomodoroSvg  from '../../assets/02-pomodoro-timer.svg';
import trophy       from '../../assets/03-trophy.svg';
import rocket       from '../../assets/04-rocket.svg';
import brainBulb    from '../../assets/05-brain-bulb.svg';
import progressRings from '../../assets/06-progress-rings.svg';
import fireStreak   from '../../assets/08-fire-streak.svg';
import celebration  from '../../assets/12-celebration-burst.svg';

/* ── tiny animated stat badge ── */
function StatBadge({ icon, value, label, color, style }) {
  return (
    <div style={{
      position: 'absolute',
      background: '#fff',
      borderRadius: 14,
      padding: '10px 14px',
      boxShadow: '0 8px 28px rgba(26,26,46,0.13)',
      display: 'flex', alignItems: 'center', gap: 8,
      border: `1.5px solid ${color}30`,
      ...style,
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
          color: 'var(--midnight)', lineHeight: 1,
        }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

/* ── floating icon ── */
function FloatIcon({ src, size = 56, style, delay = '0s', duration = '4s' }) {
  return (
    <img
      src={src} alt=""
      style={{
        width: size, height: size,
        position: 'absolute',
        animation: `float ${duration} ease-in-out ${delay} infinite`,
        filter: 'drop-shadow(0 8px 16px rgba(92,106,196,0.2))',
        ...style,
      }}
    />
  );
}

export default function Hero() {
  const textRef   = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    // stagger animate text children
    const children = textRef.current?.children;
    if (!children) return;
    Array.from(children).forEach((el, i) => {
      el.style.animation = `fade-in-up 0.7s ease ${i * 0.12}s both`;
    });

    // visual side
    if (visualRef.current) {
      visualRef.current.style.animation = 'slide-in-left 0.9s ease 0.3s both';
    }
  }, []);

  return (
    <section style={{
      height: '100vh',
      paddingTop: 'calc(var(--nav-height))',
      background: `
        radial-gradient(ellipse 80% 60% at 60% 0%, #EEF0FB 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 90% 80%, #E8EBFA 0%, transparent 50%),
        var(--white)
      `,
      overflow: 'hidden',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        alignItems: 'center',
        minHeight: 'calc(100vh - var(--nav-height) - 80px)',
      }}>

        {/* ── Left: Text ──────────────────────────────── */}
        <div ref={textRef}>

          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--mist)', borderRadius: 100,
            padding: '6px 16px 6px 8px',
            marginBottom: 24,
            border: '1px solid var(--iris)30',
          }}>
            <span style={{
              background: 'var(--iris)', borderRadius: '50%',
              width: 6, height: 6, display: 'inline-block',
              boxShadow: '0 0 0 3px var(--iris)40',
              animation: 'ping 1.5s ease infinite',
            }}/>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
            color: 'var(--midnight)',
            marginBottom: 20,
          }}>
            Your Team's{' '}
            <span style={{
              backgroundImage: 'linear-gradient(120deg, var(--iris), #7B89D4, var(--iris))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite',
            }}>
              Productivity
            </span>{' '}
            <br/>Supercharged.
          </h1>

          {/* Sub */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 18, lineHeight: 1.7,
            color: 'var(--slate)',
            maxWidth: 460,
            marginBottom: 36,
          }}>
            TaskFlow turns scattered tasks into laser-focused workflows.
            Track progress, build streaks, and celebrate wins—together.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
            <a
              href="/signup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px',
                background: 'var(--iris)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 12,
                fontFamily: 'var(--font-display)',
                fontWeight: 700, fontSize: 15,
                boxShadow: '0 8px 24px rgba(92,106,196,0.4)',
                transition: 'all 0.2s ease',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(92,106,196,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(92,106,196,0.4)';
              }}
            >
              <span>🚀</span> Get Started Free
            </a>
          </div>

          {/* Social proof avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['🧑‍💻','👩‍🎨','👨‍🔬','👩‍💼','🧑‍🚀'].map((em, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: `hsl(${220 + i * 25}, 60%, 88%)`,
                  border: '2.5px solid #fff',
                  marginLeft: i === 0 ? 0 : -10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, zIndex: 5 - i,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}>{em}</div>
              ))}
            </div>
            <div>
              <div style={{
                display: 'flex', gap: 2, marginBottom: 2,
              }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: '#F59E0B', fontSize: 13 }}>★</span>
                ))}
              </div>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--slate)',
              }}>
                Loved by <strong style={{ color: 'var(--midnight)' }}>2,400+</strong> teams
              </span>
            </div>
          </div>

        </div>

        {/* ── Right: Visual ────────────────────────────── */}
        <div ref={visualRef} style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 520,
        }}>

          {/* Background blob */}
          <div style={{
            position: 'absolute',
            width: 420, height: 420,
            background: 'radial-gradient(circle, var(--mist) 0%, transparent 70%)',
            borderRadius: '50%',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0,
          }}/>

          {/* Main doodle */}
          <img
            src={doodle} alt="Task management illustration"
            style={{
              width: '100%', maxWidth: 480,
              position: 'relative', zIndex: 1,
              animation: 'float-slow 6s ease-in-out infinite',
              filter: 'drop-shadow(0 20px 40px rgba(92,106,196,0.15))',
            }}
          />

          {/* Floating icons */}
          <FloatIcon src={rocket}    size={64}  delay="0s"    duration="4.5s" style={{ top: '4%',  right: '-5%'  }} />
          <FloatIcon src={trophy}    size={56}  delay="0.8s"  duration="5s"   style={{ top: '12%', left: '0%'  }} />
          <FloatIcon src={fireStreak} size={52} delay="1.6s"  duration="3.8s" style={{ bottom: '10%', right: '0%' }} />
          <FloatIcon src={brainBulb} size={50}  delay="2.4s"  duration="5.2s" style={{ bottom: '20%',  left: '-5%' }} />
          <FloatIcon src={celebration} size={44} delay="3s"   duration="4s"   style={{ top: '40%', right: '2%' }} />

          {/* Stat badges */}
          <StatBadge
            icon="✅" value="1,240" label="Tasks done today"
            color="var(--leaf)"
            style={{
              top: '0%', right: '8%',
              animation: 'bounce-in 0.6s ease 0.8s both',
            }}
          />
          <StatBadge
            icon="🔥" value="12 days" label="Longest streak"
            color="var(--amber)"
            style={{
              bottom: '6%', left: '0%',
              animation: 'bounce-in 0.6s ease 1.2s both',
            }}
          />
          <StatBadge
            icon="🏆" value="Level 8" label="Your team rank"
            color="var(--iris)"
            style={{
              bottom: '28%', right: '-2%',
              animation: 'bounce-in 0.6s ease 1.6s both',
            }}
          />
        </div>
      </div>



      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
