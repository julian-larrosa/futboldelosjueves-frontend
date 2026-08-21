import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ApiError, PLAYER_POSITIONS } from '../api';
import type { PlayerPosition } from '../api';

type Mode = 'login' | 'register' | 'register-hincha' | 'forgot';

const POSITION_LABELS: Record<PlayerPosition, string> = {
  ARQUERO: 'Arquero',
  DEFENSOR: 'Defensor',
  MEDIOCAMPISTA: 'Mediocampista',
  DELANTERO: 'Delantero',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-3 text-sm font-body text-[#4A4A3F] placeholder-[#A3A395] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';

const labelClassName = 'block font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E] mb-1.5';

const linkButtonClassName =
  'font-mono text-xs font-bold text-[#7B8B6F] hover:text-[#5A5A40] hover:underline transition-colors';

export const LoginScreen: React.FC = () => {
  const { login, register, registerHincha, forgotPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [posicion, setPosicion] = useState<PlayerPosition>('DELANTERO');
  const [confirmPassword, setConfirmPassword] = useState('');

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const validate = (): string | null => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      return 'Ingresá un email válido.';
    }
    if (mode === 'register') {
      if (!username.trim() || !nombre.trim() || !apellido.trim()) {
        return 'Completá usuario, nombre y apellido.';
      }
    }
    if (mode === 'register-hincha' && (!nombre.trim() || !apellido.trim())) {
      return 'Completá nombre y apellido.';
    }
    if (mode !== 'forgot' && !password) {
      return 'Ingresá tu contraseña.';
    }
    if ((mode === 'register' || mode === 'register-hincha') && password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (mode === 'forgot') {
      if (password.length < 8) {
        return 'La nueva contraseña debe tener al menos 8 caracteres.';
      }
      if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden.';
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else if (mode === 'register') {
        await register({
          username: username.trim(),
          email: email.trim(),
          password,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          posicion,
        });
      } else if (mode === 'register-hincha') {
        await registerHincha({
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          password,
        });
      } else {
        await forgotPassword({ email: email.trim(), newPassword: password });
        switchMode('login');
        setEmail('');
        setSuccessMessage('Contraseña actualizada. Ya podés iniciar sesión.');
        return;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado. Intentalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === 'register';
  const isHinchaRegister = mode === 'register-hincha';
  const isForgot = mode === 'forgot';
  const isAccountCreation = isRegister || isHinchaRegister;

  const modeTitle =
    isForgot
      ? { title: 'Recuperar contraseña', subtitle: 'Elegí una contraseña nueva para tu cuenta' }
      : isHinchaRegister
        ? { title: 'Crear cuenta de hincha', subtitle: 'Tu asistencia no se pierde, se registra' }
        : null;

  const submitLabel = isForgot
    ? 'Guardar contraseña'
    : isHinchaRegister
      ? 'Crear cuenta'
      : isRegister
        ? 'Crear cuenta'
        : 'Iniciar sesión';

  const submitIcon = isForgot ? 'lock_reset' : isAccountCreation ? 'person_add' : 'login';

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#4A4A3F] font-body flex items-center justify-center p-4 antialiased selection:bg-[#7B8B6F] selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-14 h-14 bg-[#7B8B6F] rounded-full flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[28px]">sports_soccer</span>
          </div>
          <span className="font-serif italic text-3xl font-bold tracking-tight text-[#5A5A40]">FDLJ</span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A3A395] font-bold">
            Liga de Fútbol
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] border border-[#EBE7DF] card-shadow overflow-hidden">
          {/* Mode Toggle (only for login / player register) */}
          {!modeTitle ? (
            <div className="flex bg-[#F1EFE7] p-1.5 gap-1 m-4 rounded-2xl border border-[#EBE7DF]">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  mode === 'login' ? 'bg-white shadow-xs text-[#5A5A40]' : 'text-[#8D8D7E] hover:text-[#5A5A40]'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  mode === 'register' ? 'bg-white shadow-xs text-[#5A5A40]' : 'text-[#8D8D7E] hover:text-[#5A5A40]'
                }`}
              >
                Crear cuenta
              </button>
            </div>
          ) : (
            <div className="px-6 pt-6 pb-1 text-center">
              <h1 className="font-serif italic text-xl font-bold tracking-tight text-[#5A5A40]">
                {modeTitle.title}
              </h1>
              <p className="text-xs text-[#8D8D7E] mt-1">{modeTitle.subtitle}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {(isRegister || isHinchaRegister) && (
              <div className={isHinchaRegister ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                {!isHinchaRegister && (
                  <div>
                    <label htmlFor="auth-username" className={labelClassName}>
                      Usuario
                    </label>
                    <input
                      id="auth-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="usuario"
                      required
                      className={inputClassName}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="auth-nombre" className={labelClassName}>
                    Nombre
                  </label>
                  <input
                    id="auth-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label htmlFor="auth-apellido" className={labelClassName}>
                    Apellido
                  </label>
                  <input
                    id="auth-apellido"
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Apellido"
                    required
                    className={inputClassName}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className={labelClassName}>
                {isForgot ? 'Email de tu cuenta' : 'Email'}
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@fdlj.com"
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="auth-password" className={labelClassName}>
                {isForgot ? 'Nueva contraseña' : 'Contraseña'}
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isForgot || isAccountCreation ? 'Mínimo 8 caracteres' : '••••••••'}
                required
                minLength={isForgot || isAccountCreation ? 8 : undefined}
                autoComplete={isForgot || isAccountCreation ? 'new-password' : 'current-password'}
                className={inputClassName}
              />
            </div>

            {isForgot && (
              <div>
                <label htmlFor="auth-confirm-password" className={labelClassName}>
                  Repetir nueva contraseña
                </label>
                <input
                  id="auth-confirm-password"
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
            )}

            {isRegister && (
              <div>
                <label htmlFor="auth-posicion" className={labelClassName}>
                  Posición
                </label>
                <select
                  id="auth-posicion"
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
            )}

            {successMessage && (
              <div className="bg-[#EDF3E9] border border-[#7B8B6F]/30 text-[#4C5F3D] rounded-xl px-4 py-3 text-xs font-mono font-bold flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

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
                  <span>Procesando…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">{submitIcon}</span>
                  <span>{submitLabel}</span>
                </>
              )}
            </button>
          </form>

          {/* Secondary actions */}
          <div className="px-6 pb-6 space-y-2 text-center">
            {mode === 'login' && (
              <>
                <p>
                  <button type="button" onClick={() => switchMode('forgot')} className={linkButtonClassName}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </p>
                <p className="text-xs text-[#A3A395]">
                  ¿Venís solo a alentar?{' '}
                  <button type="button" onClick={() => switchMode('register-hincha')} className={linkButtonClassName}>
                    Creá tu cuenta de hincha
                  </button>
                </p>
              </>
            )}
            {(isForgot || isHinchaRegister) && (
              <p>
                <button type="button" onClick={() => switchMode('login')} className={linkButtonClassName}>
                  Volver a iniciar sesión
                </button>
              </p>
            )}
            {isRegister && (
              <p className="text-xs text-[#A3A395]">
                ¿Ya jugás y querés tu cuenta?{' '}
                <button type="button" onClick={() => switchMode('login')} className={linkButtonClassName}>
                  Iniciá sesión
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] font-mono text-[#A3A395] mt-6">
          Liga FDLJ — Temporada {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
