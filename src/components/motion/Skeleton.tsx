import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'line';
  className?: string;
}

/**
 * Bloque shimmer para estados de carga. Las dimensiones base se pasan
 * vía className (w-/h-); los variantes solo dan forma por defecto.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'card', className = '' }) => {
  const baseShape =
    variant === 'text'
      ? 'h-3.5 rounded-full'
      : variant === 'line'
        ? 'h-4 rounded-md'
        : variant === 'circle'
          ? 'rounded-full'
          : 'rounded-[16px]';

  return <div className={`skeleton ${baseShape} ${className}`} aria-hidden="true" />;
};

/** Card de stats con forma tipo dashboard para skeletos de carga. */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-[24px] p-5 border border-[#EBE7DF] ${className}`}>
    <Skeleton variant="line" className="h-9 w-14 mb-2" />
    <Skeleton variant="text" className="w-20" />
  </div>
);