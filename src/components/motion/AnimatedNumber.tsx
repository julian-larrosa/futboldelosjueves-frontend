import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Contador animado (count-up) desde 0 hasta value con ease-out.
 * Con prefers-reduced-motion muestra directamente el valor final.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  duration = 800,
  className,
}) => {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration, reduced]);

  return <span className={className}>{display.toFixed(decimals)}</span>;
};