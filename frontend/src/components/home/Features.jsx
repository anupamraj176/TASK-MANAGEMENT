import { useRevealChildren } from '../../hooks/useReveal';

import clipboard    from '../../assets/01-clipboard.svg';
import pomodoro     from '../../assets/02-pomodoro-timer.svg';
import trophy       from '../../assets/03-trophy.svg';
import rocket       from '../../assets/04-rocket.svg';
import brainBulb    from '../../assets/05-brain-bulb.svg';
import progressRings from '../../assets/06-progress-rings.svg';
import barChart     from '../../assets/09-bar-chart.svg';
import thoughtBubble from '../../assets/11-thought-bubble.svg';

const FEATURES = [
  {
    icon: clipboard,
    title: 'Smart Task Board',
    desc: 'Organize tasks with drag-and-drop kanban boards. Tag, prioritize, and assign in seconds.',
    accent: 'var(--iris)',
    bg: 'var(--mist)',
  },
  {
    icon: pomodoro,
    title: 'Pomodoro Timer',
    desc: 'Built-in focus timer keeps you in the zone. Work in sprints, track deep-work hours.',
    accent: 'var(--coral)',
    bg: '#FEF2F2',
  },
  {
    icon: progressRings,
    title: 'Progress Rings',
    desc: 'Visual daily and weekly progress rings so you always know how close you are to done.',
    accent: 'var(--leaf)',
    bg: '#F0FDF4',
  },
  {
    icon: brainBulb,
    title: 'AI Prioritization',
    desc: 'Let our smart engine surface what matters most. No more decision paralysis.',
    accent: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: barChart,
    title: 'Productivity Analytics',
    desc: 'Rich charts break down your output by day, week, or project—spot patterns at a glance.',
    accent: 'var(--amber)',
    bg: '#FFFBEB',
  },
  {
    icon: thoughtBubble,
    title: 'Idea Capture',
    desc: 'Quick-capture shower thoughts before they vanish. Link ideas directly to tasks.',
    accent: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    icon: rocket,
    title: 'Goal Launcher',
    desc: 'Set OKRs, break them into milestones, and watch the rocket climb as you deliver.',
    accent: 'var(--iris)',
    bg: 'var(--mist)',
  },
  {
    icon: trophy,
    title: 'Achievement System',
    desc: 'Unlock badges and level up your profile as you hit targets. Work feels like winning.',
    accent: 'var(--amber)',
    bg: '#FFFBEB',
  },
];

function FeatureCard({ icon, title, desc, accent, bg }) {
  return (
    <div
      className="reveal"
      style={{
        background: '#fff',
        border: '1.5px solid var(--pebble)',
        borderRadius: 18,
        padding: 28,
        transition: 'all 0.3s ease',
        cursor: 'default',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 16px 48px ${accent}22`;
        e.currentTarget.style.borderColor = accent + '55';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--pebble)';
      }}
    >
      {/* Accent bar top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accent, opacity: 0,
        transition: 'opacity 0.3s',
      }} className="accent-bar"/>

      {/* Icon */}
      <div style={{
        width: 72, height: 72, borderRadius: 16,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        border: `1px solid ${accent}25`,
        transition: 'transform 0.3s ease',
      }}>
        <img src={icon} alt={title} style={{ width: 44, height: 44, objectFit: 'contain' }} />
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
        color: 'var(--midnight)', marginBottom: 8,
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.65,
        color: 'var(--slate)',
      }}>
        {desc}
      </p>

      <style>{`
        div:hover .accent-bar { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

export default function Features() {
  const gridRef = useRevealChildren(80);

  return (
    <section id="features" style={{
      background: 'var(--cloud)',
      padding: '100px 0',
    }}>
      <div className="container">

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--mist)', color: 'var(--iris)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '5px 14px', borderRadius: 100,
            border: '1px solid var(--iris)30',
            marginBottom: 16,
          }}>Everything You Need</span>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800, letterSpacing: '-1px',
            color: 'var(--midnight)', marginBottom: 16,
          }}>
            Built for real teams,<br/>
            <span style={{ color: 'var(--iris)' }}>not just managers.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--slate)',
            maxWidth: 520, margin: '0 auto', lineHeight: 1.7,
          }}>
            Every feature was designed with one question in mind:
            does this help my team actually ship more?
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

      </div>
    </section>
  );
}