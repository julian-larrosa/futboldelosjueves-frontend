import React, { useState, useEffect } from 'react';
import { playersApi, PLAYER_POSITIONS } from '../api';
import type { PlayerPosition, PlayerResponse, PlayerRequest } from '../api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerResponse;
  onUpdated: () => void;
}

const POSITION_LABELS: Record<PlayerPosition, string> = {
  ARQUERO: 'Arquero',
  DEFENSOR: 'Defensor',
  MEDIOCAMPISTA: 'Mediocampista',
  DELANTERO: 'Delantero',
};

const inputClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-3 text-sm font-body text-[#4A4A3F] placeholder-[#A3A395] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';
const labelClassName = 'block font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E] mb-1.5';

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  player,
  onUpdated,
}) => {
  const [nombre, setNombre] = useState(player.nombre);
  const [apellido, setApellido] = useState(player.apellido);
  const [posicion, setPosicion] = useState<PlayerPosition>(player.posicion);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNombre(player.nombre);
      setApellido(player.apellido);
      setPosicion(player.posicion);
      setError(null);
    }
  }, [isOpen, player]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const request: PlayerRequest = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: player.email,
        posicion,
      };
      await playersApi.update(player.id, request);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-[28px] border border-[#EBE7DF] card-shadow w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#5A5A40]">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F1EFE7] transition-colors text-[#8D8D7E]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-nombre" className={labelClassName}>Nombre</label>
            <input
              id="edit-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="edit-apellido" className={labelClassName}>Apellido</label>
            <input
              id="edit-apellido"
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="edit-posicion" className={labelClassName}>Posicion</label>
            <select
              id="edit-posicion"
              value={posicion}
              onChange={(e) => setPosicion(e.target.value as PlayerPosition)}
              className={inputClassName}
            >
              {PLAYER_POSITIONS.map((position) => (
                <option key={position} value={position}>
                  {POSITION_LABELS[position]}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

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
              disabled={loading}
              className="flex-1 bg-[#5A5A40] text-white rounded-xl py-3 font-mono text-xs font-bold tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
