import React, { useState } from 'react';
import { Match, Player } from '../types';

interface MatchDetailViewProps {
  match: Match;
  allMatches: Match[];
  onSelectMatch: (matchId: string) => void;
  onSelectPlayer: (playerId: string) => void;
  onOpenEditModal: () => void;
  onOpenRateModal: () => void;
}

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({
  match,
  allMatches,
  onSelectMatch,
  onSelectPlayer,
  onOpenEditModal,
  onOpenRateModal,
}) => {
  const [selectedTeamLineup, setSelectedTeamLineup] = useState<'A' | 'B'>('A');

  const currentLineup = selectedTeamLineup === 'A' ? match.lineupA : match.lineupB;
  const currentTeamName = selectedTeamLineup === 'A' ? match.teamA.name : match.teamB.name;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 pt-2">
      {/* MATCH SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-[24px] border border-[#EBE7DF] card-shadow">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7B8B6F] text-[20px]">sports_soccer</span>
          <span className="font-mono text-xs font-bold text-[#5A5A40] uppercase tracking-wider">Jornada:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {allMatches.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMatch(m.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                m.id === match.id
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#F1EFE7] text-[#8D8D7E] hover:bg-[#EBE7DF] hover:text-[#5A5A40]'
              }`}
            >
              J{m.jornada} ({m.teamA.name.slice(0, 7)} vs {m.teamB.name.slice(0, 7)})
            </button>
          ))}
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40] mb-1">
            Detalle de Partido
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[#8D8D7E] font-body text-sm">
            <span className="material-symbols-outlined text-[18px] text-[#7B8B6F]">calendar_today</span>
            <span className="font-medium text-[#4A4A3F]">{match.date}</span>
            <span className="mx-1">•</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                match.status === 'finished'
                  ? 'bg-[#F1EFE7] text-[#5A5A40]'
                  : 'bg-[#E2E8DC] text-[#48563F]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  match.status === 'finished' ? 'bg-[#8D8D7E]' : 'bg-[#7B8B6F] animate-ping'
                }`}
              ></span>
              {match.status === 'finished' ? 'Finalizado' : 'Próximo Encuentro'}
            </span>
          </div>
        </div>

        {/* Action Button: Editar Resultado / Stats */}
        <button
          onClick={onOpenEditModal}
          className="bg-white hover:bg-[#F1EFE7] text-[#5A5A40] border border-[#EBE7DF] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all card-shadow active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px] text-[#7B8B6F]">edit</span>
          <span>Editar Resultado/Stats</span>
        </button>
      </div>

      {/* MATCH SCOREBOARD CARD */}
      <div className="bg-white rounded-[28px] p-6 md:p-8 card-shadow border border-[#EBE7DF] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="flex items-center justify-between w-full max-w-2xl relative z-10">
          {/* Team A */}
          <div className="flex flex-col items-center gap-3 flex-1 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F1EFE7] flex items-center justify-center border-2 border-[#5A5A40]/30 shadow-xs">
              <span className="material-symbols-outlined text-3xl md:text-4xl text-[#5A5A40]">
                shield
              </span>
            </div>
            <h2 className="font-serif text-base md:text-xl font-bold text-[#5A5A40]">
              {match.teamA.name}
            </h2>
          </div>

          {/* Score & Phase */}
          <div className="flex flex-col items-center px-4 md:px-8">
            <div className="font-serif text-4xl md:text-5xl font-bold text-[#5A5A40] flex items-center gap-3 md:gap-4 tracking-tighter">
              <span>{match.status === 'finished' ? match.teamA.score ?? 0 : '-'}</span>
              <span className="text-[#DCD6C8] font-light">-</span>
              <span>{match.status === 'finished' ? match.teamB.score ?? 0 : '-'}</span>
            </div>
            <span className="font-mono text-xs font-bold text-[#8D8D7E] mt-2 uppercase tracking-wider bg-[#F1EFE7] px-3 py-0.5 rounded-full border border-[#EBE7DF]">
              {match.fase}
            </span>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center gap-3 flex-1 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#F1EFE7] flex items-center justify-center border-2 border-[#7B8B6F]/30 shadow-xs">
              <span className="material-symbols-outlined text-3xl md:text-4xl text-[#7B8B6F]">
                shield
              </span>
            </div>
            <h2 className="font-serif text-base md:text-xl font-bold text-[#5A5A40]">
              {match.teamB.name}
            </h2>
          </div>
        </div>

        {match.mvpName && (
          <div className="mt-4 pt-4 border-t border-[#EBE7DF] w-full flex justify-center">
            <span className="bg-[#E2E8DC] text-[#48563F] px-4 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#7B8B6F]">star</span>
              Jugador del Partido (MVP): {match.mvpName}
            </span>
          </div>
        )}
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GOLEADORES SECTION */}
        <div className="bg-white rounded-[28px] p-6 card-shadow border border-[#EBE7DF] md:col-span-1 flex flex-col">
          <h3 className="font-serif text-base font-bold text-[#5A5A40] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7B8B6F]">sports_soccer</span>
            <span>Goleadores</span>
          </h3>

          <div className="flex flex-col gap-3 flex-grow">
            {match.scorers && match.scorers.length > 0 ? (
              match.scorers.map((scorer, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectPlayer(scorer.playerId)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F7F2]/60 hover:bg-[#F1EFE7] transition-colors border border-[#EBE7DF] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {scorer.avatar ? (
                      <img
                        src={scorer.avatar}
                        alt={scorer.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 bg-[#D2B48C] border border-[#EBE7DF]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#EBE7DF] flex items-center justify-center font-mono text-xs font-bold text-[#5A5A40] shrink-0">
                        {scorer.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-body font-bold text-sm text-[#4A4A3F]">
                        {scorer.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#8D8D7E]">
                        Equipo {scorer.team}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#5A5A40]">
                    <span className="font-serif text-lg font-bold">{scorer.goals}</span>
                    <span className="material-symbols-outlined text-sm text-[#7B8B6F]">sports_soccer</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs font-mono text-[#8D8D7E]">
                Sin goles registrados todavía.
              </div>
            )}
          </div>
        </div>

        {/* ALINEACIONES SECTION */}
        <div className="bg-white rounded-[28px] p-6 card-shadow border border-[#EBE7DF] md:col-span-2">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-serif text-base font-bold text-[#5A5A40] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7B8B6F]">groups</span>
              <span>Alineaciones</span>
            </h3>

            {/* Team A / Team B Tab Switcher */}
            <div className="flex bg-[#F1EFE7] rounded-xl p-1 border border-[#EBE7DF]">
              <button
                onClick={() => setSelectedTeamLineup('A')}
                className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                  selectedTeamLineup === 'A'
                    ? 'bg-white shadow-xs text-[#5A5A40]'
                    : 'text-[#8D8D7E] hover:text-[#5A5A40]'
                }`}
              >
                {match.teamA.name}
              </button>
              <button
                onClick={() => setSelectedTeamLineup('B')}
                className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                  selectedTeamLineup === 'B'
                    ? 'bg-white shadow-xs text-[#5A5A40]'
                    : 'text-[#8D8D7E] hover:text-[#5A5A40]'
                }`}
              >
                {match.teamB.name}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentLineup && currentLineup.length > 0 ? (
              currentLineup.map((player) => (
                <div
                  key={player.id}
                  onClick={() => onSelectPlayer(player.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-[#EBE7DF] bg-[#F9F7F2]/60 hover:bg-[#F1EFE7] transition-colors cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      player.position === 'POR'
                        ? 'bg-[#5A5A40] text-white'
                        : player.position === 'DEF'
                        ? 'bg-[#7B8B6F] text-white'
                        : player.position === 'MED'
                        ? 'bg-[#D2B48C] text-[#5A5A40]'
                        : 'bg-[#A3B18A] text-[#5A5A40]'
                    }`}
                  >
                    {player.position}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body text-sm font-semibold text-[#4A4A3F]">
                      {player.name}
                    </span>
                    {player.number && (
                      <span className="text-[10px] font-mono text-[#8D8D7E]">
                        Dorsal #{player.number}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-6 text-xs font-mono text-[#8D8D7E]">
                Alineación no confirmada para {currentTeamName}.
              </div>
            )}
          </div>
        </div>

        {/* CALIFICACIONES OFICIALES SECTION */}
        <div className="bg-white rounded-[28px] p-6 card-shadow border border-[#EBE7DF] md:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-serif text-base md:text-lg font-bold text-[#5A5A40] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7B8B6F]">star_rate</span>
              <span>Calificaciones Oficiales</span>
            </h3>

            {/* Calificar compañeros Button */}
            <button
              onClick={onOpenRateModal}
              className="bg-[#5A5A40] text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Calificar compañeros</span>
            </button>
          </div>

          {/* Ratings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#EBE7DF] text-[#8D8D7E] bg-[#F9F7F2]/40">
                  <th className="py-3 px-4 font-mono text-xs">Jugador</th>
                  <th className="py-3 px-4 font-mono text-xs text-center">Ritmo</th>
                  <th className="py-3 px-4 font-mono text-xs text-center">Tiro</th>
                  <th className="py-3 px-4 font-mono text-xs text-center">Pase</th>
                  <th className="py-3 px-4 font-mono text-xs text-center">DEF</th>
                  <th className="py-3 px-4 font-mono text-xs text-right">Global</th>
                </tr>
              </thead>
              <tbody className="font-body text-[#4A4A3F]">
                {match.officialRatings && match.officialRatings.length > 0 ? (
                  match.officialRatings.map((rating) => (
                    <tr
                      key={rating.playerId}
                      onClick={() => onSelectPlayer(rating.playerId)}
                      className="border-b border-[#EBE7DF]/70 hover:bg-[#F1EFE7]/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EBE7DF] flex items-center justify-center text-[11px] font-mono font-bold text-[#5A5A40]">
                            {rating.initials}
                          </div>
                          <span className="font-body font-semibold text-sm text-[#4A4A3F]">
                            {rating.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#4A4A3F] text-sm font-semibold">
                        {rating.ritmo}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#4A4A3F] text-sm font-semibold">
                        {rating.tiro}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#4A4A3F] text-sm font-semibold">
                        {rating.pase}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#4A4A3F] text-sm font-semibold">
                        {rating.defensa}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center justify-center font-serif font-bold text-sm px-3 py-1 rounded-full ${
                            rating.global >= 8.5
                              ? 'bg-[#E2E8DC] text-[#48563F]'
                              : 'bg-[#F1EFE7] text-[#5A5A40]'
                          }`}
                        >
                          {rating.global.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-xs font-mono text-[#8D8D7E]">
                      Aún no se han publicado calificaciones para este encuentro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
