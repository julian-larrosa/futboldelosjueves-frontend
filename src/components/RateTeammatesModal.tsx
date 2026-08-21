import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { participationsApi, ratingsApi } from '../api';
import { useApi } from '../hooks/useApi';
import { LoadingState } from './StateViews';

interface RateTeammatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: number;
  currentPlayerId: number;
}

export const RateTeammatesModal: React.FC<RateTeammatesModalProps> = ({
  isOpen,
  onClose,
  matchId,
  currentPlayerId,
}) => {
  const participationsFetcher = React.useCallback(
    () => participationsApi.list(matchId, { size: 100 }),
    [matchId],
  );
  const participationsQuery = useApi(participationsFetcher);

  const teammates = (participationsQuery.data?.content ?? []).filter(
    (p) => p.playerId !== currentPlayerId,
  );

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [puntaje, setPuntaje] = useState(8);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  if (participationsQuery.loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <div className="bg-white w-full max-w-lg rounded-[28px] p-8 card-shadow border border-[#EBE7DF]">
          <LoadingState label="Cargando convocatoria..." />
        </div>
      </div>
    );
  }

  if (participationsQuery.error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <div className="bg-white w-full max-w-lg rounded-[28px] p-8 card-shadow border border-[#EBE7DF]">
          <p className="text-center font-body text-sm text-[#4A4A3F]">
            {participationsQuery.error}
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

  const targetPlayer =
    teammates.find((p) => p.playerId === selectedPlayerId) ?? teammates[0] ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPlayer) {
      setError('No hay jugadores disponibles para calificar.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await ratingsApi.create(matchId, { calificadoId: targetPlayer.playerId, puntaje });
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#5A5A40', '#7B8B6F', '#D2B48C', '#E2E8DC'],
        });
      } catch {
        // ignore if unavailable
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la calificación.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[28px] p-6 md:p-8 card-shadow border border-[#EBE7DF] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#8D8D7E] hover:text-[#5A5A40] p-1.5 rounded-full hover:bg-[#F1EFE7] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#E2E8DC] text-[#48563F] rounded-full flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#5A5A40]">
              ¡Calificación Enviada!
            </h3>
            <p className="font-body text-[#8D8D7E] text-sm">
              Has calificado a {targetPlayer?.playerNombreCompleto} con{' '}
              <strong className="text-[#5A5A40] font-bold">{puntaje}</strong> / 10.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#7B8B6F] mb-1">
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Votación Oficial Post-Partido
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#5A5A40]">
                Calificar a un Compañero
              </h2>
              <p className="font-body text-[#8D8D7E] text-xs mt-1">
                Evalúa el desempeño de tus compañeros con una nota del 1 al 10.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-xs font-mono font-bold bg-[#FFEBE5] text-[#9A4A4A] border border-[#D97B66]/40">
                {error}
              </div>
            )}

            {teammates.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-[#8D8D7E]">
                No hay jugadores disponibles para calificar en este encuentro.
              </div>
            ) : (
              <>
                {/* Teammate Selection */}
                <div>
                  <label className="block font-mono text-xs font-bold text-[#5A5A40] mb-2 uppercase">
                    Seleccionar Jugador:
                  </label>
                  <select
                    value={targetPlayer?.playerId ?? ''}
                    onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                    className="w-full bg-[#F1EFE7] text-sm font-semibold text-[#4A4A3F] py-3 px-4 rounded-xl border border-[#EBE7DF] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F]"
                  >
                    {teammates.map((p) => (
                      <option key={p.playerId} value={p.playerId}>
                        {p.playerNombreCompleto}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Puntaje Slider */}
                <div className="space-y-4 bg-[#F9F7F2]/60 p-4 rounded-2xl border border-[#EBE7DF]">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                      <span className="text-[#5A5A40]">Puntaje</span>
                      <span className="text-[#7B8B6F] font-bold text-sm">{puntaje} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={puntaje}
                      onChange={(e) => setPuntaje(Number(e.target.value))}
                      className="w-full accent-[#5A5A40]"
                    />
                  </div>

                  {/* Selected Value Box */}
                  <div className="pt-2 border-t border-[#EBE7DF] flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#5A5A40]">
                      Calificación Seleccionada:
                    </span>
                    <span className="font-serif text-xl font-bold bg-[#5A5A40] text-white px-3.5 py-1 rounded-xl shadow-xs">
                      {puntaje}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 py-3 rounded-xl font-mono text-xs font-bold text-[#8D8D7E] hover:bg-[#F1EFE7] hover:text-[#5A5A40] transition-colors border border-[#EBE7DF]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={busy || !targetPlayer}
                    className="w-2/3 py-3 rounded-xl font-mono text-xs font-bold bg-[#5A5A40] hover:opacity-90 text-white transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>Guardar Calificación</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};