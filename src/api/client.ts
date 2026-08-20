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
  }
  return config
})

let sessionExpiredHandler: (() => void) | null = null

export function setSessionExpiredHandler(handler: () => void): void {
  sessionExpiredHandler = handler
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken()
      sessionExpiredHandler?.()
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