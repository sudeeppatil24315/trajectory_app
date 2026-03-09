import { useEffect, useState } from 'react';

interface DecryptTextProps {
  text: string | number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#_0123456789';

export const DecryptText = ({ text, duration = 800, className = '', style = {} }: DecryptTextProps) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const targetString = String(text);
    
    // Initial randomized string will be set in the timeout

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Calculate how many characters should be "resolved" to the real text
      const resolvedCount = Math.floor(progress * targetString.length);
      
      let newText = '';
      for (let i = 0; i < targetString.length; i++) {
        if (i < resolvedCount) {
          newText += targetString[i];
        } else {
          newText += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      
      setDisplayText(newText);
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    // Small timeout to allow initial render
    const t = setTimeout(() => {
      setDisplayText(
        Array(targetString.length)
          .fill(0)
          .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
          .join('')
      );
      animationFrameId = window.requestAnimationFrame(step);
    }, 50);

    return () => {
      clearTimeout(t);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [text, duration]);

  return (
    <span className={className} style={{ ...style, fontVariantNumeric: 'tabular-nums' }}>
      {displayText}
    </span>
  );
};
