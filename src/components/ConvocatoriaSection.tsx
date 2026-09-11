import React, { useCallback, useMemo, useState } from 'react';
import { ApiError, matchesApi, participationsApi, playersApi } from '../api';
import type { MatchResponse, ParticipationResponse } from '../api';
import { useApi } from '../hooks/useApi';
import { LoadingState, ErrorState, EmptyState } from './StateViews';
import { getInitials } from '../utils/format';

interface ConvocatoriaSectionProps {
  match: MatchResponse;
  isAdmin: boolean;
  onSelectPlayer: (playerId: string) => void;
  onRefresh?: () => void;
}

// El backend solo permite agregar/quitar convocados con convocatoria abierta
const ADMIN_EDITABLE_STATUSES = ['CONVOCATORIA_ABIERTA'];

interface ConvocarPlayerControlsProps {
  matchId: number;
  participations: ParticipationResponse[];
  onAdded: () => void;
}

const ConvocarPlayerControls: React.FC<ConvocarPlayerControlsProps> = ({
  matchId,
  participations,
  onAdded,
}) => {
  const playersFetcher = useCallback(() => playersApi.list({ size: 100 }), []);
  const playersQuery = useApi(playersFetcher);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availablePlayers = useMemo(() => {
    const all = playersQuery.data?.content ?? [];
    const convokedIds = new Set(participations.map((p) => p.playerId));
    return all.filter((p) => p.activo && !convokedIds.has(p.id));
  }, [playersQuery.data, participations]);

  const togglePlayer = (playerId: number) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const handleAdd = async () => {
    if (selectedPlayerIds.length === 0 || loading) {
      return;
    }
    setError(null);
    setLoading(true);
    let added = 0;
    let firstError: string | null = null;
    for (const playerId of selectedPlayerIds) {
      try {
        await participationsApi.add(matchId, { playerId });
        added += 1;
      } catch (err) {
        firstError =
          firstError ??
          (err instanceof ApiError ? err.message : 'No se pudo convocar al jugador.');
      }
    }
    setLoading(false);

    if (added > 0) {
      setSelectedPlayerIds([]);
      onAdded();
    }
    if (firstError) {
      setError(
        added > 0
          ? `Se convocaron ${added} jugador${added === 1 ? '' : 'es'}. No se pudieron convocar ${
              selectedPlayerIds.length - added
            }: ${firstError}`
          : firstError,
      );
    }
  };

  const allSelected =
    availablePlayers.length > 0 &&
    selectedPlayerIds.length === availablePlayers.length;

  return (
    <div className="mt-5 p-4 rounded-2xl bg-[#F1EFE7] border border-[#EBE7DF] space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#7B8B6F]">group_add</span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E]">
            Convocar jugadores
          </span>
        </div>
        {availablePlayers.length > 0 && (
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() =>
                setSelectedPlayerIds(
                  allSelected ? [] : availablePlayers.map((p) => p.id),
                )
              }
              className="text-[#7B8B6F] hover:text-[#48563F] transition-colors"
            >
              {allSelected ? 'Quitar todos' : 'Seleccionar todos'}
            </button>
            {selectedPlayerIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedPlayerIds([])}
                className="text-[#8D8D7E] hover:text-[#5A5A40] transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        )}
      </div>

      {playersQuery.loading ? (
        <div className="flex items-center justify-center gap-2 py-5 text-xs font-mono font-bold text-[#8D8D7E]">
          <span className="w-3.5 h-3.5 border-2 border-[#7B8B6F]/30 border-t-[#7B8B6F] rounded-full animate-spin" />
          <span>Cargando jugadores…</span>
        </div>
      ) : availablePlayers.length > 0 ? (
        <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
          {availablePlayers.map((p) => {
            const checked = selectedPlayerIds.includes(p.id);
            return (
              <label
                key={p.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors select-none ${
                  checked
                    ? 'bg-[#E2E8DC] border-[#7B8B6F]/50'
                    : 'bg-white border-[#EBE7DF] hover:bg-[#F1EFE7]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePlayer(p.id)}
                  className="w-4 h-4 accent-[#7B8B6F] shrink-0"
                />
                <span className="font-body text-sm font-semibold text-[#4A4A3F] truncate">
                  {p.apellido}, {p.nombre}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <p className="text-xs font-mono text-[#8D8D7E] py-2 text-center">
          No hay más jugadores disponibles.
        </p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-[11px] font-mono text-[#8D8D7E]">
          {selectedPlayerIds.length > 0
            ? `${selectedPlayerIds.length} jugador${selectedPlayerIds.length === 1 ? '' : 'es'} seleccionado${
                selectedPlayerIds.length === 1 ? '' : 's'
              }`
            : 'Ningún jugador seleccionado'}
        </span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={selectedPlayerIds.length === 0 || loading}
          className="bg-[#7B8B6F] text-white px-5 py-2.5 rounded-xl font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Convocando…</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>
                Convocar{selectedPlayerIds.length > 0 ? ` (${selectedPlayerIds.length})` : ''}
              </span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-3 py-2 text-xs font-mono font-bold flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const ConvocatoriaSection: React.FC<ConvocatoriaSectionProps> = ({
  match,
  isAdmin,
  onSelectPlayer,
  onRefresh,
}) => {
  const fetcher = useCallback(
    () => participationsApi.list(match.id, { size: 100 }),
    [match.id],
  );
  const { data, loading, error, refetch } = useApi(fetcher);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const runStateAction = useCallback(
    async (key: string, action: () => Promise<unknown>) => {
      setActionError(null);
      setActionLoading(key);
      try {
        await action();
        refetch();
        onRefresh?.();
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : 'No se pudo completar la acción.',
        );
      } finally {
        setActionLoading(null);
      }
    },
    [refetch, onRefresh],
  );

  const handleRemovePlayer = useCallback(
    async (playerId: number) => {
      try {
        await participationsApi.remove(match.id, playerId);
        refetch();
        onRefresh?.();
      } catch {
        // Error handled silently
      }
    },
    [match.id, refetch, onRefresh],
  );

  if (loading) {
    return <LoadingState label="Cargando convocatoria..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const participations = data?.content ?? [];
  const canEdit = isAdmin && ADMIN_EDITABLE_STATUSES.includes(match.estado);

  return (
    <div className="bg-white rounded-[28px] p-6 card-shadow border border-[#EBE7DF]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h3 className="font-serif text-base md:text-lg font-bold text-[#5A5A40] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7B8B6F]">how_to_reg</span>
          <span>Convocatoria</span>
          <span className="font-mono text-xs text-[#8D8D7E] font-normal">
            ({participations.length} confirmados)
          </span>
        </h3>

        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-2">
            {match.estado === 'PROGRAMADO' && (
              <button
                type="button"
                onClick={() =>
                  runStateAction('open', () => matchesApi.openConvocatoria(match.id))
                }
                disabled={actionLoading !== null}
                className="bg-[#5A5A40] text-white px-4 py-2 rounded-xl font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading === 'open' ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                )}
                <span>Abrir convocatoria</span>
              </button>
            )}

            {match.estado === 'CONVOCATORIA_ABIERTA' && (
              <button
                type="button"
                onClick={() =>
                  runStateAction('close', () => matchesApi.closeConvocatoria(match.id))
                }
                disabled={actionLoading !== null}
                className="bg-[#5A5A40] text-white px-4 py-2 rounded-xl font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading === 'close' ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                )}
                <span>Cerrar convocatoria</span>
              </button>
            )}

            {match.estado === 'CONVOCATORIA_CERRADA' && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    runStateAction('reopen', () => matchesApi.reopenConvocatoria(match.id))
                  }
                  disabled={actionLoading !== null}
                  className="bg-white text-[#5A5A40] border border-[#EBE7DF] hover:bg-[#F1EFE7] px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'reopen' ? (
                    <span className="w-3.5 h-3.5 border-2 border-[#7B8B6F]/30 border-t-[#7B8B6F] rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[16px] text-[#8D8D7E]">replay</span>
                  )}
                  <span>Reabrir convocatoria</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    runStateAction('start', () => matchesApi.start(match.id))
                  }
                  disabled={actionLoading !== null}
                  className="bg-[#5A5A40] text-white px-4 py-2 rounded-xl font-mono text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'start' ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  )}
                  <span>Iniciar partido</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold bg-[#F1EFE7] text-[#8D8D7E]">
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            Solo lectura
          </span>
        )}
      </div>

      {actionError && (
        <div className="mb-4 bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-3 py-2 text-xs font-mono font-bold flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
          <span>{actionError}</span>
        </div>
      )}

      {!ADMIN_EDITABLE_STATUSES.includes(match.estado) && isAdmin && (
        <p className="mb-4 text-xs font-mono text-[#8D8D7E] bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-3 py-2">
          La convocatoria solo puede modificarse cuando la convocatoria está abierta.
        </p>
      )}

      {participations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {participations.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-2xl border border-[#EBE7DF] bg-[#F9F7F2]/60 hover:bg-[#F1EFE7] transition-colors"
            >
              <div
                onClick={() => onSelectPlayer(String(p.playerId))}
                className="flex items-center gap-3 cursor-pointer flex-grow min-w-0"
              >
                <div className="w-9 h-9 rounded-full bg-[#EBE7DF] flex items-center justify-center font-mono text-xs font-bold text-[#5A5A40] shrink-0">
                  {getInitials(p.playerNombreCompleto)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body text-sm font-semibold text-[#4A4A3F] truncate">
                    {p.playerNombreCompleto}
                  </span>
                  {p.teamSide && (
                    <span className="text-[10px] font-mono text-[#8D8D7E]">
                      Equipo {p.teamSide === 'EQUIPO_A' ? 'A' : 'B'}
                    </span>
                  )}
                </div>
              </div>

              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePlayer(p.playerId);
                  }}
                  className="text-[#C2623F] hover:text-[#A04E2E] p-1.5 rounded-full hover:bg-[#FFEBE5] transition-colors shrink-0"
                  title="Quitar de convocatoria"
                >
                  <span className="material-symbols-outlined text-[18px]">person_remove</span>
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="Todavía no hay jugadores convocados." />
      )}

      {canEdit && (
        <ConvocarPlayerControls
          matchId={match.id}
          participations={participations}
          onAdded={() => {
            refetch();
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
};