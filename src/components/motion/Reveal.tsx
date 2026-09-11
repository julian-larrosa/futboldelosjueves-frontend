import React from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Wrapper de animación de entrada (fade-up) al montar. El retraso se aplica
 * inline vía animation-delay; prefers-reduced-motion se resuelve en CSS.
 */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = '' }) => (
  <div
    className={`anim-fade-up ${className}`}
    style={delay ? { animationDelay: `${delay}ms` } : undefined}
  >
    {children}
  </div>
);