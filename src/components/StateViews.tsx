import React from 'react';

export const LoadingState: React.FC<{ label?: string }> = ({ label = 'Cargando...' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
    <div className="w-10 h-10 rounded-full border-4 border-[#EBE7DF] border-t-[#7B8B6F] animate-spin"></div>
    <span className="font-mono text-xs font-bold text-[#8D8D7E] uppercase tracking-wider">
      {label}
    </span>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="bg-white rounded-[28px] p-8 card-shadow border border-[#EBE7DF] flex flex-col items-center text-center gap-3">
    <span className="material-symbols-outlined text-3xl text-[#D97B66]">error</span>
    <p className="font-body text-sm text-[#4A4A3F]">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-[#5A5A40] text-white font-mono text-xs font-bold hover:opacity-90 transition-all"
      >
        Reintentar
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-white rounded-[28px] p-8 card-shadow border border-[#EBE7DF] text-center">
    <span className="material-symbols-outlined text-3xl text-[#A3A395] block mb-2">
      info
    </span>
    <p className="font-body text-xs text-[#8D8D7E]">{message}</p>
  </div>
);