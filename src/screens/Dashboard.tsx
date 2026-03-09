import { useState, useEffect } from 'react';
import { Bell, Lightning, Phone, CaretDown, TrendUp, TrendDown, Code, PhoneSlash, CalendarCheck, ArrowsClockwise } from '@phosphor-icons/react';
import { TopHeader } from '../components/TopHeader';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { ArcRing } from '../components/ArcRing';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { DecryptText } from '../components/DecryptText';
import { Reorder, motion } from 'framer-motion';

export default function Dashboard() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [componentOrder, setComponentOrder] = useState(['academic', 'behavioral', 'skills']);
  const [wellbeingOrder, setWellbeingOrder] = useState(['focus', 'sleep', 'screen']);
  const [completedRecs, setCompletedRecs] = useState<Set<number>>(new Set());
  const toggleRec = (i: number) => setCompletedRecs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  // Analytics Tabs
  const [activeTab, setActiveTab] = useState('AI Recs');
  const tabs = ['AI Recs', 'Gap Analysis', 'App Usage'];

  useEffect(() => {
    // Parallax & Sticky Header scroll listener
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrolled(target.scrollTop > 10);
    };
    
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    
    // Mount animations
    const t = setTimeout(() => setLoaded(true), 10);
    
    // Animate score from 0 to 73 over 700ms
    let startTimestamp: number | null = null;
    const duration = 700;
    const targetScore = 73;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setScore(Math.floor(easeProgress * targetScore));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
    
    return () => {
      clearTimeout(t);
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Base staggered entrance style
  const getEntranceStyle = (delayMs: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity 400ms ease-out ${delayMs}ms, transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms`
  });

  return (
    <div className="page-enter" style={{ paddingBottom: '32px' }}>
      <TopHeader 
        scrolled={scrolled}
        left={
          <div style={{...getEntranceStyle(0)}}>
            <Avatar initials="AP" ring />
          </div>
        }
        center={
          <div style={{...getEntranceStyle(0)}}>
            <span className="text-heading">Hello, Arun 👋</span>
          </div>
        }
        right={
          <div style={{ position: 'relative', ...getEntranceStyle(0) }}>
            <Bell size={22} color="rgba(255,255,255,0.8)" />
            <div 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--red)',
                borderRadius: '50%',
                border: '1.5px solid var(--base)',
                animation: 'pulseBell 1.5s infinite ease-in-out'
              }}
            />
          </div>
        }
      />

      <div className="content-padded" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* HERO TRAJECTORY CARD */}
        <div style={{ position: 'relative', ...getEntranceStyle(100) }}>
          {/* Radial Glow */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
              opacity: 0.06,
              pointerEvents: 'none',
              borderRadius: 'var(--card-radius)'
            }}
          />
          
          <Card>
            <div className="flex-row space-between" style={{ alignItems: 'center' }}>
              <div style={{ width: '55%' }} className="flex-col gap-8">
                <div className="flex-row gap-4" style={{ marginBottom: '4px' }}>
                  <Lightning size={12} color="var(--accent)" weight="fill" />
                  <span className="text-tag text-muted">TRAJECTORY SCORE</span>
                </div>
                <div className="flex-row" style={{ alignItems: 'baseline' }}>
                  <span className="text-hero-score font-mono" style={{ display: 'inline-flex', letterSpacing: '-2px' }}>
                    <DecryptText text={score} duration={1400} />
                  </span>
                  <span className="text-title text-muted font-mono" style={{ marginLeft: '4px' }}>/100</span>
                </div>
                <div className="flex-row gap-4" style={{ marginTop: '4px' }}>
                  <TrendUp size={12} color="var(--accent)" weight="bold" />
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.04em' }}>+5 pts this week</span>
                </div>
                
                <StatusBadge 
                  text={score >= 73 ? 'HIGH EMPLOYABILITY' : score >= 50 ? 'MODERATE RISK' : 'AT RISK'}
                  status={score >= 73 ? 'accent' : score >= 50 ? 'amber' : 'red'}
                  size="small"
                  className="mt-1"
                />
                
                <div className="flex-row mt-3" style={{ marginTop: '12px', gap: '0' }}>
                  <div className="flex-col" style={{ flex: 1, alignItems: 'center' }}>
                    <span className="text-tag text-muted mb-1" style={{textTransform: 'none', letterSpacing: 'normal'}}>Confidence</span>
                    <span className="font-mono text-data-small">73 ± 8</span>
                  </div>
                  <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-strong)', margin: '0 8px' }} />
                  <div className="flex-col" style={{ flex: 1, alignItems: 'center' }}>
                    <span className="text-tag text-muted mb-1" style={{textTransform: 'none', letterSpacing: 'normal'}}>Predicted Tier</span>
                    <span className="font-mono text-data-small">Tier 1/2</span>
                  </div>
                </div>
                

              </div>
              
              <div style={{ width: '45%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <ArcRing value={73} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div className="font-mono text-title"><DecryptText text={score} duration={1800} />%</div>
                  <div className="font-mono text-tag text-muted mt-1">SCORE</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* COMPONENT BREAKDOWN CARD */}
        <div style={{ ...getEntranceStyle(200) }}>
          <Card>
            <div className="flex-row space-between" style={{ marginBottom: '16px' }}>
              <div className="flex-row gap-6">
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                <span className="text-card-title">Component Breakdown</span>
              </div>
              <div className="flex-row gap-4 clickable text-accent text-body-small">
                View details
                <span style={{ fontSize: '10px' }}>→</span>
              </div>
            </div>

            <Reorder.Group axis="y" values={componentOrder} onReorder={setComponentOrder} className="flex-col gap-12" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {componentOrder.map(item => (
                <Reorder.Item key={item} value={item} style={{ position: 'relative', cursor: 'grab' }} whileDrag={{ scale: 1.02, zIndex: 10, cursor: 'grabbing', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                  {item === 'academic' && (
                    <div className="flex-col gap-6" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex-row space-between" style={{ alignItems: 'baseline' }}>
                        <div className="flex-row gap-6" style={{ alignItems: 'baseline' }}>
                          <span className="text-card-title">Academic</span>
                          <span className="font-mono text-[11px] text-muted" style={{ whiteSpace: 'nowrap' }}>(25% weight)</span>
                        </div>
                        <div className="flex-row" style={{ alignItems: 'baseline' }}>
                          <span className="font-mono text-data-small text-accent">90<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span></span>
                          <span className="text-muted mx-1"> · </span>
                          <span className="text-body-small text-accent">Strong</span>
                        </div>
                      </div>
                      <ProgressBar value={90} color="var(--accent)" delay={300} />
                      <div className="text-[12px] text-muted mt-1">GPA: 8.6 · Attendance: 90% · Backlogs: 0</div>
                    </div>
                  )}

                  {item === 'behavioral' && (
                    <div className="flex-col gap-6" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex-row space-between" style={{ alignItems: 'baseline' }}>
                        <div className="flex-row gap-6" style={{ alignItems: 'baseline' }}>
                          <span className="text-card-title">Behavioral</span>
                          <span className="font-mono text-[11px] text-muted" style={{ whiteSpace: 'nowrap' }}>(35% weight)</span>
                        </div>
                        <div className="flex-row" style={{ alignItems: 'baseline' }}>
                          <span className="font-mono text-data-small text-amber">48<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span></span>
                          <span className="text-muted mx-1"> · </span>
                          <span className="text-body-small text-amber" style={{ whiteSpace: 'nowrap' }}>Needs Work</span>
                        </div>
                      </div>
                      <ProgressBar value={48} color="var(--amber)" delay={400} />
                      <div className="text-[12px] text-muted mt-1">Study: 3h/day · Screen: 6h/day · Grit: 0.48</div>
                    </div>
                  )}

                  {item === 'skills' && (
                    <div className="flex-col gap-6">
                      <div className="flex-row space-between" style={{ alignItems: 'baseline' }}>
                        <div className="flex-row gap-6" style={{ alignItems: 'baseline' }}>
                          <span className="text-card-title">Skills</span>
                          <span className="font-mono text-[11px] text-muted" style={{ whiteSpace: 'nowrap' }}>(40% weight)</span>
                        </div>
                        <div className="flex-row" style={{ alignItems: 'baseline' }}>
                          <span className="font-mono text-data-small text-accent">73<span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/100</span></span>
                          <span className="text-muted mx-1"> · </span>
                          <span className="text-body-small text-accent">Good</span>
                        </div>
                      </div>
                      <ProgressBar value={73} color="var(--accent)" delay={500} />
                      <div className="text-[12px] text-muted mt-1">5 projects · Internship: Yes · Languages: 5</div>
                    </div>
                  )}
                </Reorder.Item>
              ))}


            </Reorder.Group>
          </Card>
        </div>
      </div>
      
      {/* DIGITAL WELLBEING SECTION */}
      <div style={{ marginTop: '24px', ...getEntranceStyle(300) }}>
        <div className="content-padded flex-row space-between" style={{ marginBottom: '16px' }}>
          <div className="flex-col">
            <div className="flex-row gap-6 mb-1">
              <Phone size={16} className="text-muted" />
              <span className="text-heading" style={{ fontSize: '17px' }}>Digital Wellbeing</span>
            </div>
            <span className="text-[12px] text-muted">Last 7 days · data from mobile app</span>
          </div>
          <div className="flex-row gap-6 items-center">
            <div 
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--green)',
                animation: 'pulseSync 1.5s infinite ease-in-out'
              }}
            />
            <span className="font-mono text-tag text-muted" style={{ letterSpacing: 'normal' }}>Synced today</span>
          </div>
        </div>
        
        {/* Horizontal Scroll Cards */}
        <Reorder.Group
          axis="x"
          values={wellbeingOrder}
          onReorder={setWellbeingOrder}
          className="flex-row"
          style={{ 
            listStyle: 'none',
            margin: 0,
            overflowX: 'auto', 
            gap: '12px', 
            paddingLeft: 'var(--bg-margin)', 
            paddingRight: 'var(--bg-margin)',
            paddingBottom: '8px', 
            scrollSnapType: 'x mandatory'
          }}
        >
          {wellbeingOrder.map(item => (
            <Reorder.Item 
              key={item} 
              value={item} 
              style={{ position: 'relative', cursor: 'grab', minWidth: '82%', maxWidth: '318px' }} 
              whileDrag={{ scale: 1.02, zIndex: 10, cursor: 'grabbing', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
            >
              {item === 'focus' && (
                <div 
                  className="surface-card" 
                  style={{ 
                    height: '215px', 
                    padding: '16px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div className="flex-row space-between">
                    <span className="font-display font-semibold" style={{ fontSize: '14px' }}>Weekly Focus Score</span>
                    <div className="font-mono text-[11px] text-accent flex-row" style={{ backgroundColor: 'rgba(92, 98, 249, 0.15)', borderRadius: '100px', padding: '3px 10px' }}>
                      Avg: 68
                    </div>
                  </div>
                  <span className="text-[12px] text-muted mt-1">Productivity by day</span>
                  
                  {/* Bar Chart 1 */}
                  <div className="flex-row" style={{ alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
                    {[
                      { day: 'Mon', val: 100, label: '100', color: 'var(--accent)' },
                      { day: 'Tue', val: 100, label: '100', color: 'var(--accent)' },
                      { day: 'Wed', val: 45, label: '45', color: 'var(--amber)' },
                      { day: 'Thu', val: 100, label: '100', color: 'var(--accent)' },
                      { day: 'Fri', val: 100, label: '100', color: 'var(--accent)' },
                      { day: 'Sat', val: 59, label: '59', color: 'var(--red)' },
                      { day: 'Sun', val: 0, label: '', color: 'transparent' }
                    ].map((item, i) => (
                      <div key={i} className="flex-col" style={{ alignItems: 'center', flex: 1 }}>
                        <span className="font-mono text-[10px] mb-1" style={{ color: item.color === 'var(--accent)' ? 'var(--text-primary)' : item.color }}>{item.label}</span>
                        <div style={{ width: '22px', height: '80px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '2px 2px 0 0', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none' }}>
                          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${item.val}%`, backgroundColor: item.color, borderRadius: '2px 2px 0 0', transition: 'height 400ms ease', backgroundImage: item.color === 'var(--accent)' ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)' : 'none' }} />
                        </div>
                        <span className="font-mono text-[10px] text-muted mt-2">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item === 'sleep' && (
                <div 
                  className="surface-card" 
                  style={{ 
                    height: '215px', 
                    padding: '16px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div className="flex-row space-between">
                    <span className="font-display font-semibold" style={{ fontSize: '14px' }}>Sleep Score</span>
                    <div className="font-mono text-[11px] text-muted flex-row gap-4" style={{ backgroundColor: 'var(--surface-plus-1)', borderRadius: '6px', padding: '4px 10px' }}>
                      Last 12 months <CaretDown size={12} weight="bold" />
                    </div>
                  </div>
                  
                  <div className="flex-col mt-2 mb-auto">
                    <span className="font-mono text-accent" style={{ fontSize: '44px', fontWeight: 'bold', lineHeight: '1' }}>9h</span>
                    <span className="font-mono text-[10px] text-muted uppercase mt-1">Latest Score</span>
                    <div className="flex-row gap-4 text-accent text-[12px] mt-2 font-body font-medium">
                      <TrendUp size={14} weight="bold" />
                      ▲ 2.5h vs prev month
                    </div>
                  </div>

                  {/* Mini Bar Chart */}
                  <div className="flex-row" style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: '55px' }}>
                    {[
                      {m:'A', h:65, o:0.4}, {m:'S', h:55, o:0.4}, {m:'O', h:60, o:0.4}, {m:'N', h:70, o:0.4},
                      {m:'D', h:58, o:0.55}, {m:'J', h:65, o:0.55}, {m:'F', h:72, o:0.55}, {m:'M', h:68, o:0.55},
                      {m:'A', h:75, o:0.8}, {m:'M', h:80, o:0.8}, {m:'J', h:85, o:0.8}, {m:'J', h:100, o:1}
                    ].map((item, i) => (
                      <div key={i} className="flex-col" style={{ alignItems: 'center', width: '16px' }}>
                        <div style={{ width: '100%', height: `${item.h}%`, backgroundColor: `rgba(92, 98, 249, ${item.o})`, borderRadius: '3px 3px 0 0' }} />
                        <span className="font-mono text-[9px] text-muted mt-1 opacity-60">
                          {i % 2 === 0 ? item.m : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item === 'screen' && (
                <div 
                  className="surface-card" 
                  style={{ 
                    height: '215px', 
                    padding: '16px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div className="flex-row space-between" style={{ alignItems: 'flex-start' }}>
                    <span className="font-display font-semibold" style={{ fontSize: '14px' }}>Screen Time</span>
                    <div className="flex-col gap-4 font-mono text-[12px]" style={{ textAlign: 'right' }}>
                      <div className="text-red flex-row gap-4 justify-end"><TrendUp size={12} /> ▲ 6.5h Sat</div>
                      <div className="text-accent flex-row gap-4 justify-end"><TrendDown size={12} /> ▼ 3.5h Mon</div>
                    </div>
                  </div>
                  <span className="text-[12px] text-muted mt-1">Daily screen time this week</span>
                  
                  {/* SVG Line Chart */}
                  <div style={{ position: 'relative', width: '100%', height: '90px', marginTop: 'auto' }}>
                    <svg width="100%" height="100%" viewBox="0 0 280 90" preserveAspectRatio="none">
                      <line x1="20" y1="10" x2="280" y2="10" stroke="rgba(0,0,0,0.08)" strokeDasharray="4 4" />
                      <line x1="20" y1="45" x2="280" y2="45" stroke="rgba(0,0,0,0.08)" strokeDasharray="4 4" />
                      <line x1="20" y1="80" x2="280" y2="80" stroke="rgba(0,0,0,0.08)" strokeDasharray="4 4" />
                      
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      
                      <path d="M30 70 C 50 70, 50 60, 70 60 C 90 60, 90 75, 110 75 C 130 75, 130 30, 150 30 C 170 30, 170 40, 190 40 C 210 40, 210 10, 230 10 C 250 10, 250 25, 270 25 L 270 90 L 30 90 Z" fill="url(#areaGradient)" />
                      <path d="M30 70 C 50 70, 50 60, 70 60 C 90 60, 90 75, 110 75 C 130 75, 130 30, 150 30 C 170 30, 170 40, 190 40 C 210 40, 210 10, 230 10 C 250 10, 250 25, 270 25" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                      
                      <circle cx="30" cy="70" r="2.5" fill="var(--base)" stroke="var(--text-primary)" strokeWidth="1.5" />
                      <circle cx="70" cy="60" r="2.5" fill="var(--base)" stroke="var(--text-primary)" strokeWidth="1.5" />
                      <circle cx="110" cy="75" r="2.5" fill="var(--base)" stroke="var(--text-primary)" strokeWidth="1.5" />
                      <circle cx="150" cy="30" r="2.5" fill="var(--base)" stroke="var(--text-primary)" strokeWidth="1.5" />
                      <circle cx="190" cy="40" r="2.5" fill="var(--base)" stroke="var(--text-primary)" strokeWidth="1.5" />
                      <circle cx="230" cy="10" r="4" fill="var(--base)" stroke="var(--red)" strokeWidth="2" />
                      <circle cx="270" cy="25" r="2.5" fill="var(--base)" stroke="var(--text-primary)" strokeWidth="1.5" />
                      
                      <text x="230" y="0" fill="var(--red)" fontSize="10" fontFamily="monospace" textAnchor="middle">6.5h</text>
                      
                      <text x="0" y="14" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">7</text>
                      <text x="0" y="49" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">5</text>
                      <text x="0" y="84" fill="var(--text-muted)" fontSize="9" fontFamily="monospace">3</text>
                      
                      <text x="30" y="88" fill="var(--text-muted)" fontSize="9" fontFamily="monospace" textAnchor="middle">M</text>
                      <text x="70" y="88" fill="var(--text-muted)" fontSize="9" fontFamily="monospace" textAnchor="middle">T</text>
                      <text x="110" y="88" fill="var(--text-muted)" fontSize="9" fontFamily="monospace" textAnchor="middle">W</text>
                      <text x="150" y="88" fill="var(--text-muted)" fontSize="9" fontFamily="monospace" textAnchor="middle">T</text>
                      <text x="190" y="88" fill="var(--text-muted)" fontSize="9" fontFamily="monospace" textAnchor="middle">F</text>
                      <text x="230" y="88" fill="var(--text-muted)" fontSize="9" fontFamily="monospace" textAnchor="middle">S</text>
                      <text x="270" y="88" fill="var(--text-muted)" fontSize="9" fontFamily="monospace" textAnchor="middle">S</text>
                    </svg>
                  </div>
                </div>
              )}
            </Reorder.Item>
          ))}
          
          {/* Invisible spacer at the end for scroll padding */}
          <div style={{ minWidth: '4px', height: '100%' }} />
        </Reorder.Group>

        {/* Scroll dot indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
          {['focus', 'sleep', 'screen'].map((_, i) => (
            <div key={i} style={{ width: i === 0 ? '16px' : '6px', height: '4px', borderRadius: '2px', backgroundColor: i === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)', transition: 'all 0.2s ease' }} />
          ))}
        </div>
      </div>
      
      {/* TAB CHIP SELECTOR */}
      <div 
        className="flex-row"
        style={{
          position: 'sticky',
          top: '44px',
          zIndex: 40,
          padding: '24px var(--bg-margin) 12px',
          gap: '10px',
          backgroundColor: 'rgba(5, 5, 5, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'border-bottom 0.2s',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none'
        }}
      >
        {tabs.map((tab, idx) => (
          <div 
            key={idx}
            className="clickable"
            onClick={() => setActiveTab(tab)}
            style={{
              backgroundColor: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.45)',
              padding: '7px 16px',
              borderRadius: '7px',
              border: activeTab === tab ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              fontWeight: activeTab === tab ? 700 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="content-padded mt-4">
      {/* =========================================
          TAB A - AI RECOMMENDATIONS
          ========================================= */}
      {activeTab === 'AI Recs' && (
        <div className="flex-col gap-10">
          {/* Section Header */}
          <div className="flex-row space-between" style={{ padding: '8px 0', ...getEntranceStyle(0) }}>
            <div className="flex-row gap-6">
              <Lightning size={18} color="var(--accent)" weight="fill" />
              <span className="font-display font-semibold text-[18px]">AI Recommendations</span>
            </div>
            
            <motion.div 
              whileTap={{ scale: 0.92 }}
              className="clickable flex-row gap-6"
              style={{
                border: '1.5px solid var(--accent)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--accent)',
                padding: '6px 14px',
                borderRadius: '8px',
              }}
            >
              <ArrowsClockwise size={14} weight="bold" />
              <span className="font-display font-medium text-[12px]">Regenerate</span>
            </motion.div>
          </div>
          <p className="text-[12px] text-muted mb-2" style={{ ...getEntranceStyle(0), marginTop: '-8px' }}>
            Generated by Llama 3.1 8B · for your profile
          </p>

          {/* Rec Card 1 */}
          <div style={getEntranceStyle(50)}>
            <Card padding="normal">
              <div className="flex-col gap-10">
                <div className="flex-row" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--surface-plus-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code size={22} color="white" />
                  </div>
                  <div className="flex-col mx-3" style={{ flex: 1 }}>
                    <span className="font-display font-semibold text-[15px]" style={{ lineHeight: '1.3' }}>Improve problem-solving skills</span>
                  </div>
                  <div className="flex-col gap-1" style={{ backgroundColor: 'rgba(92, 98, 249, 0.10)', padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(92, 98, 249, 0.3)', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="font-mono font-semibold text-[11px] text-accent">HIGH</span>
                    <span className="font-mono font-semibold text-[13px] text-accent">+8 pts</span>
                  </div>
                </div>
                
                <p className="text-body-small text-body">
                  Practice DSA daily. Start with 2 Easy and 1 Medium problem per day — alumni who made this shift moved from 2/5 to 4/5 in just 4 weeks.
                </p>
                
                <div className="flex-row space-between items-center mt-2">
                  <div className="flex-row gap-8">
                    <span className="font-mono text-tag text-muted bg-[var(--surface-plus-1)] px-3 py-1 rounded-[6px]" style={{ textDecoration: completedRecs.has(0) ? 'line-through' : 'none', opacity: completedRecs.has(0) ? 0.4 : 1 }}>4 WEEKS</span>
                    <span className="font-mono text-tag text-muted bg-[var(--surface-plus-1)] px-3 py-1 rounded-[6px]" style={{ textDecoration: completedRecs.has(0) ? 'line-through' : 'none', opacity: completedRecs.has(0) ? 0.4 : 1 }}>SKILLS</span>
                  </div>
                  <div onClick={() => toggleRec(0)} className="clickable" style={{ width: '20px', height: '20px', borderRadius: '10px', border: completedRecs.has(0) ? 'none' : '1.5px solid rgba(92, 98, 249, 0.5)', backgroundColor: completedRecs.has(0) ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {completedRecs.has(0) && <span style={{ fontSize: '10px', color: 'white', fontWeight: 'bold' }}>✓</span>}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Rec Card 2 */}
          <div style={getEntranceStyle(100)}>
            <Card padding="normal">
              <div className="flex-col gap-10">
                <div className="flex-row" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--surface-plus-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneSlash size={22} color="white" />
                  </div>
                  <div className="flex-col mx-3" style={{ flex: 1 }}>
                    <span className="font-display font-semibold text-[15px]" style={{ lineHeight: '1.3' }}>Reduce daily screen time</span>
                  </div>
                  <div className="flex-col gap-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.10)', padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="font-mono font-semibold text-[11px] text-amber">MED</span>
                    <span className="font-mono font-semibold text-[13px] text-amber">+3 pts</span>
                  </div>
                </div>
                
                <p className="text-body-small text-body">
                  Cut from 6.2h to 4h by setting app limits during deep-work blocks (6–9pm). This single change lifts your behavioral score noticeably.
                </p>
                
                <div className="flex-row space-between items-center mt-2">
                  <div className="flex-row gap-8">
                    <span className="font-mono text-tag text-muted bg-[var(--surface-plus-1)] px-3 py-1 rounded-[6px]" style={{ textDecoration: completedRecs.has(1) ? 'line-through' : 'none', opacity: completedRecs.has(1) ? 0.4 : 1 }}>2 WEEKS</span>
                    <span className="font-mono text-tag text-muted bg-[var(--surface-plus-1)] px-3 py-1 rounded-[6px]" style={{ textDecoration: completedRecs.has(1) ? 'line-through' : 'none', opacity: completedRecs.has(1) ? 0.4 : 1 }}>BEHAVIORAL</span>
                  </div>
                  <div onClick={() => toggleRec(1)} className="clickable" style={{ width: '20px', height: '20px', borderRadius: '10px', border: completedRecs.has(1) ? 'none' : '1.5px solid rgba(92, 98, 249, 0.5)', backgroundColor: completedRecs.has(1) ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {completedRecs.has(1) && <span style={{ fontSize: '10px', color: 'white', fontWeight: 'bold' }}>✓</span>}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Rec Card 3 */}
          <div style={getEntranceStyle(150)}>
            <Card padding="normal">
              <div className="flex-col gap-10">
                <div className="flex-row" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--surface-plus-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarCheck size={22} color="white" />
                  </div>
                  <div className="flex-col mx-3" style={{ flex: 1 }}>
                    <span className="font-display font-semibold text-[15px]" style={{ lineHeight: '1.3' }}>Build a consistent study routine</span>
                  </div>
                  <div className="flex-col gap-1" style={{ backgroundColor: 'rgba(245, 158, 11, 0.10)', padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="font-mono font-semibold text-[11px] text-amber">MED</span>
                    <span className="font-mono font-semibold text-[13px] text-amber">+4 pts</span>
                  </div>
                </div>
                
                <p className="text-body-small text-body">
                  Lock in a 90-minute daily slot for focused practice. Track it with a habit app. Consistency closes the grit gap faster than intensity.
                </p>
                
                <div className="flex-row space-between items-center mt-2">
                  <div className="flex-row gap-8">
                    <span className="font-mono text-tag text-muted bg-[var(--surface-plus-1)] px-3 py-1 rounded-[6px]" style={{ textDecoration: completedRecs.has(2) ? 'line-through' : 'none', opacity: completedRecs.has(2) ? 0.4 : 1 }}>1 MONTH</span>
                    <span className="font-mono text-tag text-muted bg-[var(--surface-plus-1)] px-3 py-1 rounded-[6px]" style={{ textDecoration: completedRecs.has(2) ? 'line-through' : 'none', opacity: completedRecs.has(2) ? 0.4 : 1 }}>BEHAVIORAL</span>
                  </div>
                  <div onClick={() => toggleRec(2)} className="clickable" style={{ width: '20px', height: '20px', borderRadius: '10px', border: completedRecs.has(2) ? 'none' : '1.5px solid rgba(92, 98, 249, 0.5)', backgroundColor: completedRecs.has(2) ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {completedRecs.has(2) && <span style={{ fontSize: '10px', color: 'white', fontWeight: 'bold' }}>✓</span>}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================
          TAB B - GAP ANALYSIS
          ========================================= */}
      {activeTab === 'Gap Analysis' && (
        <div className="flex-col gap-10 page-enter">
          {/* Section Header */}
          <div className="flex-row space-between" style={{ padding: '8px 0', alignItems: 'center' }}>
            <div className="flex-col">
              <span className="font-display font-semibold text-[18px]">Gap Analysis</span>
              <span className="text-[12px] text-muted">vs your Top 3 similar alumni</span>
            </div>
            
            <StatusBadge text="0.95 Moderate" status="amber" className="" />
          </div>

          {[
            { tag: "HIGH IMPACT", tagStatus: "red" as const, name: "Problem-solving", youVal: "2.0", alVal: "4.2", youPct: "40%", alPct: "84%", gapVal: "−2.2 gap", gapColor: "var(--red)", note: "Build this up — biggest weak point" },
            { tag: "MED IMPACT", tagStatus: "amber" as const, name: "Screen time", youVal: "6h", alVal: "4.8h", youPct: "60%", alPct: "48%", gapVal: "+1.2 gap", gapColor: "var(--amber)", note: "Cut screen time to match alumni" },
            { tag: "STRENGTH", tagStatus: "accent" as const, name: "GPA", youVal: "8.6", alVal: "8.4", youPct: "86%", alPct: "84%", gapVal: "+0.2 gap", gapColor: "var(--accent)", note: "You're ahead here — maintain it" },
          ].map((item, idx) => (
            <Card padding="normal" key={idx} className="mt-2">
              <div className="flex-row space-between items-center mb-4">
                <span className="font-display font-semibold text-[16px]">{item.name}</span>
                <StatusBadge text={item.tag} status={item.tagStatus} size="small" />
              </div>
              
              <div className="flex-row justify-center items-center gap-12 mb-4">
                <div className="flex-row gap-6">
                  <span className="text-body-small text-muted">You:</span>
                  <span className="font-mono text-data-medium" style={{ color: item.gapColor }}>{item.youVal}</span>
                </div>
                <span className="text-[13px] text-muted">vs</span>
                <div className="flex-row gap-6">
                  <span className="text-body-small text-muted">Alumni:</span>
                  <span className="font-mono text-data-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.alVal}</span>
                </div>
              </div>
              
              <div className="flex-col gap-4 mb-4">
                {/* Your Bar */}
                <div className="flex-row gap-8 items-center">
                  <span className="font-mono text-[10px] text-muted" style={{ width: '52px' }}>You</span>
                  <div style={{ flex: 1, height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '100px' }}>
                    <div style={{ height: '5px', width: item.youPct, backgroundColor: item.gapColor, borderRadius: '100px' }} />
                  </div>
                </div>
                {/* Alumni Bar */}
                <div className="flex-row gap-8 items-center">
                  <span className="font-mono text-[10px] text-muted" style={{ width: '52px' }}>Alumni</span>
                  <div style={{ flex: 1, height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '100px' }}>
                    <div style={{ height: '5px', width: item.alPct, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '100px' }} />
                  </div>
                </div>
              </div>
              
              <div className="flex-row space-between items-center pt-2 gap-12" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="font-mono font-bold text-[13px]" style={{ color: item.gapColor, whiteSpace: 'nowrap' }}>{item.gapVal}</span>
                <span className="text-[12px] text-muted" style={{ textAlign: 'right', lineHeight: '1.3' }}>{item.note}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* =========================================
          TAB C - APP USAGE
          ========================================= */}
      {activeTab === 'App Usage' && (
        <div className="flex-col gap-10 page-enter">
          <div className="flex-col mb-4 pt-2">
            <span className="font-display font-semibold text-[18px]">App Usage Breakdown</span>
            <span className="text-[12px] text-muted">This week · synced from mobile app</span>
          </div>

          {/* Segmented Bar */}
          <div className="flex-row" style={{ width: '100%', height: '22px', borderRadius: '6px', overflow: 'hidden', gap: '2px' }}>
            <div style={{ width: '25%', height: '100%', backgroundColor: 'var(--accent)', transition: 'width 0.8s ease', borderRadius: '4px 0 0 4px' }} />
            <div style={{ width: '35%', height: '100%', backgroundColor: 'var(--red)', transition: 'width 0.8s ease 0.1s' }} />
            <div style={{ width: '30%', height: '100%', backgroundColor: 'rgba(255,255,255,0.18)', transition: 'width 0.8s ease 0.2s' }} />
            <div style={{ width: '10%', height: '100%', backgroundColor: 'var(--amber)', transition: 'width 0.8s ease 0.3s', borderRadius: '0 4px 4px 0' }} />
          </div>

          {/* Legend Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '10px 24px', 
              marginTop: '16px' 
            }}
          >
            {[
              { label: 'Educational', val: '25%', color: 'var(--accent)' },
              { label: 'Social', val: '35%', color: 'var(--red)' },
              { label: 'Entertainment', val: '30%', color: 'rgba(255,255,255,0.2)' },
              { label: 'Productivity', val: '10%', color: 'var(--amber)' }
            ].map((item, i) => (
              <div key={i} className="flex-row items-center gap-10">
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                <span className="text-[13px] text-white flex-1">{item.label}</span>
                <span className="font-mono text-[13px]" style={{ color: item.color === 'rgba(255,255,255,0.2)' ? 'white' : item.color }}>{item.val}</span>
              </div>
            ))}
          </div>

          {/* Focus Insight Card */}
          <div 
            className="flex-row"
            style={{ 
              marginTop: '20px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.3)', 
              borderRadius: '14px', 
              padding: '14px 16px',
              gap: '12px',
              alignItems: 'flex-start'
            }}
          >
            <Lightning size={18} color="var(--amber)" weight="fill" style={{ marginTop: '2px' }} />
            <div className="flex-col">
              <span className="text-[13px] text-body mb-2">
                Social media at 35% is 2× higher than alumni in Tier 1 roles who averaged 17%.
              </span>
              <span className="text-[12px] text-amber">
                Reducing this is your fastest behavioral score boost.
              </span>
            </div>
          </div>

          {/* Streak Heatmap Mini Card */}
          <div className="mt-4">
            <div className="flex-row space-between items-center mb-1">
              <span className="font-display font-semibold text-[16px]">Progress & Streak</span>
              <StatusBadge text="7-day streak 🔥" status="accent" />
            </div>
            <span className="text-[12px] text-muted mb-4 block">Trajectory over last 30 days</span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', width: '100%' }}>
              {Array.from({ length: 30 }, (_, i) => {
                const intensity = i < 8 ? 0.08 + i * 0.04 : i < 16 ? 0.25 + (i - 8) * 0.05 : i < 25 ? 0.6 + (i - 16) * 0.04 : 0.9 + (i - 25) * 0.025;
                const isRecent = i >= 23;
                return (
                  <div
                    key={i}
                    className="page-enter"
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '3px',
                      backgroundColor: isRecent ? `rgba(255,255,255,${Math.min(intensity, 1)})` : `rgba(92,98,249,${Math.min(intensity, 1)})`,
                      boxShadow: i === 29 ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                      animationDelay: `${i * 20}ms`,
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  />
                );
              })}
            </div>
            <div className="font-mono text-accent text-[13px] mt-4">+8 points in the last 30 days</div>
          </div>
        </div>
      )}
      </div>

    </div>
  );
}
