import React from 'react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  totalElements,
  hasNext,
  hasPrevious,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-xs font-mono text-[#8D8D7E]">
        Página {page + 1} de {totalPages} ({totalElements} resultados)
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-[#EBE7DF] bg-white text-[#5A5A40] hover:bg-[#F1EFE7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-[#EBE7DF] bg-white text-[#5A5A40] hover:bg-[#F1EFE7] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
