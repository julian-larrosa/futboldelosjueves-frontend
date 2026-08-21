import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api';

const inputClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-3 text-sm font-body text-[#4A4A3F] placeholder-[#A3A395] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';

const labelClassName = 'block font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E] mb-1.5';

export const ForcedPasswordChangeScreen: React.FC = () => {
  const { user, changeMyPassword, completePasswordChange, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      await changeMyPassword({ currentPassword, newPassword });
      completePasswordChange();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('No se pudo cambiar la contraseña. Intentalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A4A3F] font-body flex items-center justify-center p-4 antialiased selection:bg-[#7B8B6F] selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-14 h-14 bg-[#7B8B6F] rounded-full flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[28px]">lock_reset</span>
          </div>
          <span className="font-serif italic text-3xl font-bold tracking-tight text-[#5A5A40]">FDLJ</span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A3A395] font-bold">
            Liga de Fútbol
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] border border-[#EBE7DF] card-shadow overflow-hidden">
          <div className="px-6 pt-6 pb-1 text-center">
            <h1 className="font-serif italic text-xl font-bold tracking-tight text-[#5A5A40]">
              Cambiá tu contraseña
            </h1>
            <p className="text-xs text-[#8D8D7E] mt-1">
              Un administrador restableció tu contraseña. Necesitás elegir una nueva para continuar.
            </p>
            {user && (
              <p className="font-mono text-[11px] font-bold text-[#7B8B6F] mt-2">{user.email}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
            <div>
              <label htmlFor="forced-current-password" className={labelClassName}>
                Contraseña actual
              </label>
              <input
                id="forced-current-password"
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
              <label htmlFor="forced-new-password" className={labelClassName}>
                Nueva contraseña
              </label>
              <input
                id="forced-new-password"
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
              <label htmlFor="forced-confirm-password" className={labelClassName}>
                Repetir nueva contraseña
              </label>
              <input
                id="forced-confirm-password"
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

            {error && (
              <div className="bg-[#FFEBE5] border border-[#D97B66]/30 text-[#C2623F] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5A5A40] text-white rounded-xl py-3 font-mono text-xs font-bold tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Guardando…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Guardar y continuar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl py-2.5 font-mono text-xs font-bold text-[#8D8D7E] hover:text-[#C2623F] hover:bg-[#FFEBE5] transition-all"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono text-[#A3A395] mt-6">
          Liga FDLJ — Temporada {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
