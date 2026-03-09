import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';

// ─────────────────────────────────────────────────────────────
// STEP ILLUSTRATIONS  (pure CSS / SVG — no Three.js)
// ─────────────────────────────────────────────────────────────

/** Shared dot-grid background */
function DotGrid() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
      backgroundSize: '22px 22px',
    }} />
  );
}

/** Step -1  ·  Boot splash — TE logo + scan line */
function BootScene() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <DotGrid />

      {/* TE logo box with corner accents */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55 }}
        style={{ position: 'relative', marginBottom: '28px', zIndex: 1 }}
      >
        <div style={{
          width: '96px', height: '96px',
          border: '1px solid rgba(255,0,49,0.35)',
          borderRadius: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Corner accents */}
          {[
            { top: -2, left: -2,   borderTop: '2px solid var(--red)', borderLeft: '2px solid var(--red)' },
            { top: -2, right: -2,  borderTop: '2px solid var(--red)', borderRight: '2px solid var(--red)' },
            { bottom: -2, left: -2,  borderBottom: '2px solid var(--red)', borderLeft: '2px solid var(--red)' },
            { bottom: -2, right: -2, borderBottom: '2px solid var(--red)', borderRight: '2px solid var(--red)' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...s }} />
          ))}
          <span className="font-mono" style={{ fontSize: '34px', fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>TE</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >
        <div className="font-display font-bold" style={{ fontSize: '26px', letterSpacing: '-0.02em', color: '#fff' }}>
          TRAJECTORY <span style={{ color: 'rgba(255,255,255,0.25)' }}>ENGINE</span>
        </div>
        <div className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'var(--red)', marginTop: '8px', textTransform: 'uppercase' }}>
          v1.0 — initializing
        </div>
      </motion.div>

      {/* Repeating red scan line */}
      <motion.div
        initial={{ top: '-2px' }}
        animate={{ top: '102%' }}
        transition={{ duration: 2.2, ease: 'linear', repeat: Infinity, repeatDelay: 0.6 }}
        style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          backgroundColor: 'var(--red)',
          boxShadow: '0 0 14px 5px rgba(255,0,49,0.25)',
          zIndex: 2,
        }}
      />
    </div>
  );
}

