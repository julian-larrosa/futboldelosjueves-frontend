import React, { useCallback, useState } from 'react';
import { hinchasApi } from '../api';
import type { HinchaResponse } from '../api';
import { usePaginatedApi } from '../hooks/usePaginatedApi';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import { PaginationControls } from './PaginationControls';
import { ResetPasswordModal } from './ResetPasswordModal';
import { getInitials } from '../utils/format';

export const HinchasAdminView: React.FC = () => {
  const fetcher = useCallback(
    (page: number, size: number) => hinchasApi.list({ page, size }),
    [],
  );
  const { data, loading, error, page, totalElements, totalPages, hasNext, hasPrevious, goToPage, refetch } =
    usePaginatedApi<HinchaResponse>(fetcher, 10);

  const [resetTarget, setResetTarget] = useState<HinchaResponse | null>(null);

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40] tracking-tight">
          Hinchas
        </h1>
        <p className="font-body text-[#8D8D7E] text-sm mt-0.5">
          Cuentas de hinchas registradas ({totalElements})
        </p>
      </div>

      {loading && <LoadingState label="Cargando hinchas..." />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (data?.length ?? 0) > 0 && (
        <div className="space-y-2.5">
          {data!.map((hincha) => (
            <div
              key={hincha.id}
              className="bg-white rounded-[24px] p-4 card-shadow border border-[#EBE7DF] flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBE7DF] flex items-center justify-center font-mono text-xs font-bold text-[#5A5A40] shrink-0">
                  {getInitials(`${hincha.nombre} ${hincha.apellido}`)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body text-sm font-semibold text-[#4A4A3F] truncate">
                    {hincha.nombre} {hincha.apellido}
                  </span>
                  <span className="font-mono text-xs text-[#8D8D7E] truncate">
                    @{hincha.username} · {hincha.email}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    hincha.activo
                      ? 'text-[#48563F] bg-[#E2E8DC] border-[#C9D3BF]'
                      : 'text-[#C2623F] bg-[#FFEBE5] border-[#D97B66]/30'
                  }`}
                >
                  {hincha.activo ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  onClick={() => setResetTarget(hincha)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-[#5A5A40] border border-[#EBE7DF] bg-white hover:bg-[#F1EFE7] transition-all active:scale-95"
                  title="Restablecer contraseña"
                >
                  <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                  <span>Restablecer</span>
                </button>
              </div>
            </div>
          ))}

          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageChange={goToPage}
          />
        </div>
      )}

      {!loading && !error && (data?.length ?? 0) === 0 && (
        <EmptyState message="Todavía no hay hinchas registrados." />
      )}

      <ResetPasswordModal
        isOpen={resetTarget !== null}
        defaultEmail={resetTarget?.email ?? ''}
        onClose={() => setResetTarget(null)}
      />
    </div>
  );
};
