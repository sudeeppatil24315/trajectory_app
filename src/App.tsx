import { useState, useEffect, Suspense, lazy } from 'react';
import { BottomNav } from './components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Onboarding from './screens/Onboarding';
import Landing from './screens/Landing';

// Lazy load screens for performance
const Dashboard = lazy(() => import('./screens/Dashboard'));
const MemeFeed = lazy(() => import('./screens/MemeFeed'));
const Charts = lazy(() => import('./screens/Charts'));
const Profile = lazy(() => import('./screens/Profile'));

// ══════════════════════════════════════════════════════════════
// Splash Screen — 3 phases:
//   'scan'  → red horizontal line sweeps top→bottom (0–900ms)
//   'boot'  → terminal boot sequence lines appear (900–3200ms)
//   'exit'  → split door: top half slides up, bottom half slides down
// ══════════════════════════════════════════════════════════════

const BOOT_LINES = [
  { label: 'INIT_SYSTEM', finalPct: 100, delay: 0 },
  { label: 'LOAD_PROFILE', finalPct: 100, delay: 300 },
  { label: 'ANALYTICS_ENGINE', finalPct: 100, delay: 600 },
  { label: 'TRAJECTORY_CALC', finalPct: 100, delay: 900 },
];

function BootLine({ label, finalPct, delay, active }: { label: string; finalPct: number; delay: number; active: boolean }) {
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setPct(finalPct), delay + 80);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active, delay, finalPct]);

  if (!visible) return null;

  const filled = Math.round((pct / 100) * 8);
  const bar = '█'.repeat(filled) + '░'.repeat(8 - filled);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
      <span className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', minWidth: '160px' }}>
        {label}
      </span>
      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--red)', letterSpacing: '0.04em', transition: 'all 0.6s ease' }}>
        {bar} {pct}%
      </span>
    </div>
  );
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'scan' | 'boot' | 'exit'>('scan');

  useEffect(() => {
    // Phase 1: scan line (900ms)
    const t1 = setTimeout(() => setPhase('boot'), 900);
    // Phase 2: boot sequence (2300ms)
    const t2 = setTimeout(() => setPhase('exit'), 3200);
    // Phase 3: fade out (500ms) then unmount
    const t3 = setTimeout(() => onDone(), 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <motion.div
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '16px 16px', backgroundColor: 'var(--base)'
      }}
    >
      {/* ── Red scan line ─────────────────────────── */}
      {phase === 'scan' && (
        <motion.div
          initial={{ top: '-4px' }}
          animate={{ top: '100%' }}
          transition={{ duration: 0.85, ease: 'linear' }}
          style={{
            position: 'absolute', left: 0, right: 0, height: '2px',
            backgroundColor: 'var(--red)',
            boxShadow: '0 0 20px 6px rgba(255,0,49,0.45)',
            zIndex: 2,
          }}
        />
      )}

      {/* ── Boot sequence ─────────────────────────── */}
      <AnimatePresence>
        {phase === 'boot' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '0', zIndex: 1, padding: '40px',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '36px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--red)' }} />
                <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'var(--red)', textTransform: 'uppercase' }}>
                  TE_OS v1.0
                </span>
              </div>
              <h1 className="font-display font-bold" style={{ fontSize: '28px', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                TRAJECTORY<span style={{ color: 'rgba(255,255,255,0.25)' }}> ENGINE</span>
              </h1>
            </div>

            {/* Boot lines */}
            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px',
              backgroundColor: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '20px 24px'
            }}>
              {BOOT_LINES.map((line) => (
                <BootLine key={line.label} {...line} active={phase === 'boot'} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


// ══════════════════════════════════════════════════════════════
// Main App Layout
// ══════════════════════════════════════════════════════════════
function MainAppLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('te_onboarding_complete') === 'true';
  });

  const [showSplash, setShowSplash] = useState(true);

  const handleOnboardingComplete = () => {
    localStorage.setItem('te_onboarding_complete', 'true');
    setHasCompletedOnboarding(true);
    setShowSplash(false);
  };

  if (!hasCompletedOnboarding) {
    return (
      <div className="app-container">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* New premium splash */}
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {/* Main App Content */}
      <div
        className="scroll-container"
        style={{
          opacity: showSplash ? 0 : 1,
          transition: 'opacity 0.4s ease',
          perspective: '1200px',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ width: '100%', minHeight: '100%', transformOrigin: 'center center' }}
          >
            <Suspense fallback={<div />}>
              {activeTab === 0 && <Dashboard />}
              {activeTab === 1 && <MemeFeed />}
              {activeTab === 2 && <Charts />}
              {activeTab === 3 && <Profile />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {!showSplash && (
        <div className="page-enter">
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="app-container" style={{ backgroundColor: 'var(--base)' }} />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<MainAppLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
