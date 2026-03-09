import type { ReactNode } from 'react';

interface StatusBadgeProps {
  text: string;
  status: 'high' | 'medium' | 'low' | 'neutral' | 'accent' | 'amber' | 'red';
  icon?: ReactNode;
  className?: string;
  size?: 'small' | 'normal';
}

export function StatusBadge({ text, status, icon, className = '', size = 'normal' }: StatusBadgeProps) {
  let bgColor = 'var(--surface-plus-1)';
  let textColor = 'var(--text-muted)';
  
  switch (status) {
    case 'high':
    case 'accent':
      bgColor = 'var(--accent)';
      textColor = 'var(--base)';
      break;
    case 'medium':
    case 'amber':
      bgColor = 'var(--amber)';
      textColor = '#111';
      break;
    case 'low':
    case 'red':
      bgColor = 'var(--red)';
      textColor = 'white';
      break;
    case 'neutral':
      break;
  }
  
  // For the tag elements (like HIGH EMPLOYABILITY pill)
  const isSmall = size === 'small';
  
  return (
    <div 
      className={`status-badge flex-row font-mono ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: isSmall ? '3px 8px' : '5px 12px',
        borderRadius: '100px',
        fontSize: isSmall ? '10px' : '11px',
        fontWeight: isSmall ? '400' : '600',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        width: 'fit-content',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {icon && <span style={{ marginRight: '4px', display: 'flex' }}>{icon}</span>}
      {text}
    </div>
  );
}
