import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Match, MatchPlayerRating, Player } from '../types';

interface RateTeammatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  players: Player[];
  onSubmitRating: (newRating: MatchPlayerRating) => void;
}

export const RateTeammatesModal: React.FC<RateTeammatesModalProps> = ({
  isOpen,
  onClose,
  match,
  players,
  onSubmitRating,
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(
    match.lineupA[0]?.id || players[0]?.id || 'p-carlos-r'
  );
  const [ritmo, setRitmo] = useState(8);
  const [tiro, setTiro] = useState(8);
  const [pase, setPase] = useState(8);
  const [defensa, setDefensa] = useState(7);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const targetPlayer =
    players.find((p) => p.id === selectedPlayerId) ||
    players[0];

  const calculatedGlobal = Number(((ritmo + tiro + pase + defensa) / 4).toFixed(1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const initials = targetPlayer.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newRating: MatchPlayerRating = {
      playerId: targetPlayer.id,
      name: targetPlayer.name,
      initials,
      position: targetPlayer.position,
      ritmo,
      tiro,
      pase,
      defensa,
      global: calculatedGlobal,
    };

    onSubmitRating(newRating);

    // Fire confetti celebration
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
              Has calificado a {targetPlayer.name} con un promedio oficial de{' '}
              <strong className="text-[#5A5A40] font-bold">{calculatedGlobal}</strong>.
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
                Evalúa el desempeño de tus compañeros para la Jornada {match.jornada}.
              </p>
            </div>

            {/* Teammate Selection */}
            <div>
              <label className="block font-mono text-xs font-bold text-[#5A5A40] mb-2 uppercase">
                Seleccionar Jugador:
              </label>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-full bg-[#F1EFE7] text-sm font-semibold text-[#4A4A3F] py-3 px-4 rounded-xl border border-[#EBE7DF] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F]"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.position})
                  </option>
                ))}
              </select>
            </div>

            {/* Attribute Sliders */}
            <div className="space-y-4 bg-[#F9F7F2]/60 p-4 rounded-2xl border border-[#EBE7DF]">
              {/* Ritmo */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                  <span className="text-[#5A5A40]">Ritmo & Despliegue</span>
                  <span className="text-[#7B8B6F] font-bold text-sm">{ritmo} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={ritmo}
                  onChange={(e) => setRitmo(Number(e.target.value))}
                  className="w-full accent-[#5A5A40]"
                />
              </div>

              {/* Tiro */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                  <span className="text-[#5A5A40]">Tiro & Definición</span>
                  <span className="text-[#7B8B6F] font-bold text-sm">{tiro} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={tiro}
                  onChange={(e) => setTiro(Number(e.target.value))}
                  className="w-full accent-[#5A5A40]"
                />
              </div>

              {/* Pase */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                  <span className="text-[#5A5A40]">Pase & Visión</span>
                  <span className="text-[#7B8B6F] font-bold text-sm">{pase} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={pase}
                  onChange={(e) => setPase(Number(e.target.value))}
                  className="w-full accent-[#5A5A40]"
                />
              </div>

              {/* Defensa */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                  <span className="text-[#5A5A40]">Defensa & Presión</span>
                  <span className="text-[#7B8B6F] font-bold text-sm">{defensa} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={defensa}
                  onChange={(e) => setDefensa(Number(e.target.value))}
                  className="w-full accent-[#5A5A40]"
                />
              </div>

              {/* Calculated Rating Box */}
              <div className="pt-2 border-t border-[#EBE7DF] flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#5A5A40]">
                  Calificación Global Calculada:
                </span>
                <span className="font-serif text-xl font-bold bg-[#5A5A40] text-white px-3.5 py-1 rounded-xl shadow-xs">
                  {calculatedGlobal}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block font-mono text-xs font-bold text-[#5A5A40] mb-1.5 uppercase">
                Comentario o Reconocimiento (Opcional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ej. Gran asistencia en el segundo gol y mucho sacrificio defensivo..."
                rows={2}
                className="w-full bg-[#F1EFE7] text-xs text-[#4A4A3F] p-3 rounded-xl border border-[#EBE7DF] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F]"
              ></textarea>
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
                className="w-2/3 py-3 rounded-xl font-mono text-xs font-bold bg-[#5A5A40] hover:opacity-90 text-white transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Guardar Calificación</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