/** Step 0  ·  Dashboard — animated trajectory score arc ring */
function DashboardScene() {
  const size = 190;
  const r = 74;
  const circ = 2 * Math.PI * r;
  const sweep = circ * 0.75;  // 270° arc
  const fill  = (73 / 100) * sweep;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', position: 'relative' }}>
      <DotGrid />

      <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'var(--red)', textTransform: 'uppercase', zIndex: 1 }}>
        Trajectory Score
      </span>

      {/* Arc ring */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-225deg)' }}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={10}
            strokeDasharray={`${sweep} ${circ}`} strokeLinecap="round"
          />
          {/* Fill */}
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="var(--red)" strokeWidth={10} strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${fill} ${circ}` }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span className="font-mono" style={{ fontSize: '46px', fontWeight: 700, color: '#fff', letterSpacing: '-2px', lineHeight: 1 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            73
          </motion.span>
          <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginTop: '2px' }}>/100</span>
        </div>
      </div>

      {/* Sub-stats */}
      <div style={{ display: 'flex', gap: '28px', zIndex: 1 }}>
        {[
          { label: 'ACADEMIC',    val: '90', color: 'rgba(255,255,255,0.85)' },
          { label: 'BEHAVIOR',   val: '48', color: 'var(--red)' },
          { label: 'SKILLS',      val: '73', color: 'rgba(255,255,255,0.45)' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div className="font-mono" style={{ fontSize: '8px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', marginTop: '3px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Step 1  ·  Feed — SVG peer node network */
function FeedScene() {
  const nodes = [
    { cx: 150, cy: 55,  label: 'YOU',  primary: true,  badge: 0  },
    { cx: 55,  cy: 175, label: 'SJ',   primary: false, badge: 2  },
    { cx: 245, cy: 175, label: 'TK',   primary: false, badge: 0  },
    { cx: 150, cy: 215, label: 'PR',   primary: false, badge: 1  },
  ];
  const edges = [[0,1],[0,2],[0,3],[1,3],[2,3]];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <DotGrid />

      <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px', zIndex: 1 }}>
        Peer Network
      </span>

      <svg width={300} height={268} style={{ zIndex: 1, overflow: 'visible' }}>
        {/* Edges */}
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].cx} y1={nodes[a].cy}
            x2={nodes[b].cx} y2={nodes[b].cy}
            stroke={a === 0 ? 'rgba(255,0,49,0.25)' : 'rgba(255,255,255,0.08)'}
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <motion.circle
              cx={n.cx} cy={n.cy}
              r={n.primary ? 28 : 22}
              fill={n.primary ? 'rgba(255,0,49,0.12)' : 'rgba(255,255,255,0.04)'}
              stroke={n.primary ? 'var(--red)' : 'rgba(255,255,255,0.14)'}
              strokeWidth={n.primary ? 1.5 : 1}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.1 + i * 0.1, stiffness: 200, damping: 18 }}
            />
            <text x={n.cx} y={n.cy + 4} textAnchor="middle"
              fontSize={n.primary ? 11 : 9}
              fill={n.primary ? '#fff' : 'rgba(255,255,255,0.55)'}
              fontFamily="monospace" fontWeight={700}
            >
              {n.label}
            </text>
            {n.badge > 0 && (
              <g>
                <circle cx={n.cx + (n.primary ? 21 : 16)} cy={n.cy - (n.primary ? 20 : 15)} r={8} fill="var(--red)" />
                <text x={n.cx + (n.primary ? 21 : 16)} y={n.cy - (n.primary ? 20 : 15) + 4}
                  textAnchor="middle" fontSize={8} fill="#fff" fontFamily="monospace" fontWeight={700}>
                  {n.badge}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Step 2  ·  Analytics — terminal score breakdown bars */
function AnalyticsScene() {
  const bars = [
    { label: 'ACADEMIC',   val: 90, color: 'rgba(255,255,255,0.8)' },
    { label: 'BEHAVIORAL', val: 48, color: 'var(--red)' },
    { label: 'SKILLS',     val: 73, color: 'rgba(255,255,255,0.45)' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', position: 'relative' }}>
      <DotGrid />

      <div style={{
        width: '100%', maxWidth: '280px',
        backgroundColor: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px', padding: '20px 22px',
        zIndex: 1,
      }}>
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '20px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--red)' }} />
          <span className="font-mono" style={{ fontSize: '9px', color: 'var(--red)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Score Breakdown
          </span>
        </div>

        {bars.map((b, i) => (
          <div key={b.label} style={{ marginBottom: i < bars.length - 1 ? '16px' : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{b.label}</span>
              <span className="font-mono" style={{ fontSize: '10px', color: b.color, fontWeight: 700 }}>{b.val}</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', backgroundColor: b.color, borderRadius: '2px' }}
                initial={{ width: '0%' }}
                animate={{ width: `${b.val}%` }}
                transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}

        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em', lineHeight: 1.5, display: 'block' }}>
            AI REC: Behavioral is your biggest lever. +12 pts achievable.
          </span>
        </div>
      </div>
    </div>
  );
}

/** Step 3  ·  Profile — hex badge + 30-day streak heatmap */
function ProfileScene() {
  const cells = Array.from({ length: 30 }, (_, i) => {
    const t = i < 8 ? 0.06 + i * 0.04 : i < 20 ? 0.22 + (i - 8) * 0.055 : 0.88 + (i - 20) * 0.024;
    return Math.min(t, 1);
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', position: 'relative' }}>
      <DotGrid />

      {/* Hex badge */}
      <div style={{ zIndex: 1, textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', margin: '0 auto',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <span style={{ fontSize: '26px' }}>🔥</span>
        </div>
        <div className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--red)', marginTop: '8px', textTransform: 'uppercase' }}>
          7-Day Streak
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ zIndex: 1 }}>
        <div className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '8px' }}>
          Last 30 Days
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 32px)', gap: '4px' }}>
          {cells.map((opacity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.05 + i * 0.018 }}
              style={{
                width: '32px', height: '32px', borderRadius: '4px',
                backgroundColor: i >= 23
                  ? `rgba(255,255,255,${opacity})`
                  : `rgba(255,0,49,${opacity * 0.75})`,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP DATA
// ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    tag:   'DASHBOARD',
    title: 'Your Trajectory Score',
    desc:  'Track your employability in real-time. Our AI engine analyses academic, behavioral and skills data to give you a single actionable number.',
    scene: <DashboardScene />,
  },
  {
    tag:   'COMMUNITY',
    title: 'Peer Feed',
    desc:  'See how students on similar trajectories are progressing. Share memes, get motivated, and stay connected with your cohort.',
    scene: <FeedScene />,
  },
  {
    tag:   'ANALYTICS',
    title: 'Gap Analysis',
    desc:  'Pinpoint exactly what is holding your score back. Get personalized AI recommendations ranked by impact — and act on them.',
    scene: <AnalyticsScene />,
  },
  {
    tag:   'PROFILE',
    title: 'Streaks & Achievements',
    desc:  'Build consistent habits and watch your score climb. Every seven-day streak earns you a badge on your public profile.',
    scene: <ProfileScene />,
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<number>(-1);

  useEffect(() => {
    const t = setTimeout(() => setStep(0), 2600);
    return () => clearTimeout(t);
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else onComplete();
  };

  const handleBack = () => { if (step > 0) setStep(s => s - 1); };

  const current = step >= 0 ? STEPS[step] : null;
  const progress = step >= 0 ? ((step + 1) / STEPS.length) * 100 : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--base)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Illustration area (top 58%) ──────────────────── */}
      <div style={{ position: 'relative', height: '58%', flexShrink: 0 }}>
        <AnimatePresence mode="wait">
          {step === -1 && (
            <motion.div key="boot"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <BootScene />
            </motion.div>
          )}
          {step >= 0 && (
            <motion.div key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              {STEPS[step].scene}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom sheet (bottom 42%) ────────────────────── */}
      <AnimatePresence>
        {step >= 0 && (
          <motion.div
            key="sheet"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              backgroundColor: 'rgba(12,12,14,0.97)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              padding: '0 28px 48px',
              overflow: 'hidden',
            }}
          >
            {/* Red progress bar at the very top */}
            <div style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '24px' }}>
              <motion.div
                style={{ height: '100%', backgroundColor: 'var(--red)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            {/* Step counter */}
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {String(step + 1).padStart(2, '0')} — {String(STEPS.length).padStart(2, '0')} &nbsp;·&nbsp; {current?.tag}
                </div>

                <h1 className="font-display font-bold" style={{ fontSize: '26px', lineHeight: 1.1, color: '#fff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
                  {current?.title}
                </h1>

                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>
                  {current?.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '20px' }}>

              {/* Back + dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {step > 0 ? (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBack}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={18} color="rgba(255,255,255,0.7)" />
                  </motion.button>
                ) : (
                  <div style={{ width: '40px' }} />
                )}

                {/* Step dots */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {STEPS.map((_, i) => (
                    <div key={i} style={{
                      height: '3px',
                      width: i === step ? '18px' : '5px',
                      borderRadius: '2px',
                      backgroundColor: i === step ? 'var(--red)' : 'rgba(255,255,255,0.15)',
                      transition: 'all 0.25s ease',
                    }} />
                  ))}
                </div>
              </div>

              {/* Next button */}
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={handleNext}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: 'var(--red)',
                  border: 'none', borderRadius: '10px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(255,0,49,0.3)',
                }}
              >
                <span className="font-mono" style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>
                  {step === STEPS.length - 1 ? 'GET STARTED' : 'NEXT'}
                </span>
                <ArrowRight size={16} color="#fff" weight="bold" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      <AnimatePresence>
        {step >= 0 && step < STEPS.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
            style={{
              position: 'absolute', top: '44px', right: '20px', zIndex: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer',
            }}
          >
            <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>SKIP</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
