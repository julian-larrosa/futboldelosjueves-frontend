import React, { useEffect, useState } from 'react';
import { NavTab, Player } from '../types';
import { MatchResponse, matchesApi, statisticsApi, toPlayerStatistics } from '../api';
import { useApi } from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import { formatMatchDate, formatMatchTime, formatShortDate } from '../utils/format';

interface DashboardViewProps {
  currentUser: Player;
  currentPlayerId: number;
  onSelectMatch: (matchId: string) => void;
  onOpenRatingForMatch: (matchId: string) => void;
  setActiveTab: (tab: NavTab) => void;
}

const FINISHED_STATUS = 'FINALIZADO';
const CANCELLED_STATUS = 'CANCELADO';

function isUpcomingMatch(match: MatchResponse): boolean {
  return match.estado !== FINISHED_STATUS && match.estado !== CANCELLED_STATUS;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  currentPlayerId,
  onSelectMatch,
  onOpenRatingForMatch,
  setActiveTab,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statsFetcher = React.useCallback(
    () => statisticsApi.getPlayerStatistics(currentPlayerId),
    [currentPlayerId],
  );
  const statsQuery = useApi(statsFetcher);
  const stats = statsQuery.data ? toPlayerStatistics(statsQuery.data) : null;

  const matchesFetcher = React.useCallback(() => matchesApi.list({ size: 200 }), []);
  const matchesQuery = useApi(matchesFetcher);

  if (matchesQuery.loading || statsQuery.loading) {
    return <LoadingState label="Cargando dashboard..." />;
  }

  if (matchesQuery.error || statsQuery.error) {
    return (
      <ErrorState
        message={matchesQuery.error ?? statsQuery.error ?? 'Error al cargar los datos.'}
        onRetry={matchesQuery.refetch}
      />
    );
  }

  const matches = matchesQuery.data?.content ?? [];
  const finishedMatches = matches.filter((m) => m.estado === FINISHED_STATUS);
  const upcomingCandidates = matches.filter(isUpcomingMatch).sort(
    (a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime(),
  );
  const upcomingMatch = upcomingCandidates.find(
    (m) => new Date(m.fechaHora).getTime() >= now,
  ) ?? upcomingCandidates[0];

  const latestFinished = finishedMatches[0];

  const targetTime = upcomingMatch ? new Date(upcomingMatch.fechaHora).getTime() : null;
  const diff = targetTime !== null ? Math.max(0, targetTime - now) : 0;
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title for Desktop */}
      <section className="pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40] tracking-tight">
              Dashboard Principal
            </h1>
            <p className="font-body text-[#8D8D7E] text-sm mt-0.5">
              Bienvenido de vuelta, {currentUser.name}. Liga FDLJ.
            </p>
          </div>

          {/* Quick shortcuts */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('rankings')}
              className="px-4 py-2 bg-white border border-[#EBE7DF] rounded-xl text-xs font-mono font-bold text-[#5A5A40] hover:bg-[#F1EFE7] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#7B8B6F]">leaderboard</span>
              Ver Posiciones
            </button>
            {latestFinished && (
              <button
                onClick={() => onOpenRatingForMatch(String(latestFinished.id))}
                className="px-4 py-2 bg-[#5A5A40] rounded-xl text-xs font-mono font-bold text-white hover:bg-[#484833] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                Calificar último
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Próximo Partido Bento Card */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40]">
            Próximo Partido
          </h2>
          <span className="w-2 h-2 rounded-full bg-[#7B8B6F] animate-pulse"></span>
        </div>

        {upcomingMatch ? (
          <div className="bg-white rounded-[28px] p-6 md:p-8 card-shadow border border-[#EBE7DF] relative overflow-hidden">
            {/* Abstract Decorative Graphic */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#7B8B6F]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#7B8B6F] text-[18px]">calendar_today</span>
                  <span className="font-mono text-xs font-bold text-[#7B8B6F] tracking-wider uppercase">
                    {formatMatchDate(upcomingMatch.fechaHora)}, {formatMatchTime(upcomingMatch.fechaHora)}
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40]">
                  Partido Oficial
                </h3>
                <p className="font-body text-[#8D8D7E] text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#A3A395]">location_on</span>
                  {upcomingMatch.lugar || 'Sin lugar definido'}
                </p>

                {/* Matchup preview */}
                <div className="flex items-center gap-4 pt-3 mt-2 border-t border-[#F1EFE7]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#7B8B6F]"></span>
                    <span className="font-semibold text-sm text-[#4A4A3F]">Equipo A</span>
                  </div>
                  <span className="font-mono text-xs text-[#A3A395] font-bold">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D2B48C]"></span>
                    <span className="font-semibold text-sm text-[#4A4A3F]">Equipo B</span>
                  </div>
                </div>
              </div>

              {/* Countdown widget */}
              <div className="bg-[#F1EFE7] rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center min-w-[150px] border border-[#EBE7DF]">
                <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight tabular-nums">
                  {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#8D8D7E] mt-1">
                  Horas : Minutos
                </span>
                <span className="text-[10px] font-mono text-[#A3A395] mt-0.5 tabular-nums">
                  {String(seconds).padStart(2, '0')} segs
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-[#EBE7DF] flex items-center justify-between">
              <span className="text-xs text-[#8D8D7E] font-mono hidden sm:inline">
                Convocatoria: {upcomingMatch.cantidadConvocados} jugadores confirmados
              </span>
              <button
                onClick={() => onSelectMatch(String(upcomingMatch.id))}
                className="w-full sm:w-auto bg-[#5A5A40] text-white px-6 py-2.5 rounded-2xl font-body font-semibold text-sm hover:bg-[#484833] transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Ver detalle</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ) : (
          <EmptyState message="No hay partidos programados próximamente." />
        )}
      </section>

      {/* Mi Resumen StatCards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40]">
            Mi Resumen
          </h2>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-mono font-bold text-[#7B8B6F] hover:underline uppercase tracking-wider"
          >
            VER PERFIL COMPLETO
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Card 1: Partidos */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col items-center justify-center text-center hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] mb-1 tracking-tight">
              {stats?.matchesPlayed ?? 0}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
              Partidos
            </span>
          </div>

          {/* Card 2: Goles */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col items-center justify-center text-center hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#7B8B6F] mb-1 tracking-tight">
              {stats?.goles ?? 0}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
              Goles
            </span>
          </div>

          {/* Card 3: Victorias */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col items-center justify-center text-center hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] mb-1 tracking-tight">
              {stats?.victorias ?? 0}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
              Victorias
            </span>
          </div>

          {/* Card 4: Rating */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col items-center justify-center text-center border-b-4 border-b-[#D2B48C] hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] mb-1 tracking-tight">
              {(stats?.rating ?? 0).toFixed(1)}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest">
              Rating
            </span>
          </div>
        </div>
      </section>

      {/* Últimos Partidos */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40]">
            Últimos Partidos
          </h2>
          <button
            onClick={() => setActiveTab('matches')}
            className="font-mono text-xs font-bold text-[#7B8B6F] hover:underline uppercase tracking-wider"
          >
            VER TODOS
          </button>
        </div>

        {finishedMatches.length > 0 ? (
          <div className="space-y-3">
            {finishedMatches.slice(0, 5).map((match) => (
              <div
                key={match.id}
                onClick={() => onSelectMatch(String(match.id))}
                className="bg-white rounded-[24px] p-4 md:p-5 card-shadow card-hover flex flex-col md:flex-row items-center justify-between gap-4 border border-[#EBE7DF] cursor-pointer"
              >
                {/* Team A */}
                <div className="flex-1 flex justify-end items-center gap-3 w-full md:w-auto">
                  <span className="font-serif text-[15px] font-bold text-[#5A5A40] text-right truncate">
                    Equipo A
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F1EFE7] flex items-center justify-center text-[#5A5A40]">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                  </div>
                </div>

                {/* Score */}
                <div className="bg-[#F1EFE7] px-6 py-2 rounded-2xl flex items-center justify-center gap-4 min-w-[120px] border border-[#EBE7DF]">
                  <span className="font-serif text-2xl font-bold text-[#5A5A40]">
                    {match.golesEquipoA ?? 0}
                  </span>
                  <span className="font-mono text-[#A3A395] font-bold">-</span>
                  <span className="font-serif text-2xl font-bold text-[#5A5A40]">
                    {match.golesEquipoB ?? 0}
                  </span>
                </div>

                {/* Team B */}
                <div className="flex-1 flex justify-start items-center gap-3 w-full md:w-auto">
                  <div className="w-8 h-8 rounded-full bg-[#F1EFE7] flex items-center justify-center text-[#5A5A40]">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                  </div>
                  <span className="font-serif text-[15px] font-bold text-[#5A5A40] truncate">
                    Equipo B
                  </span>
                </div>

                {/* Match tag */}
                <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#EBE7DF]">
                  <span className="font-mono text-[11px] font-semibold text-[#8D8D7E]">
                    {formatShortDate(match.fechaHora)} • {formatMatchTime(match.fechaHora)}
                  </span>
                  <span className="material-symbols-outlined text-[#A3A395] text-[18px] hidden md:inline">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No hay partidos finalizados registrados." />
        )}
      </section>
    </div>
  );
};