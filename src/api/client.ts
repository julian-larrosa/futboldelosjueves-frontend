import { API_BASE_URL } from './config';
import { ApiError } from './errors';
import { clearAllTokens, getRefreshToken, getToken, setToken } from './token';
import type { ApiResponse, ErrorResponse } from './types';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

type UnauthorizedHandler = () => void;

const unauthorizedHandlers = new Set<UnauthorizedHandler>();

export function onUnauthorized(handler: UnauthorizedHandler): () => void {
  unauthorizedHandlers.add(handler);
  return () => {
    unauthorizedHandlers.delete(handler);
  };
}

function notifyUnauthorized(): void {
  clearAllTokens();
  for (const handler of unauthorizedHandlers) {
    handler();
  }
}

function buildQuery(query?: RequestOptions['query']): string {
  if (!query) {
    return '';
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function buildHeaders(token: string | null, hasBody: boolean, extra?: Record<string, string>): Headers {
  const headers = new Headers({ Accept: 'application/json' });
  if (hasBody) {
    headers.set('Content-Type', 'application/json');
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      headers.set(key, value);
    }
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

// --- Token refresh queue ---
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
type PendingRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};
const pendingRequests: PendingRequest[] = [];

function getRefreshPromise(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const body = await response.json();
      const data = (body as ApiResponse<{ token: string; refreshToken: string }>).data;
      setToken(data.token);
      return data.token;
    })().finally(() => {
      refreshPromise = null;
      isRefreshing = false;
    });
  }
  return refreshPromise;
}

// --- Core request function ---
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers = buildHeaders(token, options.body !== undefined, options.headers);

  const response = await fetch(`${API_BASE_URL}${path}${buildQuery(options.query)}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  // --- Handle 401 with token refresh ---
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      notifyUnauthorized();
      throw new ApiError('Sesión no válida o vencida.', 401);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      getRefreshPromise()
        .then((newToken) => {
          for (const pending of pendingRequests) {
            pending.resolve(newToken);
          }
        })
        .catch((err) => {
          for (const pending of pendingRequests) {
            pending.reject(err);
          }
          notifyUnauthorized();
        })
        .finally(() => {
          pendingRequests.length = 0;
        });
    }

    const newToken = await new Promise<string>((resolve, reject) => {
      pendingRequests.push({ resolve, reject });
    });

    // Retry original request with new token
    const retryHeaders = buildHeaders(newToken, options.body !== undefined, options.headers);
    const retryResponse = await fetch(`${API_BASE_URL}${path}${buildQuery(options.query)}`, {
      method: options.method ?? 'GET',
      headers: retryHeaders,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    });

    if (retryResponse.status === 401) {
      notifyUnauthorized();
      throw new ApiError('Sesión no válida o vencida.', 401);
    }

    if (retryResponse.status === 204) {
      return undefined as T;
    }

    let retryBody: unknown = null;
    try {
      retryBody = await retryResponse.json();
    } catch {
      retryBody = null;
    }

    if (!retryResponse.ok) {
      const errorBody = retryBody as ErrorResponse | null;
      throw new ApiError(
        errorBody?.message ?? `Error de solicitud (${retryResponse.status})`,
        retryResponse.status,
        errorBody ?? undefined,
      );
    }

    return (retryBody as ApiResponse<T>).data;
  }

  // --- Normal response handling ---
  if (response.status === 204) {
    return undefined as T;
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const errorBody = body as ErrorResponse | null;
    throw new ApiError(
      errorBody?.message ?? `Error de solicitud (${response.status})`,
      response.status,
      errorBody ?? undefined,
    );
  }

  return (body as ApiResponse<T>).data;
}

export const http = {
  get: <T>(path: string, query?: RequestOptions['query'], signal?: AbortSignal): Promise<T> =>
    request<T>(path, { method: 'GET', query, signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> =>
    request<T>(path, { method: 'POST', body, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal): Promise<T> =>
    request<T>(path, { method: 'PUT', body, signal }),
  delete: <T>(path: string, signal?: AbortSignal): Promise<T> =>
    request<T>(path, { method: 'DELETE', signal }),
};
