import { useEffect, useState, useRef } from 'react';
import { House, Flame, ChatCircle, User } from '@phosphor-icons/react';

interface BottomNavProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [pillStyle, setPillStyle] = useState({ transform: 'translateX(0)', width: '64px' });
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);

  const tabs = [
    { icon: House, label: 'Dashboard' },
    { icon: Flame, label: 'Feed' },
    { icon: ChatCircle, label: 'Messages' },
    { icon: User, label: 'Profile' }
  ];

  useEffect(() => {
    // Calculate the position for the pill to slide to
    const activeTabElement = tabsRef.current[activeTab];
    if (activeTabElement) {
      const containerRect = activeTabElement.parentElement?.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      
      if (containerRect) {
        // Center the pill exactly in the tab
        const offsetLeft = tabRect.left - containerRect.left;
        const pillWidth = 64; 
        const centerOffset = offsetLeft + (tabRect.width / 2) - (pillWidth / 2);
        
        setPillStyle({
          transform: `translateX(${centerOffset}px)`,
          width: `${pillWidth}px`
        });
      }
    }
  }, [activeTab]);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 'var(--screen-width)',
        height: '82px', /* 48px + 34px safe area */
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(32px) saturate(150%)',
        WebkitBackdropFilter: 'blur(32px) saturate(150%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'row',
        zIndex: 100,
        paddingBottom: '34px'
      }}
    >
      {/* Active Tab Background Pill */}
      <div 
        style={{
          position: 'absolute',
          top: '7px',
          height: '34px',
          borderRadius: '100px',
          backgroundColor: 'var(--accent)',
          opacity: 0.15,
          transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
          ...pillStyle
        }}
      />

      {tabs.map((tab, index) => {
        const isActive = index === activeTab;
        const IconComponent = tab.icon;
        
        return (
          <div
            key={index}
            ref={el => { tabsRef.current[index] = el; }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '48px',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={() => onTabChange(index)}
          >
            {/* Icon Wrapper for bounce animation */}
            <div 
              style={{ 
                color: isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.45)',
                transition: 'color 180ms ease, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconComponent size={24} weight="regular" />
            </div>
            
            {/* Label and dot */}
            <div 
              className="font-display"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--accent)',
                letterSpacing: '0.02em',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 150ms ease, transform 150ms ease',
                position: 'absolute',
                bottom: '6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {tab.label}
              <div 
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent)',
                  marginTop: '1px'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
