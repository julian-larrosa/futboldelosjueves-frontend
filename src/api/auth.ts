import { apiClient } from './client'
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterHinchaRequest,
  RegisterRequest,
} from '@/types'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data)
  return res.data.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data)
  return res.data.data
}

export async function registerHincha(data: RegisterHinchaRequest): Promise<AuthResponse> {
  const res = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register-hincha', data)
  return res.data.data
}