import React, { useState } from 'react';
import { Player } from '../types';
import { SEASON_STATS } from '../data/mockData';

interface RankingsViewProps {
  players: Player[];
  onSelectPlayer: (playerId: string) => void;
}

type TabType = 'PUNTOS' | 'GOLEADORES' | 'RATING' | 'ESTADO DE FORMA';

export const RankingsView: React.FC<RankingsViewProps> = ({ players, onSelectPlayer }) => {
  const [activeTab, setActiveTab] = useState<TabType>('RATING');
  const [positionFilter, setPositionFilter] = useState<string>('TODOS');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [expandedView, setExpandedView] = useState(false);

  // Sorting logic based on active tab
  const sortedPlayers = [...players].sort((a, b) => {
    if (activeTab === 'PUNTOS') return b.points - a.points;
    if (activeTab === 'GOLEADORES') return b.goals - a.goals;
    if (activeTab === 'ESTADO DE FORMA') {
      const formaOrder = { up: 3, neutral: 2, down: 1 };
      return formaOrder[b.forma] - formaOrder[a.forma] || b.rating - a.rating;
    }
    // Default: RATING
    return b.rating - a.rating;
  });

  const filteredPlayers = sortedPlayers.filter((p) => {
    if (positionFilter === 'TODOS') return true;
    return p.position === positionFilter;
  });

  const displayList = expandedView ? filteredPlayers : filteredPlayers.slice(0, 6);

  // Top scorers list for bar widget
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 4);
  const maxGoals = Math.max(...topScorers.map((p) => p.goals), 1);

  return (
    <div className="space-y-6 pb-12">
      {/* PAGE HEADER */}
      <section className="pt-2">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40] tracking-tight">
          Estadísticas Globales
        </h1>
        <p className="font-body text-[#8D8D7E] text-sm mt-1">{SEASON_STATS.seasonName}</p>
      </section>

      {/* HORIZONTAL TABS */}
      <nav className="overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-6 border-b border-[#EBE7DF] w-max min-w-full pb-0.5">
          {(['PUNTOS', 'GOLEADORES', 'RATING', 'ESTADO DE FORMA'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-mono text-xs tracking-wider font-bold pb-2.5 transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'text-[#5A5A40] border-b-2 border-[#5A5A40]'
                    : 'text-[#8D8D7E] hover:text-[#5A5A40]'
                }`}
              >
                {tab}
                {tab === 'RATING' && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-[#D97B66] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* MAIN TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* MAIN COLUMN: RANKING TABLE */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-[28px] card-shadow overflow-hidden border border-[#EBE7DF]">
            {/* Table Header / Filter Bar */}
            <div className="p-4 border-b border-[#EBE7DF] bg-[#F1EFE7]/50 flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#5A5A40]">Ranking General</h2>
                {positionFilter !== 'TODOS' && (
                  <span className="px-2.5 py-0.5 bg-[#E2E8DC] text-[#48563F] rounded-full text-[10px] font-mono font-bold">
                    {positionFilter}
                  </span>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="text-[#5A5A40] font-mono text-xs font-bold flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-white px-3 py-1.5 rounded-xl border border-[#EBE7DF] shadow-xs"
                >
                  <span>FILTRAR</span>
                  <span className="material-symbols-outlined text-[16px] text-[#7B8B6F]">filter_list</span>
                </button>

                {/* Filter Dropdown */}
                {showFilterMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EBE7DF] py-2 z-30">
                    <div className="px-3 py-1 text-[10px] font-mono text-[#8D8D7E] font-bold uppercase tracking-wider">
                      Posición
                    </div>
                    {['TODOS', 'DEL', 'MED', 'DEF', 'POR'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => {
                          setPositionFilter(pos);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#F1EFE7] transition-colors ${
                          positionFilter === pos
                            ? 'font-bold text-[#5A5A40] bg-[#F1EFE7]'
                            : 'text-[#4A4A3F]'
                        }`}
                      >
                        <span>{pos === 'TODOS' ? 'Todas las posiciones' : pos}</span>
                        {positionFilter === pos && (
                          <span className="material-symbols-outlined text-[14px] text-[#7B8B6F]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#EBE7DF] bg-[#F9F7F2]/40 text-[#8D8D7E]">
                    <th className="py-3 px-4 font-mono text-xs text-center w-12">#</th>
                    <th className="py-3 px-4 font-mono text-xs">JUGADOR</th>
                    <th className="py-3 px-4 font-mono text-xs text-center w-16">PJ</th>
                    <th className="py-3 px-4 font-mono text-xs text-center w-16">G</th>
                    <th className="py-3 px-4 font-mono text-xs text-[#5A5A40] text-center w-20">RATING</th>
                    <th className="py-3 px-4 font-mono text-xs text-center w-24">FORMA</th>
                  </tr>
                </thead>
                <tbody className="font-body text-[#4A4A3F]">
                  {displayList.map((player, index) => {
                    const isCurrentUser = player.isCurrentUser;
                    const rankNum = index + 1;

                    return (
                      <tr
                        key={player.id}
                        onClick={() => onSelectPlayer(player.id)}
                        className={`border-b border-[#EBE7DF]/70 table-row-hover transition-all duration-150 cursor-pointer ${
                          isCurrentUser
                            ? 'border-l-4 border-l-[#5A5A40] bg-[#F1EFE7]/50'
                            : ''
                        }`}
                      >
                        {/* Rank */}
                        <td
                          className={`py-3.5 px-4 text-center font-serif text-[15px] font-bold ${
                            isCurrentUser ? 'text-[#5A5A40]' : 'text-[#8D8D7E]'
                          }`}
                        >
                          {rankNum}
                        </td>

                        {/* Player */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {player.avatar ? (
                              <div
                                className={`w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[#D2B48C] ${
                                  isCurrentUser ? 'border-2 border-[#5A5A40]' : ''
                                }`}
                              >
                                <img
                                  src={player.avatar}
                                  alt={player.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#EBE7DF] flex items-center justify-center text-[#5A5A40] font-mono text-xs font-bold shrink-0">
                                {player.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span
                                className={`truncate max-w-[140px] sm:max-w-[200px] text-sm ${
                                  isCurrentUser
                                    ? 'font-bold text-[#5A5A40]'
                                    : 'font-semibold text-[#4A4A3F]'
                                }`}
                              >
                                {player.name} {isCurrentUser ? '(Tú)' : ''}
                              </span>
                              <span className="text-[10px] font-mono text-[#8D8D7E]">
                                {player.position} • {player.points} pts
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* PJ */}
                        <td className="py-3.5 px-4 text-center text-[#4A4A3F] text-sm font-medium">
                          {player.matchesPlayed}
                        </td>

                        {/* G */}
                        <td className="py-3.5 px-4 text-center font-semibold text-sm">
                          {player.goals}
                        </td>

                        {/* Rating */}
                        <td className="py-3.5 px-4 text-center font-serif text-[16px] font-bold text-[#5A5A40]">
                          {player.rating.toFixed(1)}
                        </td>

                        {/* Forma Trend */}
                        <td className="py-3.5 px-4 text-center">
                          {player.forma === 'up' && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E2E8DC] text-[#48563F]">
                              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                            </span>
                          )}
                          {player.forma === 'neutral' && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F1EFE7] text-[#8D8D7E]">
                              <span className="material-symbols-outlined text-[16px]">horizontal_rule</span>
                            </span>
                          )}
                          {player.forma === 'down' && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FFEBE5] text-[#D97B66]">
                              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-3 text-center border-t border-[#EBE7DF] bg-[#F1EFE7]/40">
              <button
                onClick={() => setExpandedView(!expandedView)}
                className="font-mono text-xs font-bold text-[#7B8B6F] hover:underline uppercase tracking-wider"
              >
                {expandedView ? 'MOSTRAR MENOS' : 'VER RANKING COMPLETO'}
              </button>
            </div>
          </div>
        </div>

        {/* SECONDARY COLUMN: CHARTS & STATS */}
        <div className="flex flex-col gap-6">
          {/* Bar Chart: Top Goleadores */}
          <div className="bg-white rounded-[28px] card-shadow p-5 md:p-6 border border-[#EBE7DF]">
            <h3 className="font-serif text-base font-bold mb-4 text-[#5A5A40] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7B8B6F] text-[20px]">sports_soccer</span>
              Top Goleadores del Torneo
            </h3>

            <div className="flex flex-col gap-4">
              {topScorers.map((scorer, idx) => {
                const percentage = Math.min(100, Math.round((scorer.goals / maxGoals) * 100));
                const isLeader = idx === 0;

                return (
                  <div
                    key={scorer.id}
                    onClick={() => onSelectPlayer(scorer.id)}
                    className="cursor-pointer group"
                  >
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#4A4A3F] group-hover:text-[#5A5A40] transition-colors">
                        {scorer.name.slice(0, 1)}. {scorer.name.split(' ')[1] || scorer.name}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          isLeader ? 'text-[#7B8B6F]' : 'text-[#8D8D7E]'
                        }`}
                      >
                        {scorer.goals}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F1EFE7] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isLeader
                            ? 'bg-[#5A5A40]'
                            : idx === 1
                            ? 'bg-[#7B8B6F]'
                            : 'bg-[#D2B48C]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Season Stats Grid */}
          <div>
            <h3 className="font-serif text-base font-bold mb-3 text-[#5A5A40] px-1">
              Estadísticas de Temporada
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Stat Card 1 */}
              <div className="bg-white rounded-[24px] card-shadow p-4 md:p-5 flex flex-col items-center justify-center text-center border border-[#EBE7DF] hover:bg-[#F1EFE7] transition-colors">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] mb-1 tracking-tight">
                  {SEASON_STATS.totalMatches}
                </span>
                <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
                  Total Partidos
                </span>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white rounded-[24px] card-shadow p-4 md:p-5 flex flex-col items-center justify-center text-center border border-[#EBE7DF] hover:bg-[#F1EFE7] transition-colors">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#7B8B6F] mb-1 tracking-tight">
                  {SEASON_STATS.goalsPerMatch.toFixed(1)}
                </span>
                <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
                  Goles / Partido
                </span>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white rounded-[24px] card-shadow p-4 md:p-5 flex flex-col items-center justify-center text-center border border-[#EBE7DF] hover:bg-[#F1EFE7] transition-colors">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] mb-1 tracking-tight">
                  {SEASON_STATS.activePlayers}
                </span>
                <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
                  Jugadores Activos
                </span>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white rounded-[24px] card-shadow p-4 md:p-5 flex flex-col items-center justify-center text-center border border-[#EBE7DF] hover:bg-[#F1EFE7] transition-colors">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#D2B48C] mb-1 tracking-tight">
                  {SEASON_STATS.matchdaysAvailable}
                </span>
                <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
                  Jornadas Disp.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
