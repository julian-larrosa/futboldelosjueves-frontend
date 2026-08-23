import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError, attributesApi } from '../api';
import type { PlayerAttributeHistoryResponse } from '../api';

export interface AttributeRatingPlayer {
  playerId: number;
  nombreCompleto: string;
}

interface AttributeRatingsModalProps {
  isOpen: boolean;
  matchId: number;
  players: AttributeRatingPlayer[];
  onClose: () => void;
}

const ATTRIBUTE_FIELDS = [
  { key: 'tecnica', label: 'Técnica', short: 'TEC' },
  { key: 'fisico', label: 'Físico', short: 'FIS' },
  { key: 'definicion', label: 'Definición', short: 'DEF' },
  { key: 'mentalidad', label: 'Mentalidad', short: 'MEN' },
  { key: 'pase', label: 'Pase', short: 'PAS' },
] as const;

type AttributeFieldKey = (typeof ATTRIBUTE_FIELDS)[number]['key'];

type PlayerAttributeValues = Record<AttributeFieldKey, number>;

const DEFAULT_VALUES: PlayerAttributeValues = {
  tecnica: 5,
  fisico: 5,
  definicion: 5,
  mentalidad: 5,
  pase: 5,
};

function clampAttributeValue(raw: number): number {
  if (Number.isNaN(raw)) return 1;
  return Math.min(10, Math.max(1, Math.round(raw)));
}

const inputClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-3 text-sm font-body text-[#4A4A3F] placeholder-[#A3A395] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';

const attributeInputClassName =
  'w-11 py-1.5 text-center bg-[#F9F7F2] border border-[#EBE7DF] rounded-lg font-mono text-xs font-bold text-[#4A4A3F] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

export const AttributeRatingsModal: React.FC<AttributeRatingsModalProps> = ({
  isOpen,
  matchId,
  players,
  onClose,
}) => {
  const [values, setValues] = useState<Record<number, PlayerAttributeValues>>({});
  const [alreadyRatedIds, setAlreadyRatedIds] = useState<Set<number>>(new Set());
  const [checkingRated, setCheckingRated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setValues(
      Object.fromEntries(players.map((p) => [p.playerId, { ...DEFAULT_VALUES }])),
    );
    setError(null);
    setSuccess(null);

    // Pre-chequeo: jugadores que ya tienen atributos cargados en este partido
    let active = true;
    setCheckingRated(true);
    setAlreadyRatedIds(new Set());
    Promise.all(
      players.map(async (p) => {
        try {
          const history: PlayerAttributeHistoryResponse =
            await attributesApi.getPlayerAttributeHistory(p.playerId);
          return history.history.some((entry) => entry.matchId === matchId)
            ? p.playerId
            : null;
        } catch {
          return null;
        }
      }),
    ).then((ids) => {
      if (active) {
        setAlreadyRatedIds(new Set(ids.filter((id): id is number => id !== null)));
        setCheckingRated(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, matchId]);

  const pendingPlayers = useMemo(
    () => players.filter((p) => !alreadyRatedIds.has(p.playerId)),
    [players, alreadyRatedIds],
  );

  const handleChange = useCallback(
    (playerId: number, field: AttributeFieldKey, raw: string) => {
      const parsed = raw === '' ? '' : clampAttributeValue(Number(raw));
      setValues((prev) => ({
        ...prev,
        [playerId]: { ...prev[playerId], [field]: parsed === '' ? ('' as unknown as number) : parsed },
      }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (pendingPlayers.length === 0) {
      setError('Todos los jugadores ya tienen atributos cargados para este partido.');
      return;
    }

    for (const p of pendingPlayers) {
      for (const { key, label } of ATTRIBUTE_FIELDS) {
        const value = values[p.playerId]?.[key];
        if (typeof value !== 'number' || Number.isNaN(value)) {
          setError(`Completá ${label} de ${p.nombreCompleto}.`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      await attributesApi.submitMatchRatings(matchId, {
        ratings: pendingPlayers.map((p) => ({
          playerId: p.playerId,
          ...(Object.fromEntries(ATTRIBUTE_FIELDS.map(({ key }) => [key, values[p.playerId][key]])) as Record<
            AttributeFieldKey,
            number
          >),
        })),
      });
      setSuccess(`Atributos cargados para ${pendingPlayers.length} jugador(es).`);
      setAlreadyRatedIds(new Set(players.map((p) => p.playerId)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar los atributos.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[28px] border border-[#EBE7DF] card-shadow w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#EBE7DF]">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#5A5A40]">Cargar atributos</h2>
            <p className="text-xs text-[#8D8D7E] mt-0.5">
              Valores del partido del 1 al 10. Solo jugadores que jugaron efectivamente.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F1EFE7] transition-colors text-[#8D8D7E]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="overflow-y-auto px-6 py-4 space-y-3 grow">
            {checkingRated && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#8D8D7E] px-1">
                <span className="w-3.5 h-3.5 border-2 border-[#7B8B6F]/40 border-t-[#7B8B6F] rounded-full animate-spin" />
                <span>Verificando atributos existentes…</span>
              </div>
            )}

            {!checkingRated && pendingPlayers.length === 0 && (
              <div className="py-8 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-[#DCD6C8] block">task_alt</span>
                <p className="text-xs font-mono text-[#8D8D7E]">
                  Todos los jugadores ya tienen atributos cargados para este partido.
                </p>
              </div>
            )}

            {pendingPlayers.map((p) => (
              <div
                key={p.playerId}
                className="bg-[#F9F7F2]/60 border border-[#EBE7DF] rounded-2xl p-3"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-body text-sm font-semibold text-[#4A4A3F] truncate">
                    {p.nombreCompleto}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    {ATTRIBUTE_FIELDS.map(({ key, label, short }) => (
                      <label key={key} title={label} className="flex flex-col items-center gap-1">
                        <span className="font-mono text-[9px] font-bold text-[#8D8D7E]">{short}</span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          step={1}
                          value={values[p.playerId]?.[key] ?? ''}
                          onChange={(e) => handleChange(p.playerId, key, e.target.value)}
                          onBlur={(e) => {
                            if (e.target.value !== '') {
                              handleChange(p.playerId, key, String(clampAttributeValue(Number(e.target.value))));
                            }
                          }}
                          aria-label={`${label} de ${p.nombreCompleto}`}
                          className={attributeInputClassName}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {alreadyRatedIds.size > 0 && (
              <p className="text-[11px] font-mono text-[#8D8D7E] px-1 pt-1">
                Ya cargados: {players
                  .filter((p) => alreadyRatedIds.has(p.playerId))
                  .map((p) => p.nombreCompleto)
                  .join(', ')}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-[#EBE7DF] space-y-3">
            {success && (
              <div className="bg-[#EDF3E9] border border-[#7B8B6F]/30 text-[#4C5F3D] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-[#EBE7DF] font-mono text-xs font-bold text-[#8D8D7E] hover:bg-[#F1EFE7] transition-all"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={loading || checkingRated || pendingPlayers.length === 0 || Boolean(success)}
                className="flex-1 bg-[#5A5A40] text-white rounded-xl py-3 font-mono text-xs font-bold tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Guardando…</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Guardar atributos</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
