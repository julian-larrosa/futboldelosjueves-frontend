const DEFAULT_API_BASE_URL = 'http://localhost:8080';

function resolveBaseUrl(): string {
  const fromEnv = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/+$/, '');
  }
  return DEFAULT_API_BASE_URL;
}

export const API_BASE_URL = resolveBaseUrl();
