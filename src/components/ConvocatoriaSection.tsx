import React, { useCallback, useMemo, useState } from 'react';
import { ApiError, participationsApi, playersApi } from '../api';
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

// El backend solo permite agregar/quitar convocados en estos estados
const ADMIN_EDITABLE_STATUSES = ['PROGRAMADO', 'CONVOCATORIA_ABIERTA'];

const selectClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-2.5 text-sm font-body text-[#4A4A3F] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';

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
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availablePlayers = useMemo(() => {
    const all = playersQuery.data?.content ?? [];
    const convokedIds = new Set(participations.map((p) => p.playerId));
    return all.filter((p) => p.activo && !convokedIds.has(p.id));
  }, [playersQuery.data, participations]);

  const handleAdd = async () => {
    if (!selectedPlayerId || loading) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await participationsApi.add(matchId, { playerId: Number(selectedPlayerId) });
      setSelectedPlayerId('');
      onAdded();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo convocar al jugador.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 p-4 rounded-2xl bg-[#F1EFE7] border border-[#EBE7DF] space-y-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-[#7B8B6F]">group_add</span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E]">
          Convocar jugador
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          className={selectClassName}
          disabled={playersQuery.loading}
        >
          <option value="">
            {playersQuery.loading
              ? 'Cargando jugadores…'
              : availablePlayers.length > 0
                ? 'Seleccionar jugador…'
                : 'No hay más jugadores disponibles'}
          </option>
          {availablePlayers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.apellido}, {p.nombre}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedPlayerId || loading}
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
              <span>Convocar</span>
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

        {!isAdmin && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold bg-[#F1EFE7] text-[#8D8D7E]">
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            Solo lectura
          </span>
        )}
      </div>

      {!ADMIN_EDITABLE_STATUSES.includes(match.estado) && isAdmin && (
        <p className="mb-4 text-xs font-mono text-[#8D8D7E] bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-3 py-2">
          La convocatoria solo puede modificarse con el partido programado o con convocatoria abierta.
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
