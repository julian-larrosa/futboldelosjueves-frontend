const TOKEN_STORAGE_KEY = 'fdlj.accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'fdlj.refreshToken';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // storage unavailable (e.g. private mode) — session continues without persistence
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // storage unavailable — nothing to clear
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  } catch {
    // storage unavailable
  }
}

export function clearRefreshToken(): void {
  try {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    // storage unavailable
  }
}

export function clearAllTokens(): void {
  clearToken();
  clearRefreshToken();
}
