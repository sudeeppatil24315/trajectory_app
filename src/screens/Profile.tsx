import { useState, useEffect } from 'react';
import { GearSix, Bell, ShieldCheck, SignOut, Trophy, Student, CaretRight, Question } from '@phosphor-icons/react';
import { TopHeader } from '../components/TopHeader';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { SlotCounter } from '../components/SlotCounter';

export default function Profile() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrolled(target.scrollTop > 10);
    };
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) scrollContainer.addEventListener('scroll', handleScroll);
    const t = setTimeout(() => setLoaded(true), 10);

    let startTimestamp: number | null = null;
    const duration = 700;
    const targetScore = 73;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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

  const getEntranceStyle = (delayMs: number) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 300ms ease-out ${delayMs}ms, transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms`
  });

  return (
    <div className="page-enter" style={{ paddingBottom: '96px' }}>
      <TopHeader 
        scrolled={scrolled}
        left={<span className="font-display font-semibold" style={{ fontSize: '20px' }}>Profile</span>}
        center={null}
        right={
          <>
            <Bell size={22} color="rgba(255,255,255,0.7)" className="clickable-icon" />
            <GearSix size={22} color="rgba(255,255,255,0.7)" className="clickable-icon" />
          </>
        }
      />

      <div className="content-padded flex-col mt-4">
        
        {/* HERO BLOCK */}
        <div className="flex-col items-center gap-12 mt-4" style={getEntranceStyle(0)}>
          <div style={{ position: 'relative', width: '88px', height: '88px' }}>
            {/* Glowing ring */}
            <div 
              style={{
                position: 'absolute',
                top: '-12px', left: '-12px', right: '-12px', bottom: '-12px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                animation: 'popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              }}
            />
            <Avatar initials="AP" size={88} ring glow />
          </div>
          
          <div className="flex-col items-center">
            <span className="font-display font-semibold text-[22px]">Arun Prasad</span>
            <span className="text-body-regular text-muted mt-1">Computer Science · 6th Sem</span>
            <span className="font-mono text-[11px] text-muted mt-1 bg-[var(--surface-plus-1)] px-3 py-1 rounded-[100px]">
              ID: TE-9428-B
            </span>
          </div>
        </div>

        {/* SCORE SUMMARY ROW */}
        <div className="flex-row gap-12 mt-8" style={getEntranceStyle(100)}>
          <div className="surface-card flex-col items-center p-4 flex-1" style={{ padding: '16px' }}>
            <span className="font-mono text-accent text-[28px] font-bold" style={{ display: 'inline-flex', letterSpacing: '-2px' }}>
              <SlotCounter value={score} />
            </span>
            <span className="font-mono text-[10px] text-muted uppercase mt-1">Trajectory</span>
          </div>
          <div className="surface-card flex-col items-center p-4 flex-1" style={{ padding: '16px' }}>
            <span className="font-mono text-amber text-[28px] font-bold">Tier 2</span>
            <span className="font-mono text-[10px] text-muted uppercase mt-1">Prediction</span>
          </div>
        </div>

        {/* PROGRESS & STREAK CARD */}
        <div className="mt-6" style={getEntranceStyle(150)}>
          <Card padding="normal">
            <div className="flex-row space-between items-center mb-4">
              <span className="font-display font-semibold text-[16px]">Activity Match</span>
              <StatusBadge text="7 Day Streak !!" status="accent" size="small" />
            </div>
            
            {/* Heatmap Grid matching Design */}
            <div className="flex-col gap-4">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px' }}>
                {Array.from({length: 48}).map((_, i) => {
                  // Generate a nice varied pattern for the heatmap
                  const random = Math.sin(i * 0.5) * Math.cos(i * 0.8);
                  const isHigh = random > 0.6;
                  const isMed = random > 0 && random <= 0.6;
                  const isLow = random > -0.5 && random <= 0;
                  
                  let color = 'rgba(255,255,255,0.04)';
                  if (isHigh) color = 'var(--red)';
                  else if (isMed) color = 'rgba(255, 0, 49, 0.5)';
                  else if (isLow) color = 'rgba(255, 0, 49, 0.2)';

                  // Make the last few days very active
                  if (i > 40) color = 'var(--red)';
                  
                  return (
                    <div 
                      key={i} 
                      style={{ 
                        aspectRatio: '1', 
                        backgroundColor: color, 
                        borderRadius: '2px' 
                      }} 
                    />
                  );
                })}
              </div>
              <div className="flex-row space-between">
                <span className="font-mono text-[9px] text-muted">Oct</span>
                <span className="font-mono text-[9px] text-muted">Nov</span>
                <span className="font-mono text-[9px] text-muted">Dec</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="flex-col gap-12 mt-8" style={getEntranceStyle(200)}>
          <div className="flex-row gap-6 items-center flex-1">
            <div style={{ width: '4px', height: '16px', backgroundColor: 'var(--red)', borderRadius: '2px' }} />
            <span className="font-display font-semibold text-[18px]">Recent Achievements</span>
          </div>

          <div className="flex-row gap-12" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <div className="surface-card p-4 flex-col gap-12" style={{ padding: '16px', minWidth: '140px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={20} color="var(--accent)" weight="fill" />
              </div>
              <div className="flex-col">
                <span className="font-display font-semibold text-[14px]">Top 10%</span>
                <span className="text-[12px] text-muted mt-1">Academic</span>
              </div>
            </div>
            
            <div className="surface-card p-4 flex-col gap-12" style={{ padding: '16px', minWidth: '140px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Student size={20} color="var(--amber)" weight="fill" />
              </div>
              <div className="flex-col">
                <span className="font-display font-semibold text-[14px]">Fast Learner</span>
                <span className="text-[12px] text-muted mt-1">Skills</span>
              </div>
            </div>
            
            <div className="surface-card p-4 flex-col gap-12" style={{ padding: '16px', minWidth: '140px', opacity: 0.5 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--surface-plus-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} color="gray" />
              </div>
              <div className="flex-col">
                <span className="font-display font-semibold text-[14px]">Consistent</span>
                <span className="text-[12px] text-muted mt-1">Behavioral</span>
              </div>
            </div>
          </div>
        </div>

        {/* SETTINGS LIST */}
        <div className="flex-col mt-8" style={getEntranceStyle(250)}>
           <span className="font-mono text-tag text-muted mb-4" style={{marginLeft: '4px'}}>ACCOUNT</span>
           
           <div className="surface-card">
              {[
                { icon: Student, title: 'Academic Profile', val: 'Complete' },
                { icon: ShieldCheck, title: 'Privacy & Security', val: '' },
                { icon: Question, title: 'Help & Support', val: '' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex-row space-between items-center clickable p-4" 
                  style={{ 
                    padding: '16px',
                    borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  <div className="flex-row gap-12 items-center">
                    <item.icon size={20} color="rgba(255,255,255,0.7)" />
                    <span className="text-[15px]">{item.title}</span>
                  </div>
                  <div className="flex-row gap-8 items-center">
                    {item.val && <span className="text-[13px] text-muted">{item.val}</span>}
                    <CaretRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>
                </div>
              ))}
           </div>
        </div>
        
        {/* SIGN OUT */}
        <div style={getEntranceStyle(300)}>
          <div 
            className="flex-row gap-12 items-center justify-center clickable mt-8"
            style={{ 
              padding: '16px',
              border: '1px solid rgba(232, 64, 64, 0.2)',
              borderRadius: '12px',
              backgroundColor: 'rgba(232, 64, 64, 0.05)'
            }}
          >
            <SignOut size={20} color="var(--red)" />
            <span className="font-display font-semibold text-[15px] text-red">Sign Out</span>
          </div>
        </div>

      </div>
    </div>
  );
}
