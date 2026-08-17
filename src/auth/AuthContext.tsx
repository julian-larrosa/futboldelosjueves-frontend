import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, clearToken, getToken, onUnauthorized, setToken } from '../api';
import type { AuthResponse, PlayerResponse, RegisterRequest, UserResponse } from '../api';

const SESSION_STORAGE_KEY = 'fdlj.session';

interface StoredSession {
  user: UserResponse;
  player: PlayerResponse;
}

interface AuthContextValue {
  user: UserResponse | null;
  player: PlayerResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const candidate = parsed as Partial<StoredSession>;
    if (
      candidate.user &&
      typeof candidate.user === 'object' &&
      candidate.player &&
      typeof candidate.player === 'object'
    ) {
      return parsed as StoredSession;
    }
    return null;
  } catch {
    return null;
  }
}

function persistSession(session: StoredSession): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // storage unavailable — session continues without persistence
  }
}

function clearStoredSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // storage unavailable — nothing to clear
  }
}

function toStoredSession(response: AuthResponse): StoredSession {
  return { user: response.user, player: response.player };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [session, setSession] = useState<StoredSession | null>(() => loadStoredSession());

  const logout = useCallback(() => {
    clearToken();
    clearStoredSession();
    setTokenState(null);
    setSession(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onUnauthorized(logout);
    return unsubscribe;
  }, [logout]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await authApi.login({ email, password });
    setToken(response.token);
    persistSession(toStoredSession(response));
    setTokenState(response.token);
    setSession(toStoredSession(response));
  }, []);

  const register = useCallback(async (request: RegisterRequest): Promise<void> => {
    const response = await authApi.register(request);
    setToken(response.token);
    persistSession(toStoredSession(response));
    setTokenState(response.token);
    setSession(toStoredSession(response));
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = token !== null && session !== null;
    return {
      user: session?.user ?? null,
      player: session?.player ?? null,
      token,
      isAuthenticated,
      isAdmin: session?.user.role === 'ADMIN',
      login,
      register,
      logout,
    };
  }, [token, session, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}