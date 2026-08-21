import React, { useState, useCallback } from 'react';
import {
  MatchStatus,
  matchesApi,
  participationsApi,
  ratingsApi,
  statisticsApi,
  teamsApi,
  TeamSide,
} from '../api';
import { useApi } from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import { ConvocatoriaSection } from './ConvocatoriaSection';
import { formatMatchDate, formatMatchTime, formatShortDate, getInitials } from '../utils/format';

interface MatchDetailViewProps {
  matchId: number;
  isAdmin: boolean;
  isHincha?: boolean;
  onSelectMatch: (matchId: string) => void;
  onSelectPlayer: (playerId: string) => void;
  onOpenEditModal: () => void;
  onOpenRateModal: () => void;
}

const STATUS_LABEL: Record<MatchStatus, string> = {
  PROGRAMADO: 'Programado',
  CONVOCATORIA_ABIERTA: 'Convocatoria abierta',
  CONVOCATORIA_CERRADA: 'Convocatoria cerrada',
  EN_CURSO: 'En curso',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

function sideLabel(side: TeamSide | null): 'A' | 'B' {
  return side === 'EQUIPO_B' ? 'B' : 'A';
}

export const MatchDetailView: React.FC<MatchDetailViewProps> = ({
  matchId,
  isAdmin,
  isHincha = false,
  onSelectMatch,
  onSelectPlayer,
  onOpenEditModal,
  onOpenRateModal,
}) => {
  const [selectedTeamSide, setSelectedTeamSide] = useState<TeamSide>('EQUIPO_A');
  const [generatingTeams, setGeneratingTeams] = useState(false);

  const matchFetcher = React.useCallback(() => matchesApi.get(matchId), [matchId]);
  const matchQuery = useApi(matchFetcher);

  const allMatchesFetcher = React.useCallback(() => matchesApi.list({ size: 100 }), []);
  const allMatchesQuery = useApi(allMatchesFetcher);

  const teamsFetcher = React.useCallback(() => teamsApi.list(matchId), [matchId]);
  const teamsQuery = useApi(teamsFetcher);

  const handleGenerateTeams = useCallback(async () => {
    setGeneratingTeams(true);
    try {
      await teamsApi.generate(matchId);
      teamsQuery.refetch();
    } catch {
      // Error handled silently
    } finally {
      setGeneratingTeams(false);
    }
  }, [matchId, teamsQuery]);

  const statsFetcher = React.useCallback(
    () => statisticsApi.getMatchStatistics(matchId),
    [matchId],
  );
  const statsQuery = useApi(statsFetcher);

  const ratingsFetcher = React.useCallback(() => ratingsApi.list(matchId, { size: 100 }), [matchId]);
  const ratingsQuery = useApi(ratingsFetcher);

  const participationsFetcher = React.useCallback(
    () => participationsApi.list(matchId, { size: 100 }),
    [matchId],
  );
  const participationsQuery = useApi(participationsFetcher);

  if (matchQuery.loading) {
    return <LoadingState label="Cargando partido..." />;
  }

  if (matchQuery.error || !matchQuery.data) {
    return (
      <ErrorState message={matchQuery.error ?? 'No se encontró el partido.'} onRetry={matchQuery.refetch} />
    );
  }

  const match = matchQuery.data;
  const allMatches = allMatchesQuery.data?.content ?? [];
  const teams = teamsQuery.data ?? [];
  const matchStats = statsQuery.data ?? [];
  const ratings = ratingsQuery.data?.content ?? [];
  const participations = participationsQuery.data?.content ?? [];

  const teamA = teams.find((t) => t.side === 'EQUIPO_A');
  const teamB = teams.find((t) => t.side === 'EQUIPO_B');
  const selectedTeam =
    selectedTeamSide === 'EQUIPO_A' ? teamA : teamB;

  const currentLineup = selectedTeam?.jugadores ?? [];
  const currentTeamName = selectedTeamSide === 'EQUIPO_A' ? 'Equipo A' : 'Equipo B';

  const scorers = matchStats.filter((p) => p.goles > 0);
  const hasScore = match.golesEquipoA !== null && match.golesEquipoB !== null;
  const isFinished = match.estado === 'FINALIZADO';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 pt-2">
      {/* MATCH SELECTOR BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-[24px] border border-[#EBE7DF] card-shadow">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7B8B6F] text-[20px]">sports_soccer</span>
          <span className="font-mono text-xs font-bold text-[#5A5A40] uppercase tracking-wider">Partidos:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {allMatches.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMatch(String(m.id))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                m.id === match.id
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#F1EFE7] text-[#8D8D7E] hover:bg-[#EBE7DF] hover:text-[#5A5A40]'
              }`}
            >
              {formatShortDate(m.fechaHora)}
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
            <span className="font-medium text-[#4A4A3F]">{formatMatchDate(match.fechaHora)}</span>
            <span className="mx-1">•</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                match.estado === 'CANCELADO'
                  ? 'bg-[#FFEBE5] text-[#D97B66]'
                  : isFinished
                  ? 'bg-[#F1EFE7] text-[#5A5A40]'
                  : 'bg-[#E2E8DC] text-[#48563F]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isFinished || match.estado === 'CANCELADO'
                    ? 'bg-[#8D8D7E]'
                    : 'bg-[#7B8B6F] animate-ping'
                }`}
              ></span>
              {STATUS_LABEL[match.estado]}
            </span>
          </div>
        </div>

        {/* Action Button: Editar Resultado / Stats (solo admin) */}
        {isAdmin && (
          <button
            onClick={onOpenEditModal}
            className="bg-white hover:bg-[#F1EFE7] text-[#5A5A40] border border-[#EBE7DF] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all card-shadow active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-[#7B8B6F]">edit</span>
            <span>Editar Resultado/Stats</span>
          </button>
        )}
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
              Equipo A
            </h2>
            {teamA && (
              <span className="font-mono text-[11px] font-bold text-[#7B8B6F] bg-[#F1EFE7] px-2.5 py-0.5 rounded-full border border-[#EBE7DF]">
                {teamA.jugadores.length} jugadores
              </span>
            )}
          </div>

          {/* Score & Phase */}
          <div className="flex flex-col items-center px-4 md:px-8">
            <div className="font-serif text-4xl md:text-5xl font-bold text-[#5A5A40] flex items-center gap-3 md:gap-4 tracking-tighter">
              <span>{isFinished ? match.golesEquipoA ?? 0 : '-'}</span>
              <span className="text-[#DCD6C8] font-light">-</span>
              <span>{isFinished ? match.golesEquipoB ?? 0 : '-'}</span>
            </div>
            <span className="font-mono text-xs font-bold text-[#8D8D7E] mt-2 uppercase tracking-wider bg-[#F1EFE7] px-3 py-0.5 rounded-full border border-[#EBE7DF]">
              {STATUS_LABEL[match.estado]}
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
              Equipo B
            </h2>
            {teamB && (
              <span className="font-mono text-[11px] font-bold text-[#7B8B6F] bg-[#F1EFE7] px-2.5 py-0.5 rounded-full border border-[#EBE7DF]">
                {teamB.jugadores.length} jugadores
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CONVOCATORIA SECTION */}
      {match.estado !== 'FINALIZADO' && match.estado !== 'CANCELADO' && (
        <ConvocatoriaSection
          match={match}
          isAdmin={isAdmin}
          onSelectPlayer={onSelectPlayer}
          onRefresh={matchQuery.refetch}
        />
      )}

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GOLEADORES SECTION */}
        <div className="bg-white rounded-[28px] p-6 card-shadow border border-[#EBE7DF] md:col-span-1 flex flex-col">
          <h3 className="font-serif text-base font-bold text-[#5A5A40] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7B8B6F]">sports_soccer</span>
            <span>Goleadores</span>
          </h3>

          <div className="flex flex-col gap-3 flex-grow">
            {scorers.length > 0 ? (
              scorers.map((scorer) => (
                <div
                  key={scorer.playerId}
                  onClick={() => onSelectPlayer(String(scorer.playerId))}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F9F7F2]/60 hover:bg-[#F1EFE7] transition-colors border border-[#EBE7DF] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EBE7DF] flex items-center justify-center font-mono text-xs font-bold text-[#5A5A40] shrink-0">
                      {getInitials(scorer.playerNombreCompleto)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body font-bold text-sm text-[#4A4A3F]">
                        {scorer.playerNombreCompleto}
                      </span>
                      <span className="text-[10px] font-mono text-[#8D8D7E]">
                        Equipo {sideLabel(scorer.teamSide)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#5A5A40]">
                    <span className="font-serif text-lg font-bold">{scorer.goles}</span>
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

            <div className="flex items-center gap-2">
              {isAdmin && teams.length === 0 && match.estado !== 'FINALIZADO' && match.estado !== 'CANCELADO' && (
                <button
                  onClick={handleGenerateTeams}
                  disabled={generatingTeams}
                  className="bg-[#7B8B6F] text-white px-3 py-1.5 rounded-lg font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {generatingTeams ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  )}
                  <span>Generar Equipos</span>
                </button>
              )}

              {/* Team A / Team B Tab Switcher */}
            <div className="flex bg-[#F1EFE7] rounded-xl p-1 border border-[#EBE7DF]">
              <button
                onClick={() => setSelectedTeamSide('EQUIPO_A')}
                className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                  selectedTeamSide === 'EQUIPO_A'
                    ? 'bg-white shadow-xs text-[#5A5A40]'
                    : 'text-[#8D8D7E] hover:text-[#5A5A40]'
                }`}
              >
                Equipo A
              </button>
              <button
                onClick={() => setSelectedTeamSide('EQUIPO_B')}
                className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                  selectedTeamSide === 'EQUIPO_B'
                    ? 'bg-white shadow-xs text-[#5A5A40]'
                    : 'text-[#8D8D7E] hover:text-[#5A5A40]'
                }`}
              >
                Equipo B
              </button>
            </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentLineup.length > 0 ? (
              currentLineup.map((member) => (
                <div
                  key={member.playerId}
                  onClick={() => onSelectPlayer(String(member.playerId))}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-[#EBE7DF] bg-[#F9F7F2]/60 hover:bg-[#F1EFE7] transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#7B8B6F] text-white flex items-center justify-center font-mono text-xs font-bold">
                    {getInitials(`${member.nombre} ${member.apellido}`)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body text-sm font-semibold text-[#4A4A3F]">
                      {`${member.nombre} ${member.apellido}`.trim()}
                    </span>
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
            {!isHincha && (
              <button
                onClick={onOpenRateModal}
                className="bg-[#5A5A40] text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                <span>Calificar compañeros</span>
              </button>
            )}
          </div>

          {/* Ratings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#EBE7DF] text-[#8D8D7E] bg-[#F9F7F2]/40">
                  <th className="py-3 px-4 font-mono text-xs">Jugador</th>
                  <th className="py-3 px-4 font-mono text-xs text-center">Calificaciones</th>
                  <th className="py-3 px-4 font-mono text-xs text-right">Puntaje</th>
                </tr>
              </thead>
              <tbody className="font-body text-[#4A4A3F]">
                {ratings.length > 0 ? (
                  ratings.map((rating) => (
                    <tr
                      key={rating.id}
                      onClick={() => onSelectPlayer(String(rating.calificadoId))}
                      className="border-b border-[#EBE7DF]/70 hover:bg-[#F1EFE7]/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EBE7DF] flex items-center justify-center text-[11px] font-mono font-bold text-[#5A5A40]">
                            {getInitials(rating.calificadoNombreCompleto)}
                          </div>
                          <span className="font-body font-semibold text-sm text-[#4A4A3F]">
                            {rating.calificadoNombreCompleto}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#8D8D7E] text-xs font-mono">
                        por {rating.calificadorNombreCompleto}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center justify-center font-serif font-bold text-sm px-3 py-1 rounded-full ${
                            rating.puntaje >= 8.5
                              ? 'bg-[#E2E8DC] text-[#48563F]'
                              : 'bg-[#F1EFE7] text-[#5A5A40]'
                          }`}
                        >
                          {rating.puntaje.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-xs font-mono text-[#8D8D7E]">
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