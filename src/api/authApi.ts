import { http } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const authApi = {
  login: (request: LoginRequest): Promise<AuthResponse> =>
    http.post<AuthResponse>('/api/auth/login', request),

  register: (request: RegisterRequest): Promise<AuthResponse> =>
    http.post<AuthResponse>('/api/auth/register', request),
};