import { useReveal } from '../../hooks/useReveal';
import clipboard  from '../../assets/01-clipboard.svg';
import rocket     from '../../assets/04-rocket.svg';
import celebration from '../../assets/12-celebration-burst.svg';

const STEPS = [
  {
    number: '01',
    icon: clipboard,
    title: 'Add Your Tasks',
    desc: 'Dump everything out of your head. Type, paste, or dictate — TaskFlow captures it all and organises into projects automatically.',
    color: 'var(--iris)',
    bg: 'var(--mist)',
  },
  {
    number: '02',
    icon: rocket,
    title: 'Focus & Execute',
    desc: 'The AI surfaces your top 3 priorities each morning. Use the Pomodoro timer to sprint through them without distractions.',
    color: 'var(--coral)',
    bg: '#FEF2F2',
  },
  {
    number: '03',
    icon: celebration,
    title: 'Celebrate Progress',
    desc: 'Every completed task feeds your streak, earns badges, and moves your team up the leaderboard. Progress is its own reward.',
    color: 'var(--leaf)',
    bg: '#F0FDF4',
  },
];

function Step({ step, index, isLast }) {
  const ref = useReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      {/* Card */}
      <div style={{
        background: '#fff',
        border: '1.5px solid var(--pebble)',
        borderRadius: 24,
        padding: 36,
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}>
        {/* Step number watermark */}
        <div style={{
          position: 'absolute', top: -10, right: 16,
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 96, lineHeight: 1,
          color: step.color + '08',
          userSelect: 'none', pointerEvents: 'none',
        }}>{step.number}</div>

        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: step.bg,
          border: `1.5px solid ${step.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <img src={step.icon} alt={step.title} style={{ width: 48, height: 48, objectFit: 'contain' }} />
        </div>

        {/* Number pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: '50%',
          background: step.color, color: '#fff',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
          marginBottom: 14,
        }}>{index + 1}</div>

        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20,
          color: 'var(--midnight)', marginBottom: 12,
        }}>{step.title}</h3>

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7,
          color: 'var(--slate)',
        }}>{step.desc}</p>
      </div>

      {/* Connector arrow (not for last) */}
      {!isLast && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: 'var(--pebble)',
          marginTop: 16,
          '@media(min-width:900px)': { display: 'none' },
        }}>↓</div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  const headerRef = useReveal();

  return (
    <section id="how-it-works" style={{
      background: '#fff',
      padding: '100px 0',
    }}>
      <div className="container">

        {/* Header */}
        <div
          ref={headerRef}
          className="reveal"
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <span style={{
            display: 'inline-block',
            background: 'var(--mist)', color: 'var(--iris)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 100,
            border: '1px solid var(--iris)30',
            marginBottom: 16,
          }}>Simple Process</span>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800, letterSpacing: '-1px',
            color: 'var(--midnight)', marginBottom: 14,
          }}>
            From chaos to clarity<br/>
            <span style={{ color: 'var(--iris)' }}>in three steps.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--slate)',
            maxWidth: 460, margin: '0 auto', lineHeight: 1.7,
          }}>
            No 30-page onboarding guide needed. You'll be running in under 5 minutes.
          </p>
        </div>

        {/* Steps grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'stretch',
        }}>
          {STEPS.map((step, i) => (
            <Step key={step.number} step={step} index={i} isLast={i === STEPS.length - 1} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="reveal"
          style={{
            marginTop: 60,
            background: 'linear-gradient(135deg, var(--midnight) 0%, #2d2d5e 100%)',
            borderRadius: 24,
            padding: '40px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
              color: '#fff', marginBottom: 6,
            }}>Ready to get things done?</h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.6)',
            }}>Start free. No credit card required.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px',
              background: 'var(--iris)',
              color: '#fff', textDecoration: 'none',
              borderRadius: 10,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--iris-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--iris)'}
            >
              👤 User Sign Up
            </a>
            <a href="/signup/admin" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px',
              background: 'transparent',
              color: '#fff', textDecoration: 'none',
              borderRadius: 10,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              border: '1.5px solid rgba(255,255,255,0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              🛡️ Admin Sign Up
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
