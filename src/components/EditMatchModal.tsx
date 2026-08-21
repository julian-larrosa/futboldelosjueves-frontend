import React, { useEffect, useState } from 'react';
import { matchesApi, participationsApi, MatchStatus } from '../api';
import { useApi } from '../hooks/useApi';
import { LoadingState } from './StateViews';
import { formatMatchDate, formatMatchTime } from '../utils/format';

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: number;
}

const STATUS_LABEL: Record<MatchStatus, string> = {
  PROGRAMADO: 'Programado',
  CONVOCATORIA_ABIERTA: 'Convocatoria abierta',
  CONVOCATORIA_CERRADA: 'Convocatoria cerrada',
  EN_CURSO: 'En curso',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export const EditMatchModal: React.FC<EditMatchModalProps> = ({ isOpen, onClose, matchId }) => {
  const matchFetcher = React.useCallback(() => matchesApi.get(matchId), [matchId]);
  const matchQuery = useApi(matchFetcher);

  const participationsFetcher = React.useCallback(
    () => participationsApi.list(matchId, { size: 100 }),
    [matchId],
  );
  const participationsQuery = useApi(participationsFetcher);

  const [fechaHora, setFechaHora] = useState('');
  const [lugar, setLugar] = useState('');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [goals, setGoals] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  const match = matchQuery.data;
  const participations = participationsQuery.data?.content ?? [];

  useEffect(() => {
    if (match) {
      setFechaHora(toDatetimeLocal(match.fechaHora));
      setLugar(match.lugar ?? '');
      setScoreA(match.golesEquipoA ?? 0);
      setScoreB(match.golesEquipoB ?? 0);
    }
  }, [match]);

  useEffect(() => {
    const next: Record<number, number> = {};
    for (const p of participations) {
      next[p.playerId] = p.goles;
    }
    setGoals((prev) => ({ ...prev, ...next }));
  }, [participations]);

  if (!isOpen) return null;

  if (matchQuery.loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <div className="bg-white w-full max-w-lg rounded-[28px] p-8 card-shadow border border-[#EBE7DF]">
          <LoadingState label="Cargando partido..." />
        </div>
      </div>
    );
  }

  if (matchQuery.error || !match) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <div className="bg-white w-full max-w-lg rounded-[28px] p-8 card-shadow border border-[#EBE7DF]">
          <p className="text-center font-body text-sm text-[#4A4A3F]">
            {matchQuery.error ?? 'No se encontró el partido.'}
          </p>
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl font-mono text-xs font-bold bg-[#5A5A40] text-white hover:opacity-90"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const runAction = async (action: () => Promise<unknown>, successText: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      matchQuery.refetch();
      showMessage('success', successText);
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Error en la operación.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveData = () => {
    if (!fechaHora) {
      showMessage('error', 'La fecha y hora son obligatorias.');
      return;
    }
    runAction(
      () => matchesApi.update(matchId, { fechaHora: new Date(fechaHora).toISOString(), lugar }),
      'Datos del partido actualizados.',
    );
  };

  const handleFinish = () => {
    runAction(
      () => matchesApi.finish(matchId, { golesEquipoA: scoreA, golesEquipoB: scoreB }),
      'Partido finalizado con el marcador ingresado.',
    );
  };

  const handleSaveGoals = (playerId: number) => {
    runAction(
      () =>
        participationsApi.updateStatistics(matchId, playerId, {
          goles: goals[playerId] ?? 0,
          jugoEfectivamente: true,
        }),
      'Goles del jugador actualizados.',
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[28px] p-6 md:p-8 card-shadow border border-[#EBE7DF] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#8D8D7E] hover:text-[#5A5A40] p-1.5 rounded-full hover:bg-[#F1EFE7] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[#7B8B6F] mb-1">
              <span className="material-symbols-outlined text-[20px]">edit_document</span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Panel de Administración
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#5A5A40]">
              Editar Resultado / Stats
            </h2>
            <p className="font-body text-[#8D8D7E] text-xs mt-1">
              {formatMatchDate(match.fechaHora)} • {formatMatchTime(match.fechaHora)} • Estado:{' '}
              {STATUS_LABEL[match.estado]}
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-mono font-bold border ${
                message.type === 'success'
                  ? 'bg-[#E2E8DC] text-[#48563F] border-[#7B8B6F]/40'
                  : 'bg-[#FFEBE5] text-[#9A4A4A] border-[#D97B66]/40'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Datos del partido */}
          <div className="space-y-4">
            <label className="block font-mono text-xs font-bold text-[#5A5A40] uppercase">
              Datos del partido
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                className="bg-[#F1EFE7] text-sm font-semibold text-[#4A4A3F] p-2.5 rounded-xl border border-[#EBE7DF] focus:ring-2 focus:ring-[#7B8B6F]"
              />
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder="Lugar"
                className="bg-[#F1EFE7] text-sm font-semibold text-[#4A4A3F] p-2.5 rounded-xl border border-[#EBE7DF] focus:ring-2 focus:ring-[#7B8B6F]"
              />
            </div>
            <button
              onClick={handleSaveData}
              disabled={busy}
              className="w-full py-2.5 bg-white border border-[#EBE7DF] text-[#5A5A40] font-mono text-xs font-bold rounded-xl hover:bg-[#F1EFE7] transition-colors disabled:opacity-50"
            >
              Guardar datos
            </button>
          </div>

          {/* Acciones por estado */}
          <div className="space-y-3">
            <label className="block font-mono text-xs font-bold text-[#5A5A40] uppercase">
              Acciones ({STATUS_LABEL[match.estado]})
            </label>

            {match.estado === 'PROGRAMADO' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    runAction(() => matchesApi.openConvocatoria(matchId), 'Convocatoria abierta.')
                  }
                  disabled={busy}
                  className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-[#5A5A40] text-white hover:opacity-90 disabled:opacity-50"
                >
                  Abrir convocatoria
                </button>
                <button
                  onClick={() =>
                    runAction(() => matchesApi.cancel(matchId), 'Partido cancelado.')
                  }
                  disabled={busy}
                  className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-[#FFEBE5] text-[#9A4A4A] border border-[#D97B66]/40 hover:opacity-80 disabled:opacity-50"
                >
                  Cancelar partido
                </button>
              </div>
            )}

            {match.estado === 'CONVOCATORIA_ABIERTA' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    runAction(() => matchesApi.closeConvocatoria(matchId), 'Convocatoria cerrada.')
                  }
                  disabled={busy}
                  className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-[#5A5A40] text-white hover:opacity-90 disabled:opacity-50"
                >
                  Cerrar convocatoria
                </button>
                <button
                  onClick={() =>
                    runAction(() => matchesApi.cancel(matchId), 'Partido cancelado.')
                  }
                  disabled={busy}
                  className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-[#FFEBE5] text-[#9A4A4A] border border-[#D97B66]/40 hover:opacity-80 disabled:opacity-50"
                >
                  Cancelar partido
                </button>
              </div>
            )}

            {match.estado === 'CONVOCATORIA_CERRADA' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    runAction(() => matchesApi.reopenConvocatoria(matchId), 'Convocatoria reabierta.')
                  }
                  disabled={busy}
                  className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-[#F1EFE7] text-[#5A5A40] border border-[#EBE7DF] hover:bg-[#EBE7DF] disabled:opacity-50"
                >
                  Reabrir convocatoria
                </button>
                <button
                  onClick={() =>
                    runAction(() => matchesApi.start(matchId), 'Partido iniciado.')
                  }
                  disabled={busy}
                  className="py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-[#5A5A40] text-white hover:opacity-90 disabled:opacity-50"
                >
                  Iniciar partido
                </button>
              </div>
            )}

            {match.estado === 'EN_CURSO' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 bg-[#F9F7F2]/60 p-4 rounded-2xl border border-[#EBE7DF]">
                  <div>
                    <label className="block font-serif text-xs font-bold text-[#5A5A40] mb-1">
                      Equipo A
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={scoreA}
                      onChange={(e) => setScoreA(Number(e.target.value))}
                      className="w-full bg-white text-xl font-serif font-bold text-center text-[#5A5A40] p-2.5 rounded-xl border border-[#EBE7DF] focus:ring-2 focus:ring-[#7B8B6F]"
                    />
                  </div>
                  <div>
                    <label className="block font-serif text-xs font-bold text-[#5A5A40] mb-1">
                      Equipo B
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={scoreB}
                      onChange={(e) => setScoreB(Number(e.target.value))}
                      className="w-full bg-white text-xl font-serif font-bold text-center text-[#5A5A40] p-2.5 rounded-xl border border-[#EBE7DF] focus:ring-2 focus:ring-[#7B8B6F]"
                    />
                  </div>
                </div>
                <button
                  onClick={handleFinish}
                  disabled={busy}
                  className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-[#5A5A40] text-white hover:opacity-90 disabled:opacity-50"
                >
                  Finalizar partido con marcador
                </button>
              </div>
            )}

            </div>

          {/* Goles por jugador */}
          {(match.estado === 'EN_CURSO' || match.estado === 'FINALIZADO') &&
            participations.length > 0 && (
              <div className="space-y-3">
                <label className="block font-mono text-xs font-bold text-[#5A5A40] uppercase">
                  Goles por jugador
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {participations.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 p-2.5 bg-[#F1EFE7] rounded-xl text-xs font-semibold text-[#4A4A3F] border border-[#EBE7DF]"
                    >
                      <span className="truncate">{p.playerNombreCompleto}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={goals[p.playerId] ?? 0}
                          onChange={(e) =>
                            setGoals((prev) => ({ ...prev, [p.playerId]: Number(e.target.value) }))
                          }
                          className="w-16 bg-white text-xs font-bold text-center text-[#4A4A3F] p-2 rounded-lg border border-[#EBE7DF]"
                        />
                        <button
                          onClick={() => handleSaveGoals(p.playerId)}
                          disabled={busy}
                          className="px-3 py-2 bg-[#5A5A40] text-white text-[10px] font-mono font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl font-mono text-xs font-bold text-[#8D8D7E] hover:bg-[#F1EFE7] hover:text-[#5A5A40] transition-colors border border-[#EBE7DF]"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                matchQuery.refetch();
                participationsQuery.refetch();
                showMessage('success', 'Datos recargados.');
              }}
              disabled={busy}
              className="w-2/3 py-3 rounded-xl font-mono text-xs font-bold bg-[#5A5A40] hover:opacity-90 text-white transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Recargar datos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};