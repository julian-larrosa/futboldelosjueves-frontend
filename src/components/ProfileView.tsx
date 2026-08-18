import React, { useMemo, useState } from 'react';
import { attributesApi, hasOfficialAttributes, matchesApi, playersApi, statisticsApi, toPlayer, toPlayerStatistics } from '../api';
import { useApi } from '../hooks/useApi';
import { MonoRoundedRadarChart } from './charts/MonoRoundedRadarChart';
import { MonoRoundedLineChart } from './charts/MonoRoundedLineChart';
import { YearSelector } from './YearSelector';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import { getInitials } from '../utils/format';
import { toRadarPoints, toRatingEvolutionLinePoints } from '../utils/charts';

interface ProfileViewProps {
  playerId: number;
  currentPlayerId: number;
  onSelectPlayer: (playerId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  playerId,
  currentPlayerId,
  onSelectPlayer,
}) => {
  const [year, setYear] = useState<number | undefined>(undefined);

  const fetcher = React.useCallback(async () => {
    const params = year ? { year } : {};
    const [player, players, stats, matches, history] = await Promise.all([
      playersApi.get(playerId),
      playersApi.list({ size: 200 }),
      statisticsApi.getPlayerStatistics(playerId, params),
      matchesApi.list({ size: 200 }),
      attributesApi.getPlayerAttributeHistory(playerId).catch(() => null),
    ]);
    return { player, players: players.content, stats, matches: matches.content, history };
  }, [playerId, year]);

  const { data, loading, error, refetch } = useApi(fetcher);

  const lineData = useMemo(
    () =>
      data && data.history && data.matches
        ? toRatingEvolutionLinePoints(data.history, data.matches, year)
        : [],
    [data, year],
  );

  if (loading) {
    return <LoadingState label="Cargando perfil..." />;
  }

  if (error || !data) {
    return <ErrorState message={error ?? 'No se encontró el jugador.'} onRetry={refetch} />;
  }

  const { player, players, stats } = data;
  const ui = toPlayer(player);
  const s = toPlayerStatistics(stats);
  const recent = s.rendimientoReciente;

  const formaIcon =
    recent.indiceForma === null || recent.indiceForma === 0
      ? 'horizontal_rule'
      : recent.indiceForma > 0
      ? 'arrow_upward'
      : 'arrow_downward';

  return (
    <div className="max-w-screen-md mx-auto space-y-8 pb-16 pt-2">
      {/* Player Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-[24px] border border-[#EBE7DF] card-shadow">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7B8B6F] text-[20px]">badge</span>
          <span className="font-mono text-xs font-bold text-[#5A5A40] uppercase tracking-wider">Ver Perfil:</span>
          <select
            value={playerId}
            onChange={(e) => onSelectPlayer(e.target.value)}
            aria-label="Seleccionar jugador"
            className="bg-[#F1EFE7] text-xs font-mono font-bold text-[#5A5A40] py-2 px-3.5 rounded-xl border border-[#EBE7DF] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F]"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.nombre} ${p.apellido}`.trim()} ({toPlayer(p).position})
              </option>
            ))}
          </select>
        </div>
        <YearSelector value={year} onChange={setYear} />
      </div>

      {/* HEADER: PROFILE OVERVIEW */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#EBE7DF] border-4 border-white shadow-md relative z-10 flex items-center justify-center">
            <span className="font-serif text-4xl font-bold text-[#5A5A40]">
              {getInitials(ui.name)}
            </span>
          </div>

          {/* Form Trend Badge */}
          <div className="absolute bottom-0 right-0 z-20 bg-white rounded-full p-1 shadow-md border border-[#EBE7DF]">
            <div className="bg-[#E2E8DC] text-[#48563F] flex items-center justify-center rounded-full w-9 h-9">
              <span className="material-symbols-outlined font-bold text-[20px] fill">{formaIcon}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40]">
            {ui.name} {playerId === currentPlayerId ? '(Tú)' : ''}
          </h1>
          <p className="font-mono text-xs text-[#8D8D7E] uppercase tracking-widest font-bold">
            {ui.position}
          </p>
        </div>

        {/* Rating Pill */}
        <div className="inline-flex items-baseline gap-2 bg-[#5A5A40] px-6 py-2 rounded-full shadow-md text-white">
          <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-80">
            OVR
          </span>
          <span className="font-serif text-2xl md:text-3xl font-bold leading-none">
            {ui.ovr.toFixed(1)}
          </span>
        </div>
      </section>

      {/* SECCIÓN 'ATRIBUTOS OFICIALES' */}
      <section className="bg-white rounded-[28px] card-shadow p-6 md:p-8 relative overflow-hidden border border-[#EBE7DF]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40]">
            Atributos Oficiales
          </h2>
          <span className="text-[11px] font-mono text-[#8D8D7E] font-semibold bg-[#F1EFE7] px-3 py-1 rounded-full border border-[#EBE7DF]">
            Escala 1 - 10
          </span>
        </div>

        {hasOfficialAttributes(player) ? (
          <MonoRoundedRadarChart data={toRadarPoints(ui.attributes)} height={220} />
        ) : (
          <EmptyState message="Sin valoraciones oficiales." />
        )}
      </section>

      {/* SECCIÓN 'EVOLUCIÓN DE VALORACIONES' */}
      <section className="bg-white rounded-[28px] card-shadow p-6 md:p-8 border border-[#EBE7DF]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40]">
            Evolución de Valoraciones
          </h2>
          <span className="text-[11px] font-mono text-[#8D8D7E] font-semibold bg-[#F1EFE7] px-3 py-1 rounded-full border border-[#EBE7DF]">
            {year ? `Temporada ${year}` : 'Histórico'}
          </span>
        </div>

        {lineData.length >= 2 ? (
          <MonoRoundedLineChart data={lineData} height={220} />
        ) : (
          <EmptyState message="Sin historial suficiente de valoraciones para graficar." />
        )}
      </section>

      {/* SECCIÓN 'RENDIMIENTO' */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40] px-1">
          Rendimiento {year ? `Temporada ${year}` : 'Histórico'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Partidos */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {s.matchesPlayed}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Partidos
            </span>
          </div>

          {/* Rating Prom */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#7B8B6F] tracking-tight">
              {s.rating > 0 ? s.rating.toFixed(1) : '—'}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Rating Prom
            </span>
          </div>

          {/* Goles */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {s.goles}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Goles
            </span>
          </div>

          {/* Victorias */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {s.victorias}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Victorias
            </span>
          </div>

          {/* Empates */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {s.empates}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Empates
            </span>
          </div>

          {/* Derrotas */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {s.derrotas}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Derrotas
            </span>
          </div>
        </div>
      </section>

      {/* SECCIÓN 'RENDIMIENTO RECIENTE' */}
      <section className="bg-white rounded-[28px] card-shadow p-6 md:p-8 border border-[#EBE7DF]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40]">
            Rendimiento Reciente
          </h2>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold ${
              formaIcon === 'arrow_upward'
                ? 'bg-[#E2E8DC] text-[#48563F]'
                : formaIcon === 'arrow_downward'
                ? 'bg-[#FFEBE5] text-[#D97B66]'
                : 'bg-[#F1EFE7] text-[#8D8D7E]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{formaIcon}</span>
            {recent.indiceForma === null ? 'Sin datos' : 'Forma'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#F9F7F2]/60 rounded-2xl p-4 text-center border border-[#EBE7DF]">
            <span className="block font-serif text-2xl font-bold text-[#5A5A40]">
              {recent.partidosJugados}
            </span>
            <span className="block font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-1">
              Partidos
            </span>
          </div>
          <div className="bg-[#F9F7F2]/60 rounded-2xl p-4 text-center border border-[#EBE7DF]">
            <span className="block font-serif text-2xl font-bold text-[#7B8B6F]">
              {recent.goles}
            </span>
            <span className="block font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-1">
              Goles
            </span>
          </div>
          <div className="bg-[#F9F7F2]/60 rounded-2xl p-4 text-center border border-[#EBE7DF]">
            <span className="block font-serif text-2xl font-bold text-[#5A5A40]">
              {recent.ratingPromedio !== null ? recent.ratingPromedio.toFixed(1) : '—'}
            </span>
            <span className="block font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-1">
              Rating Prom
            </span>
          </div>
          <div className="bg-[#F9F7F2]/60 rounded-2xl p-4 text-center border border-[#EBE7DF]">
            <span className="block font-serif text-2xl font-bold text-[#5A5A40]">
              {recent.victorias} - {recent.empates} - {recent.derrotas}
            </span>
            <span className="block font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-1">
              V-E-D
            </span>
          </div>
        </div>
      </section>

      {/* SECCIÓN 'ÚLTIMOS PARTIDOS' */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40] px-1">
          Últimos Partidos
        </h2>
        <EmptyState message="No hay historial de partidos individuales disponible para este jugador." />
      </section>
    </div>
  );
};