import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color: string;
  delay?: number; // Animation trigger delay in ms
}

export function ProgressBar({ value, color, delay = 0 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(value);
    }, delay + 50); // slight offset so UI mounts first
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div style={{
      width: '100%',
      height: '6px',
      borderRadius: '100px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, var(--base) 4px, var(--base) 6px)'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${width}%`,
        backgroundColor: color,
        borderRadius: '100px',
        transition: 'width 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
      }} />
    </div>
  );
}
