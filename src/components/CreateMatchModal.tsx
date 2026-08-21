import React, { useState } from 'react';
import { matchesApi } from '../api';
import type { MatchRequest } from '../api';

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const inputClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-3 text-sm font-body text-[#4A4A3F] placeholder-[#A3A395] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';
const labelClassName = 'block font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E] mb-1.5';

export const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('20:30');
  const [lugar, setLugar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const parsed = new Date(`${fecha}T${hora}:00`);
      if (Number.isNaN(parsed.getTime())) {
        setError('Fecha u hora inválida.');
        return;
      }
      const request: MatchRequest = {
        fechaHora: parsed.toISOString(),
        lugar: lugar.trim() || '',
      };
      await matchesApi.create(request);
      onCreated();
      onClose();
      setFecha('');
      setHora('20:30');
      setLugar('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el partido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-[28px] border border-[#EBE7DF] card-shadow w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#5A5A40]">Crear Partido</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F1EFE7] transition-colors text-[#8D8D7E]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <div>
            <label htmlFor="match-date" className={labelClassName}>
              Fecha
            </label>
            <input
              id="match-date"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className={inputClassName}
            />
          </div>

          {/* Hora */}
          <div>
            <label htmlFor="match-time" className={labelClassName}>
              Hora
            </label>
            <input
              id="match-time"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              className={inputClassName}
            />
          </div>

          {/* Lugar */}
          <div>
            <label htmlFor="match-location" className={labelClassName}>
              Lugar (opcional)
            </label>
            <input
              id="match-location"
              type="text"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Ej: Cancha 1 - Cancha sintetica"
              className={inputClassName}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-[#EBE7DF] font-mono text-xs font-bold text-[#8D8D7E] hover:bg-[#F1EFE7] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !fecha}
              className="flex-1 bg-[#5A5A40] text-white rounded-xl py-3 font-mono text-xs font-bold tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Crear Partido</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
