import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, clearAllTokens, getToken, onUnauthorized, setRefreshToken, setToken } from '../api';
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  PlayerResponse,
  RegisterHinchaRequest,
  RegisterRequest,
  UserResponse,
} from '../api';

const SESSION_STORAGE_KEY = 'fdlj.session';

interface StoredSession {
  user: UserResponse;
  player: PlayerResponse | null;
  mustChangePassword: boolean;
}

interface AuthContextValue {
  user: UserResponse | null;
  player: PlayerResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHincha: boolean;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (request: RegisterRequest) => Promise<void>;
  registerHincha: (request: RegisterHinchaRequest) => Promise<void>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>;
  changeMyPassword: (request: ChangePasswordRequest) => Promise<void>;
  completePasswordChange: () => void;
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
      (candidate.player === null ||
        (candidate.player && typeof candidate.player === 'object'))
    ) {
      return {
        user: candidate.user,
        player: candidate.player ?? null,
        mustChangePassword: candidate.mustChangePassword === true,
      };
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
  return {
    user: response.user,
    player: response.player ?? null,
    mustChangePassword: response.mustChangePassword === true,
  };
}

function handleAuthResponse(response: AuthResponse): void {
  setToken(response.token);
  if (response.refreshToken) {
    setRefreshToken(response.refreshToken);
  }
  persistSession(toStoredSession(response));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [session, setSession] = useState<StoredSession | null>(() => loadStoredSession());

  const logout = useCallback(() => {
    clearAllTokens();
    clearStoredSession();
    setTokenState(null);
    setSession(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onUnauthorized(logout);
    return unsubscribe;
  }, [logout]);

  const applyAuthResponse = useCallback((response: AuthResponse): void => {
    handleAuthResponse(response);
    setTokenState(response.token);
    setSession(toStoredSession(response));
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      const response = await authApi.login({ email, password });
      applyAuthResponse(response);
      return response;
    },
    [applyAuthResponse],
  );

  const register = useCallback(
    async (request: RegisterRequest): Promise<void> => {
      const response = await authApi.register(request);
      applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const registerHincha = useCallback(
    async (request: RegisterHinchaRequest): Promise<void> => {
      const response = await authApi.registerHincha(request);
      applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const forgotPassword = useCallback(
    async (request: ForgotPasswordRequest): Promise<void> => {
      await authApi.forgotPassword(request);
    },
    [],
  );

  const changeMyPassword = useCallback(async (request: ChangePasswordRequest): Promise<void> => {
    await authApi.changeMyPassword(request);
  }, []);

  const completePasswordChange = useCallback((): void => {
    setSession((prev) => {
      if (!prev) {
        return prev;
      }
      const updated: StoredSession = { ...prev, mustChangePassword: false };
      persistSession(updated);
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isAuthenticated = token !== null && session !== null;
    return {
      user: session?.user ?? null,
      player: session?.player ?? null,
      token,
      isAuthenticated,
      isAdmin: session?.user.role === 'ADMIN',
      isHincha: isAuthenticated && session?.player == null,
      mustChangePassword: session?.mustChangePassword === true,
      login,
      register,
      registerHincha,
      forgotPassword,
      changeMyPassword,
      completePasswordChange,
      logout,
    };
  }, [token, session, login, register, registerHincha, forgotPassword, changeMyPassword, completePasswordChange, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
