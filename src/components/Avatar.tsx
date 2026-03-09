

interface AvatarProps {
  initials: string;
  size?: number;
  glow?: boolean;
  ring?: boolean;
}

export function Avatar({ initials, size = 36, glow = false, ring = false }: AvatarProps) {
  return (
    <div 
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--accent)',
        color: 'var(--base)',
        boxShadow: glow ? 'var(--shadow-focus)' : 'none',
      }}
      className="font-display font-bold"
    >
      {ring && (
        <div 
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            right: '-5px',
            bottom: '-5px',
            borderRadius: '50%',
            border: '2px solid var(--accent)',
            pointerEvents: 'none'
          }}
        />
      )}
      
      <span style={{ fontSize: `${size * 0.4}px` }}>{initials}</span>
    </div>
  );
}
