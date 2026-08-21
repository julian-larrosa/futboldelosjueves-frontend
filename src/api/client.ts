import axios, { AxiosError } from 'axios'
import { clearToken, getToken } from './token'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    ;(config as { _fdljToken?: string })._fdljToken = token
  }
  return config
})

let sessionExpiredHandler: (() => void) | null = null

export function setSessionExpiredHandler(handler: (() => void) | null): void {
  sessionExpiredHandler = handler
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const usedToken = (error.config as { _fdljToken?: string } | undefined)?._fdljToken
      // Solo invalidamos la sesión si el token que falló es el mismo que sigue guardado.
      // Evita que un request con un token viejo (otra pestaña o estado stale) borre
      // una sesión más nueva recién creada, lo que causaba loop login -> dashboard -> login.
      if (usedToken && getToken() === usedToken) {
        clearToken()
        sessionExpiredHandler?.()
      }
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    return data?.message ?? fallback
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}