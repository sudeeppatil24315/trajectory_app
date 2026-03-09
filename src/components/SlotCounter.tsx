import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function NumberColumn({ value }: { value: number }) {
  const animatedValue = useSpring(value, { stiffness: 100, damping: 20 });
  
  useEffect(() => {
    animatedValue.set(value);
  }, [animatedValue, value]);

  const y = useTransform(animatedValue, (latest) => `-${latest * 10}%`);

  return (
    <div style={{ height: '1em', overflow: 'hidden', display: 'inline-block', lineHeight: 1 }}>
      <motion.div style={{ y, display: 'flex', flexDirection: 'column', height: '10em' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} style={{ height: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {num}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function SlotCounter({ value }: { value: number }) {
  const valueStr = value.toString().padStart(2, '0');
  const tens = parseInt(valueStr[0]);
  const units = parseInt(valueStr[1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
      <NumberColumn value={tens} />
      <NumberColumn value={units} />
    </div>
  );
}
