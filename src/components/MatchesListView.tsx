import React, { useState } from 'react';
import { MatchResponse, MatchStatus, matchesApi } from '../api';
import { useApi } from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import { formatMatchDate, formatMatchTime } from '../utils/format';

interface MatchesListViewProps {
  onSelectMatch: (matchId: string) => void;
}

type FilterType = 'ALL' | 'UPCOMING' | 'FINISHED';

const UPCOMING_STATUSES: MatchStatus[] = [
  'PROGRAMADO',
  'CONVOCATORIA_ABIERTA',
  'CONVOCATORIA_CERRADA',
  'EN_CURSO',
];

const STATUS_LABEL: Record<MatchStatus, string> = {
  PROGRAMADO: 'Programado',
  CONVOCATORIA_ABIERTA: 'Convocatoria abierta',
  CONVOCATORIA_CERRADA: 'Convocatoria cerrada',
  EN_CURSO: 'En curso',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export const MatchesListView: React.FC<MatchesListViewProps> = ({ onSelectMatch }) => {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const fetcher = React.useCallback(() => matchesApi.list({ size: 200 }), []);
  const { data, loading, error, refetch } = useApi(fetcher);

  if (loading) {
    return <LoadingState label="Cargando partidos..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const matches = data?.content ?? [];

  const filteredMatches = matches.filter((m) => {
    if (filter === 'UPCOMING') return UPCOMING_STATUSES.includes(m.estado);
    if (filter === 'FINISHED') return m.estado === 'FINALIZADO';
    return true;
  });

  const hasScore = (m: MatchResponse) => m.golesEquipoA !== null && m.golesEquipoB !== null;

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40] tracking-tight">
            Calendario de Partidos
          </h1>
          <p className="font-body text-[#8D8D7E] text-sm mt-0.5">
            {matches.length} partidos registrados en la liga
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#EBE7DF] card-shadow">
          {(['ALL', 'UPCOMING', 'FINISHED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                filter === tab
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#8D8D7E] hover:text-[#5A5A40]'
              }`}
            >
              {tab === 'ALL' ? 'Todos' : tab === 'UPCOMING' ? 'Próximos' : 'Finalizados'}
            </button>
          ))}
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => onSelectMatch(String(match.id))}
              className="bg-white rounded-[28px] p-5 md:p-6 card-shadow card-hover border border-[#EBE7DF] cursor-pointer transition-all space-y-4"
            >
              {/* Top metadata */}
              <div className="flex justify-between items-center text-xs font-mono border-b border-[#EBE7DF] pb-3">
                <div className="flex items-center gap-2 text-[#5A5A40] font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#7B8B6F]">calendar_today</span>
                  <span>{formatMatchDate(match.fechaHora)} • {formatMatchTime(match.fechaHora)}</span>
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    match.estado === 'FINALIZADO'
                      ? 'bg-[#F1EFE7] text-[#8D8D7E]'
                      : match.estado === 'CANCELADO'
                      ? 'bg-[#FFEBE5] text-[#D97B66]'
                      : 'bg-[#E2E8DC] text-[#48563F]'
                  }`}
                >
                  {STATUS_LABEL[match.estado]}
                </span>
              </div>

              {/* Scoreline */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Team A */}
                <div className="flex-1 flex justify-end items-center gap-3 w-full sm:w-auto">
                  <span className="font-serif text-base md:text-lg font-bold text-[#5A5A40] text-right truncate">
                    Equipo A
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#F1EFE7] flex items-center justify-center text-[#5A5A40] border border-[#EBE7DF]">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                </div>

                {/* Score */}
                <div className="bg-[#F1EFE7] px-6 py-2 rounded-2xl flex items-center justify-center gap-4 min-w-[130px] border border-[#EBE7DF]">
                  <span className="font-serif text-2xl font-bold text-[#5A5A40]">
                    {hasScore(match) ? match.golesEquipoA : '-'}
                  </span>
                  <span className="font-mono text-[#8D8D7E] font-bold">vs</span>
                  <span className="font-serif text-2xl font-bold text-[#5A5A40]">
                    {hasScore(match) ? match.golesEquipoB : '-'}
                  </span>
                </div>

                {/* Team B */}
                <div className="flex-1 flex justify-start items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-[#F1EFE7] flex items-center justify-center text-[#7B8B6F] border border-[#EBE7DF]">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <span className="font-serif text-base md:text-lg font-bold text-[#5A5A40] truncate">
                    Equipo B
                  </span>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="flex items-center justify-between text-xs text-[#8D8D7E] pt-2 border-t border-[#EBE7DF]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {match.lugar || 'Sin lugar definido'}
                </span>

                <span className="font-mono text-[11px] font-bold text-[#7B8B6F] flex items-center gap-1">
                  <span>Ver Detalle & Stats</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No hay partidos que coincidan con el filtro seleccionado." />
      )}
    </div>
  );
};