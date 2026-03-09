import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'normal' | 'large';
}

export function Card({ children, className = '', onClick, padding = 'normal' }: CardProps) {
  // We use vanilla CSS for maximum control
  const paddingStyle = padding === 'none' ? '0' : padding === 'large' ? '24px' : 'var(--inner-padding)';
  
  return (
    <div 
      className={`surface-card ${onClick ? 'clickable' : ''} ${className}`}
      style={{ padding: paddingStyle }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
