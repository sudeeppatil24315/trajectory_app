import type { ReactNode } from 'react';

interface TopHeaderProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  scrolled?: boolean;
}

export function TopHeader({ left, center, right, scrolled = false }: TopHeaderProps) {
  return (
    <div 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--bg-margin)',
        paddingTop: 'var(--safe-top)',
        boxSizing: 'content-box',
        backgroundColor: 'rgba(5, 5, 5, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
        transition: 'border-bottom 0.2s',
      }}
    >
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        {left}
      </div>
      
      <div style={{ flex: 2, display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
        {center}
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {right}
      </div>
    </div>
  );
}
