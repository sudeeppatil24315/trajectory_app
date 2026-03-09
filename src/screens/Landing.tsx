import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ArrowRight, Code, TrendUp, ChatCircle, Brain } from '@phosphor-icons/react';
import * as THREE from 'three';
import { DecryptText } from '../components/DecryptText';

// ══════════════════════════════════════════════════════════════════════
// 1. NODE GRAPH with cursor-parallax (improvement #7)
// ══════════════════════════════════════════════════════════════════════
const NODE_COUNT = 52;
const MAX_CONNECT_DIST = 2.3;
const RADIUS = 3.2;

function NodeGraph({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const { pointsGeo, linesGeo, hubPositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push(
        new THREE.Vector3(
          RADIUS * Math.sin(phi) * Math.cos(theta),
          RADIUS * Math.sin(phi) * Math.sin(theta),
          RADIUS * Math.cos(phi)
        )
      );
    }

    const linePts: number[] = [];
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        if (pts[a].distanceTo(pts[b]) < MAX_CONNECT_DIST) {
          linePts.push(pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z);
        }
      }
    }

    const pgeo = new THREE.BufferGeometry();
    const arr = new Float32Array(NODE_COUNT * 3);
    pts.forEach((p, i) => { arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z; });
    pgeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));

    const lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePts), 3));

    return { pointsGeo: pgeo, linesGeo: lgeo, hubPositions: pts.filter((_, i) => i % 8 === 0) };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Base slow rotation
    groupRef.current.rotation.y = t * 0.07;
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.15;
    // Cursor parallax — subtle tilt toward mouse (#7)
    groupRef.current.rotation.x += mouseY * 0.18;
    groupRef.current.rotation.y += mouseX * 0.18;
    // Camera bob
    camera.position.y = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial color="#FF0031" transparent opacity={0.14} />
      </lineSegments>
      <points geometry={pointsGeo}>
        <pointsMaterial color="#ffffff" size={0.055} sizeAttenuation transparent opacity={0.75} />
      </points>
      {hubPositions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshStandardMaterial color="#FF0031" emissive="#FF0031" emissiveIntensity={2} roughness={0} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Animated counter for Stats Strip (#2)
// ══════════════════════════════════════════════════════════════════════
function Counter({ to, suffix = '', duration = 2000 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ══════════════════════════════════════════════════════════════════════
// Features data (#6 label chips added)
// ══════════════════════════════════════════════════════════════════════
const features = [
  { icon: Code, color: 'var(--accent)', bg: 'rgba(92,98,249,0.12)', title: 'Gap Analysis', tag: 'ALGO_01', desc: 'Pinpoint exact algorithmic deficiencies vs Tier-1 alumni benchmarks.' },
  { icon: TrendUp, color: 'var(--amber)', bg: 'rgba(245,158,11,0.12)', title: 'Behavioral Tracking', tag: 'BVHR_02', desc: 'Measure digital wellbeing impact on your study performance.' },
  { icon: ChatCircle, color: 'var(--red)', bg: 'rgba(255,0,49,0.12)', title: 'Alumni Feed', tag: 'FEED_03', desc: 'Real-time placement wins from 94+ students in your network.' },
  { icon: Brain, color: 'var(--accent)', bg: 'rgba(92,98,249,0.12)', title: 'AI Recommendations', tag: 'AI_04', desc: 'Personalised action items to close your skill gap, powered by ML.' },
];

// ══════════════════════════════════════════════════════════════════════
// How It Works steps (#9)
// ══════════════════════════════════════════════════════════════════════
const steps = [
  { num: '01', label: 'Input Data', desc: 'Grade. Screen time. Projects. Attendance.' },
  { num: '02', label: 'AI Analysis', desc: 'ML model benchmarks you vs real alumni.' },
  { num: '03', label: 'Score & Act', desc: 'Get your Trajectory Score and action plan.' },
];

// ══════════════════════════════════════════════════════════════════════
// Marquee items (#3)
// ══════════════════════════════════════════════════════════════════════
const MARQUEE_ITEMS = [
  'GOOGLE', 'MICROSOFT', 'AMAZON', 'TIER 1 PLACED', '94 STUDENTS', 'ADOBE', 'META',
  'TRAJECTORY SCORE', 'Goldman SACHS', 'INFOSYS', '0 BACKLOGS', 'ORACLE',
];

function Marquee() {
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 0', position: 'relative' }}>
      {/* Fade masks on edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to right, var(--base), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2, background: 'linear-gradient(to left, var(--base), transparent)', pointerEvents: 'none' }} />
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap' }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', paddingRight: '48px' }}>
            {i % 2 === 0 ? <span style={{ color: 'var(--red)', marginRight: '8px' }}>◆</span> : null}
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Terminal preview mockup (#10)
// ══════════════════════════════════════════════════════════════════════
function TerminalPreview() {
  const lines = [
    { label: 'TRAJECTORY_SCORE', value: '73/100', color: '#fff' },
    { label: 'TIER_PREDICTION', value: 'Tier 1/2', color: 'var(--accent)' },
    { label: 'ACADEMIC', value: '90/100 · Strong', color: 'var(--accent)' },
    { label: 'BEHAVIORAL', value: '48/100 · Needs Work', color: 'var(--amber)' },
    { label: 'SKILLS', value: '73/100 · Good', color: '#fff' },
    { label: 'ALERT', value: 'Screen time 6h/day detected', color: 'var(--red)' },
    { label: 'RECOMMENDATION', value: 'Focus on behavioral score lever', color: 'rgba(255,255,255,0.5)' },
  ];

  return (
    <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
      {/* Title bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--red)' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--amber)' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }} />
        <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginLeft: '8px', letterSpacing: '0.1em' }}>
          te_analysis_output.log
        </span>
      </div>
      {/* Log lines */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
          >
            <span className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', flexShrink: 0 }}>{line.label}</span>
            <div style={{ flex: 1, height: '1px', borderBottom: '1px dashed rgba(255,255,255,0.06)' }} />
            <span className="font-mono" style={{ fontSize: '11px', color: line.color, letterSpacing: '0.05em', flexShrink: 0 }}>{line.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Main page component
// ══════════════════════════════════════════════════════════════════════
const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as any },
});

export default function Landing() {
  const navigate = useNavigate();

  // Mouse tracking for parallax (#7)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const [mouseVals, setMouseVals] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    rawX.set(nx);
    rawY.set(ny);
  }, [rawX, rawY]);

  useEffect(() => {
    const unsub = springX.on('change', v => setMouseVals(prev => ({ ...prev, x: v })));
    const unsub2 = springY.on('change', v => setMouseVals(prev => ({ ...prev, y: v })));
    return () => { unsub(); unsub2(); };
  }, [springX, springY]);

  // CTA hover state (#8)
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        backgroundColor: 'var(--base)', color: 'var(--text-primary)',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '16px 16px', zIndex: 10000,
      }}
    >

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', overflow: 'hidden',
        }}
      >
        {/* Node graph canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <ambientLight intensity={0.35} />
            <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-5, -3, 2]} intensity={0.4} color="#FF0031" />
            <Suspense fallback={null}>
              <NodeGraph mouseX={mouseVals.x} mouseY={mouseVals.y} />
            </Suspense>
          </Canvas>
        </div>

        {/* Radial vignette */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.88) 100%)' }} />

        {/* Red hero glow (#4) */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '420px', height: '220px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,0,49,0.12) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none', filter: 'blur(24px)' }} />

        {/* Scanline overlay (#5) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)', backgroundSize: '100% 4px' }} />

        {/* Nav strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 5 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--red)' }} />
          <span className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
            TE_OS 1.0
          </span>
        </div>

        {/* Hero copy */}
        <div style={{ position: 'relative', zIndex: 5, padding: '0 28px', maxWidth: '560px' }}>

          {/* Label row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ height: '1px', width: '52px', backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'var(--red)', textTransform: 'uppercase' }}>Placement Intelligence</span>
            <div style={{ height: '1px', width: '52px', backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </motion.div>

          {/* Decrypting title (#1) */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold"
            style={{ fontSize: 'clamp(48px, 11vw, 80px)', lineHeight: 0.95, letterSpacing: '-0.045em', color: '#fff' }}
          >
            <DecryptText text="TRAJECTORY" duration={1200} />
            <br />
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>
              <DecryptText text="ENGINE" duration={1400} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ marginTop: '28px', fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.42)', maxWidth: '320px', margin: '28px auto 0' }}
          >
            Predictive analytics for elite engineering placements. Know your score. Close the gap. Land the tier.
          </motion.p>

          {/* Stats row (#2) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{ marginTop: '36px', display: 'flex', justifyContent: 'center', gap: '0' }}
          >
            {[
              { value: 94, suffix: '+', label: 'Students Placed' },
              { value: 73, suffix: ' pts', label: 'Avg Trajectory Score' },
              { value: 1, suffix: '/2', label: 'Avg Tier Achieved' },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none', padding: '0 16px' }}>
                <div className="font-display font-bold" style={{ fontSize: '28px', color: '#fff', lineHeight: 1 }}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA button with hover (#8) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{ marginTop: '40px' }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setCtaHovered(true)}
              onHoverEnd={() => setCtaHovered(false)}
              onClick={() => navigate('/app')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#fff', color: '#000',
                border: 'none', borderRadius: '100px',
                padding: '15px 40px',
                fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em',
                cursor: 'pointer',
                boxShadow: ctaHovered ? '0 0 28px rgba(255,255,255,0.25)' : '0 0 0px rgba(255,255,255,0)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              ACCESS TERMINAL
              <motion.span animate={{ x: ctaHovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
                <ArrowRight size={15} weight="bold" />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          style={{ position: 'absolute', bottom: '28px', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
        </motion.div>
      </section>

      {/* ── MARQUEE (#3) ────────────────────────────────────────────────── */}
      <Marquee />

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 0', maxWidth: '720px', margin: '0 auto' }}>
        <motion.p {...inView(0)} className="font-mono"
          style={{ fontSize: '16px', letterSpacing: '0.28em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '48px', textAlign: 'center' }}>
          What's inside
        </motion.p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} {...inView(i * 0.06)}>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '20px', padding: '24px 28px',
                  display: 'flex', gap: '20px', alignItems: 'flex-start',
                }}>
                  <div style={{ flexShrink: 0, width: '42px', height: '42px', borderRadius: '11px', backgroundColor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={f.color} weight="thin" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h3 className="font-display font-bold" style={{ fontSize: '17px', color: '#fff' }}>{f.title}</h3>
                      {/* Label chip (#6) */}
                      <span className="font-mono" style={{ fontSize: '9px', color: 'var(--red)', border: '1px solid rgba(255,0,49,0.35)', borderRadius: '4px', padding: '2px 6px', letterSpacing: '0.1em' }}>{f.tag}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.55 }}>{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS (#9) ─────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px 0', maxWidth: '720px', margin: '0 auto' }}>
        <motion.p {...inView(0)} className="font-mono"
          style={{ fontSize: '16px', letterSpacing: '0.28em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '56px', textAlign: 'center' }}>
          How it works
        </motion.p>
        <div style={{ display: 'flex', gap: '0', position: 'relative' }}>
          {/* Circuit connecting line */}
          <div style={{ position: 'absolute', top: '21px', left: 'calc(16.6% + 21px)', right: 'calc(16.6% + 21px)', height: '1px', borderTop: '1px dashed rgba(255,0,49,0.25)', zIndex: 0 }} />
          {steps.map((step, i) => (
            <motion.div key={step.num} {...inView(i * 0.12)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(255,0,49,0.4)', backgroundColor: 'var(--base)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--red)', letterSpacing: '0.05em' }}>{step.num}</span>
              </div>
              <h4 className="font-display font-bold" style={{ fontSize: '14px', color: '#fff', marginBottom: '8px' }}>{step.label}</h4>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, maxWidth: '130px' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TERMINAL PREVIEW (#10) ────────────────────────────────────── */}
      <section style={{ padding: '96px 24px 0', maxWidth: '720px', margin: '0 auto' }}>
        <motion.p {...inView(0)} className="font-mono"
          style={{ fontSize: '16px', letterSpacing: '0.28em', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '36px', textAlign: 'center' }}>
          Sample analysis output
        </motion.p>
        <motion.div {...inView(0.1)}>
          <TerminalPreview />
        </motion.div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px 0', textAlign: 'center' }}>
        <motion.div {...inView(0)}>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(28px, 7vw, 48px)', color: '#fff', letterSpacing: '-0.03em', marginBottom: '24px' }}>
            Calculate your<br /><span style={{ color: 'rgba(255,255,255,0.25)' }}>trajectory.</span>
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ boxShadow: '0 0 32px rgba(255,255,255,0.2)' }}
            onClick={() => navigate('/app')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '100px', padding: '16px 44px', fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em', cursor: 'pointer' }}
          >
            ACCESS TERMINAL <ArrowRight size={15} weight="bold" />
          </motion.button>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center' }}>
        <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)' }}>
          © 2026 Trajectory Engine
        </span>
      </footer>
    </div>
  );
}
