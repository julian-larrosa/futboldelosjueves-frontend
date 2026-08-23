import React, { useCallback, useMemo, useState } from 'react';
import { ApiError, teamsApi } from '../api';
import type { ParticipationResponse, TeamResponse, TeamSide } from '../api';
import { getInitials } from '../utils/format';

interface TeamBuilderProps {
  matchId: number;
  participations: ParticipationResponse[];
  teams: TeamResponse[];
  onRefresh: () => void;
}

const SIDES: Array<{ side: TeamSide; label: string }> = [
  { side: 'EQUIPO_A', label: 'Equipo A' },
  { side: 'EQUIPO_B', label: 'Equipo B' },
];

export const TeamBuilder: React.FC<TeamBuilderProps> = ({
  matchId,
  participations,
  teams,
  onRefresh,
}) => {
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pool = useMemo(() => participations.filter((p) => !p.teamSide), [participations]);

  const membersBySide = useMemo(() => {
    const map = new Map<TeamSide, ParticipationResponse[]>(
      SIDES.map(({ side }) => [side, []]),
    );
    for (const p of participations) {
      if (p.teamSide) {
        map.get(p.teamSide)?.push(p);
      }
    }
    return map;
  }, [participations]);

  const ratingBySide = useMemo(() => {
    const map = new Map<TeamSide, number | null>();
    for (const { side } of SIDES) {
      const team = teams.find((t) => t.side === side);
      map.set(side, team?.ratingPromedio ?? null);
    }
    return map;
  }, [teams]);

  const handleAssign = useCallback(
    async (playerId: number, targetSide: TeamSide) => {
      if (actionLoadingId !== null) return;
      setError(null);
      setActionLoadingId(playerId);
      try {
        await teamsApi.assignPlayer(matchId, playerId, { teamSide: targetSide });
        onRefresh();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'No se pudo asignar el jugador.');
      } finally {
        setActionLoadingId(null);
      }
    },
    [matchId, actionLoadingId, onRefresh],
  );

  const renderAssignButtons = (
    playerId: number,
    currentSide: TeamSide | null,
  ) => (
    <div className="flex items-center gap-1 shrink-0">
      {SIDES.map(({ side, label }) => {
        const isCurrent = currentSide === side;
        if (isCurrent) return null;
        return (
          <button
            key={side}
            type="button"
            disabled={actionLoadingId !== null}
            onClick={(e) => {
              e.stopPropagation();
              handleAssign(playerId, side);
            }}
            title={currentSide ? `Mover a ${label}` : `Asignar a ${label}`}
            className={`w-7 h-7 rounded-lg font-mono text-[11px] font-bold border transition-all active:scale-95 disabled:opacity-50 ${
              side === 'EQUIPO_A'
                ? 'bg-white text-[#5A5A40] border-[#EBE7DF] hover:bg-[#F1EFE7]'
                : 'bg-white text-[#7B8B6F] border-[#EBE7DF] hover:bg-[#F1EFE7]'
            }`}
          >
            {actionLoadingId === playerId ? (
              <span className="inline-block w-3 h-3 border-2 border-[#7B8B6F]/40 border-t-[#7B8B6F] rounded-full animate-spin align-middle" />
            ) : (
              label.slice(-1)
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Pool: convocados sin equipo */}
      <div className="p-4 rounded-2xl bg-[#F1EFE7] border border-[#EBE7DF]">
        <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E] mb-2">
          Sin equipo ({pool.length})
        </p>
        {pool.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pool.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 bg-white border border-[#EBE7DF] rounded-xl px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#EBE7DF] flex items-center justify-center font-mono text-[10px] font-bold text-[#5A5A40] shrink-0">
                    {getInitials(p.playerNombreCompleto)}
                  </div>
                  <span className="font-body text-sm font-semibold text-[#4A4A3F] truncate">
                    {p.playerNombreCompleto}
                  </span>
                </div>
                {renderAssignButtons(p.playerId, null)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-mono text-[#8D8D7E] py-1">
            Todos los convocados tienen equipo. Podes mover jugadores desde las columnas de abajo.
          </p>
        )}
      </div>

      {/* Columnas por equipo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SIDES.map(({ side, label }) => {
          const members = membersBySide.get(side) ?? [];
          const rating = ratingBySide.get(side);
          return (
            <div
              key={side}
              className={`rounded-2xl border p-3 space-y-2 ${
                side === 'EQUIPO_A'
                  ? 'border-[#5A5A40]/30 bg-[#F9F7F2]/40'
                  : 'border-[#7B8B6F]/30 bg-[#EDF3E9]/40'
              }`}
            >
              <div className="flex items-center justify-between px-1">
                <span className="font-serif font-bold text-sm text-[#5A5A40]">{label}</span>
                <span className="font-mono text-[10px] font-bold text-[#8D8D7E]">
                  {members.length} jug. · {rating != null ? rating.toFixed(1) : '—'}
                </span>
              </div>
              {members.length > 0 ? (
                members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-2 bg-white border border-[#EBE7DF] rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#7B8B6F] text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        {getInitials(m.playerNombreCompleto)}
                      </div>
                      <span className="font-body text-sm font-semibold text-[#4A4A3F] truncate">
                        {m.playerNombreCompleto}
                      </span>
                    </div>
                    {renderAssignButtons(m.playerId, m.teamSide ?? null)}
                  </div>
                ))
              ) : (
                <p className="text-xs font-mono text-[#8D8D7E] px-1 py-2">
                  Sin jugadores todavia.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] font-mono text-[#8D8D7E] px-1">
        La diferencia entre equipos no puede ser mayor a 1 jugador.
      </p>
    </div>
  );
};
