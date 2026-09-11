import React from 'react';
import { Skeleton, SkeletonCard } from './motion/Skeleton';

interface LoadingStateProps {
  label?: string;
  variant?: 'spinner' | 'cards' | 'table' | 'list';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Cargando...',
  variant = 'spinner',
}) => {
  return (
    <div className="w-full" aria-busy="true" aria-live="polite">
      {variant === 'spinner' && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#EBE7DF] border-t-[#7B8B6F] animate-spin"></div>
          <span className="font-mono text-xs font-bold text-[#8D8D7E] uppercase tracking-wider">
            {label}
          </span>
        </div>
      )}

      {variant === 'cards' && (
        <div className="space-y-6" aria-hidden="true">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[28px] p-6 border border-[#EBE7DF]">
                <Skeleton variant="card" className="h-10 w-40 mb-4" />
                <Skeleton variant="line" className="w-full" />
                <Skeleton variant="line" className="w-3/4 mt-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {variant === 'list' && (
        <div className="space-y-4" aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[28px] p-5 md:p-6 border border-[#EBE7DF] space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton variant="text" className="w-36" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton variant="line" className="w-24" />
                <Skeleton className="h-9 w-32 rounded-2xl" />
                <Skeleton variant="line" className="w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="text" className="w-28" />
                <Skeleton variant="text" className="w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'table' && (
        <div className="space-y-6" aria-hidden="true">
          <div className="bg-white rounded-[28px] overflow-hidden border border-[#EBE7DF]">
            <div className="p-4 border-b border-[#EBE7DF]">
              <Skeleton className="h-5 w-44" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-[#EBE7DF]/70">
                <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
                <Skeleton variant="line" className="flex-1 max-w-xs" />
                <Skeleton variant="text" className="w-10" />
                <Skeleton variant="text" className="w-10" />
                <Skeleton variant="text" className="w-10" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="anim-fade-in bg-white rounded-[28px] p-8 card-shadow border border-[#EBE7DF] flex flex-col items-center text-center gap-3">
    <span className="material-symbols-outlined text-3xl text-[#D97B66]">error</span>
    <p className="font-body text-sm text-[#4A4A3F]">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-[#5A5A40] text-white font-mono text-xs font-bold hover:opacity-90 transition-all active:scale-95"
      >
        Reintentar
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="anim-fade-in bg-white rounded-[28px] p-8 card-shadow border border-[#EBE7DF] text-center">
    <span className="material-symbols-outlined text-3xl text-[#A3A395] block mb-2">
      info
    </span>
    <p className="font-body text-xs text-[#8D8D7E]">{message}</p>
  </div>
);