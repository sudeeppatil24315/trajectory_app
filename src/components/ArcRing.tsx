import { useEffect, useState } from 'react';

interface ArcRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

export function ArcRing({ value, size = 130, strokeWidth = 8 }: ArcRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [dashoffset, setDashoffset] = useState(circumference);
  
  // unique id for mask
  const maskId = `arc-mask-${value}`;
  
  // Calculate the target dash offset for the pie
  // Since we want 73% fill
  const targetOffset = circumference - (value / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashoffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, targetOffset]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <mask id={maskId}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth={strokeWidth * 2}
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </mask>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={strokeWidth}
          strokeDasharray="4 6"
        />
        {/* Fill Arc (Masked) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={strokeWidth}
          strokeDasharray="4 6"
          mask={`url(#${maskId})`}
        />
      </svg>
      {/* The glowing dot at the tip of the filled arc 
          Math for dot position on the circle based on value percentage */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: `translate(-50%, -50%) rotate(${(value / 100) * 360}deg)`,
          transition: 'transform 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {/* Dot placed at 'top' of the rotated container */}
          <div style={{
            position: 'absolute',
            top: `${strokeWidth / 2 - 1}px`, // Slight adjustment
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 8px var(--accent)'
          }} />
        </div>
      </div>
    </div>
  );
}
