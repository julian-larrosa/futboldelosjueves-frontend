import React, { useEffect, useState } from 'react';
import { ApiError, authApi } from '../api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-3 text-sm font-body text-[#4A4A3F] placeholder-[#A3A395] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';
const labelClassName = 'block font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E] mb-1.5';

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Ingresá tu contraseña actual.');
      return;
    }
    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await authApi.changeMyPassword({ currentPassword, newPassword });
      setSuccess('Contraseña actualizada correctamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'No se pudo cambiar la contraseña.',
      );
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
          <h2 className="font-serif text-xl font-bold text-[#5A5A40]">Cambiar contraseña</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F1EFE7] transition-colors text-[#8D8D7E]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="change-current-password" className={labelClassName}>
              Contraseña actual
            </label>
            <input
              id="change-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="change-new-password" className={labelClassName}>
              Nueva contraseña
            </label>
            <input
              id="change-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="change-confirm-password" className={labelClassName}>
              Repetir nueva contraseña
            </label>
            <input
              id="change-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClassName}
            />
          </div>

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

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-[#EBE7DF] font-mono text-xs font-bold text-[#8D8D7E] hover:bg-[#F1EFE7] transition-all"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#5A5A40] text-white rounded-xl py-3 font-mono text-xs font-bold tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Guardando…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  <span>Guardar contraseña</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
