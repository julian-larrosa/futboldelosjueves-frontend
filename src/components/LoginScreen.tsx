import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ApiError, PLAYER_POSITIONS } from '../api';
import type { PlayerPosition } from '../api';

type Mode = 'login' | 'register';

const POSITION_LABELS: Record<PlayerPosition, string> = {
  ARQUERO: 'Arquero',
  DEFENSOR: 'Defensor',
  MEDIOCAMPISTA: 'Mediocampista',
  DELANTERO: 'Delantero',
};

const inputClassName =
  'w-full bg-[#F9F7F2] border border-[#EBE7DF] rounded-xl px-4 py-3 text-sm font-body text-[#4A4A3F] placeholder-[#A3A395] focus:outline-none focus:ring-2 focus:ring-[#7B8B6F] transition-shadow';

const labelClassName = 'block font-mono text-[11px] font-bold uppercase tracking-wider text-[#8D8D7E] mb-1.5';

export const LoginScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [posicion, setPosicion] = useState<PlayerPosition>('DELANTERO');

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register({
          username: username.trim(),
          email: email.trim(),
          password,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          posicion,
        });
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
          {/* Mode Toggle */}
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

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {isRegister && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="login-username" className={labelClassName}>
                    Usuario
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuario"
                    required
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label htmlFor="login-nombre" className={labelClassName}>
                    Nombre
                  </label>
                  <input
                    id="login-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label htmlFor="login-apellido" className={labelClassName}>
                    Apellido
                  </label>
                  <input
                    id="login-apellido"
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
              <label htmlFor="login-email" className={labelClassName}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@fdlj.com"
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="login-password" className={labelClassName}>
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={isRegister ? 8 : undefined}
                className={inputClassName}
              />
            </div>

            {isRegister && (
              <div>
                <label htmlFor="login-posicion" className={labelClassName}>
                  Posición
                </label>
                <select
                  id="login-posicion"
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
                  <span>{isRegister ? 'Creando cuenta…' : 'Ingresando…'}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {isRegister ? 'person_add' : 'login'}
                  </span>
                  <span>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono text-[#A3A395] mt-6">
          Liga FDLJ — Temporada 2024
        </p>
      </div>
    </div>
  );
};