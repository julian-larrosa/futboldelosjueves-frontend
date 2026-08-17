import React from 'react';
import { Player } from '../types';
import { RadarChart } from './RadarChart';

interface ProfileViewProps {
  player: Player;
  allPlayers: Player[];
  onSelectPlayer: (playerId: string) => void;
  onSelectMatch: (matchId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  player,
  allPlayers,
  onSelectPlayer,
  onSelectMatch,
}) => {
  // SVG points for Evolution line chart (scale: 7.0 to 10.0)
  const ratings = player.recentFormRatings || [8.0, 8.2, 7.5, 8.8, 9.0];
  const minR = 7.0;
  const maxR = 9.5;

  const points = ratings.map((r, i) => {
    const x = (i / (ratings.length - 1)) * 100;
    const norm = (r - minR) / (maxR - minR);
    const y = 35 - norm * 30;
    return { x, y, r };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');

  return (
    <div className="max-w-screen-md mx-auto space-y-8 pb-16 pt-2">
      {/* Player Switcher Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-[24px] border border-[#EBE7DF] card-shadow">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7B8B6F] text-[20px]">badge</span>
          <span className="font-mono text-xs font-bold text-[#5A5A40] uppercase tracking-wider">Ver Perfil:</span>
        </div>
        <select
          value={player.id}
          onChange={(e) => onSelectPlayer(e.target.value)}
          aria-label="Seleccionar jugador"
          className="bg-[#F1EFE7] text-xs font-mono font-bold text-[#5A5A40] py-2 px-3.5 rounded-xl border border-[#EBE7DF] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F]"
        >
          {allPlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.roleTitle || p.position})
            </option>
          ))}
        </select>
      </div>

      {/* HEADER: PROFILE OVERVIEW */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-[#D2B48C] overflow-hidden border-4 border-white shadow-md relative z-10">
            <img
              src={player.photoHero || player.avatar}
              alt={player.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Form Trend Badge */}
          <div className="absolute bottom-0 right-0 z-20 bg-white rounded-full p-1 shadow-md border border-[#EBE7DF]">
            <div className="bg-[#E2E8DC] text-[#48563F] flex items-center justify-center rounded-full w-9 h-9">
              <span className="material-symbols-outlined font-bold text-[20px] fill">
                trending_up
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5A5A40]">
            {player.name}
          </h1>
          <p className="font-mono text-xs text-[#8D8D7E] uppercase tracking-widest font-bold">
            {player.roleTitle}
          </p>
        </div>

        {/* Rating Pill */}
        <div className="inline-flex items-baseline gap-2 bg-[#5A5A40] px-6 py-2 rounded-full shadow-md text-white">
          <span className="font-mono text-xs uppercase tracking-widest font-bold opacity-80">
            OVR
          </span>
          <span className="font-serif text-2xl md:text-3xl font-bold leading-none">
            {player.ovr.toFixed(1)}
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

        <RadarChart attributes={player.attributes} />
      </section>

      {/* SECCIÓN 'RENDIMIENTO HISTÓRICO' */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40] px-1">
          Rendimiento Histórico
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Partidos */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {player.matchesPlayed}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Partidos
            </span>
          </div>

          {/* Rating Prom */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#7B8B6F] tracking-tight">
              {player.rating.toFixed(1)}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Rating Prom
            </span>
          </div>

          {/* Goles */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {player.goals}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Goles
            </span>
          </div>

          {/* Victorias */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {player.victorias}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Victorias
            </span>
          </div>

          {/* Empates */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {player.empates}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Empates
            </span>
          </div>

          {/* Derrotas */}
          <div className="bg-white rounded-[24px] p-5 card-shadow border border-[#EBE7DF] flex flex-col justify-between hover:bg-[#F1EFE7] transition-colors">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#5A5A40] tracking-tight">
              {player.derrotas}
            </span>
            <span className="font-mono text-[10px] font-bold text-[#8D8D7E] uppercase tracking-widest mt-2">
              Derrotas
            </span>
          </div>
        </div>
      </section>

      {/* SECCIÓN 'EVOLUCIÓN (ÚLTIMOS 5)' */}
      <section className="bg-white rounded-[28px] card-shadow p-6 md:p-8 border border-[#EBE7DF]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40]">
            Evolución (Últimos 5)
          </h2>
          <span className="font-mono text-xs font-bold text-[#7B8B6F]">
            Último: {ratings[ratings.length - 1].toFixed(1)}
          </span>
        </div>

        <div className="w-full h-32 relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
            {/* Grid Lines */}
            <line x1="0" y1="10" x2="100" y2="10" stroke="#EBE7DF" strokeDasharray="2 2" strokeWidth="0.75" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="#EBE7DF" strokeDasharray="2 2" strokeWidth="0.75" />
            <line x1="0" y1="30" x2="100" y2="30" stroke="#EBE7DF" strokeDasharray="2 2" strokeWidth="0.75" />

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#7B8B6F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Circles and data values */}
            {points.map((p, i) => {
              const isLast = i === points.length - 1;
              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isLast ? 3.5 : 2.5}
                    className={
                      isLast
                        ? 'fill-[#5A5A40] stroke-white stroke-2'
                        : 'fill-white stroke-[#7B8B6F] stroke-2'
                    }
                  />
                  <text
                    x={p.x}
                    y={p.y - 5}
                    textAnchor="middle"
                    className="font-mono text-[8px] font-bold fill-[#5A5A40]"
                  >
                    {p.r.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex justify-between mt-3 px-1">
          <span className="font-mono text-xs text-[#8D8D7E]">J-4</span>
          <span className="font-mono text-xs text-[#8D8D7E]">J-3</span>
          <span className="font-mono text-xs text-[#8D8D7E]">J-2</span>
          <span className="font-mono text-xs text-[#8D8D7E]">J-1</span>
          <span className="font-mono text-xs text-[#7B8B6F] font-bold">HOY</span>
        </div>
      </section>

      {/* SECCIÓN 'ÚLTIMOS PARTIDOS' */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg md:text-xl font-bold text-[#5A5A40] px-1">
          Últimos Partidos
        </h2>
        <div className="flex flex-col gap-2.5">
          {player.recentMatches && player.recentMatches.length > 0 ? (
            player.recentMatches.map((m, idx) => (
              <div
                key={m.id || idx}
                onClick={() => onSelectMatch('match-13-featured')}
                className={`bg-white rounded-2xl p-4 flex items-center justify-between card-shadow hover:bg-[#F1EFE7] transition-colors border border-[#EBE7DF] cursor-pointer ${
                  m.isMvp ? 'border-l-4 border-l-[#5A5A40]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex flex-col items-center justify-center bg-[#F1EFE7] rounded-xl font-mono text-[#5A5A40] shrink-0 border border-[#EBE7DF]">
                    <span className="text-[10px] text-[#8D8D7E] font-bold">{m.month}</span>
                    <span className="font-bold text-sm leading-tight">{m.day}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-sm font-bold text-[#5A5A40]">
                      {m.type}
                    </span>
                    <span className="font-mono text-xs text-[#8D8D7E]">{m.opponent}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-serif text-lg font-bold text-[#5A5A40]">
                    {m.rating.toFixed(1)}
                  </span>
                  {m.isMvp && (
                    <span className="font-mono text-[10px] font-bold text-[#48563F] bg-[#E2E8DC] px-2 py-0.5 rounded-full">
                      MVP
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center text-[#8D8D7E] text-xs font-mono border border-[#EBE7DF]">
              No hay partidos registrados recientemente.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
