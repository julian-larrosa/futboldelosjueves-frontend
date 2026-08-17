import React, { useState } from 'react';
import { Match } from '../types';

interface MatchesListViewProps {
  matches: Match[];
  onSelectMatch: (matchId: string) => void;
}

export const MatchesListView: React.FC<MatchesListViewProps> = ({ matches, onSelectMatch }) => {
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'FINISHED'>('ALL');

  const filteredMatches = matches.filter((m) => {
    if (filter === 'UPCOMING') return m.status === 'upcoming';
    if (filter === 'FINISHED') return m.status === 'finished';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40] tracking-tight">
            Calendario de Partidos
          </h1>
          <p className="font-body text-[#8D8D7E] text-sm mt-0.5">
            Temporada 2024 • Todos los Jueves
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
      <div className="space-y-4">
        {filteredMatches.map((match) => {
          const isUpcoming = match.status === 'upcoming';

          return (
            <div
              key={match.id}
              onClick={() => onSelectMatch(match.id)}
              className="bg-white rounded-[28px] p-5 md:p-6 card-shadow card-hover border border-[#EBE7DF] cursor-pointer transition-all space-y-4"
            >
              {/* Top metadata */}
              <div className="flex justify-between items-center text-xs font-mono border-b border-[#EBE7DF] pb-3">
                <div className="flex items-center gap-2 text-[#5A5A40] font-bold">
                  <span className="material-symbols-outlined text-[16px] text-[#7B8B6F]">calendar_today</span>
                  <span>{match.date} • {match.time}</span>
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    isUpcoming
                      ? 'bg-[#E2E8DC] text-[#48563F]'
                      : 'bg-[#F1EFE7] text-[#8D8D7E]'
                  }`}
                >
                  {isUpcoming ? 'Próximo' : 'Finalizado'}
                </span>
              </div>

              {/* Scoreline */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Team A */}
                <div className="flex-1 flex justify-end items-center gap-3 w-full sm:w-auto">
                  <span className="font-serif text-base md:text-lg font-bold text-[#5A5A40] text-right truncate">
                    {match.teamA.name}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#F1EFE7] flex items-center justify-center text-[#5A5A40] border border-[#EBE7DF]">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                </div>

                {/* Score */}
                <div className="bg-[#F1EFE7] px-6 py-2 rounded-2xl flex items-center justify-center gap-4 min-w-[130px] border border-[#EBE7DF]">
                  <span className="font-serif text-2xl font-bold text-[#5A5A40]">
                    {isUpcoming ? '-' : match.teamA.score ?? 0}
                  </span>
                  <span className="font-mono text-[#8D8D7E] font-bold">vs</span>
                  <span className="font-serif text-2xl font-bold text-[#5A5A40]">
                    {isUpcoming ? '-' : match.teamB.score ?? 0}
                  </span>
                </div>

                {/* Team B */}
                <div className="flex-1 flex justify-start items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-[#F1EFE7] flex items-center justify-center text-[#7B8B6F] border border-[#EBE7DF]">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <span className="font-serif text-base md:text-lg font-bold text-[#5A5A40] truncate">
                    {match.teamB.name}
                  </span>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="flex items-center justify-between text-xs text-[#8D8D7E] pt-2 border-t border-[#EBE7DF]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {match.location}
                </span>

                <span className="font-mono text-[11px] font-bold text-[#7B8B6F] flex items-center gap-1">
                  <span>Ver Detalle & Stats</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
