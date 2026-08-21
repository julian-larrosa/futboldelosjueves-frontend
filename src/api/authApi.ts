import { http } from './client';
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterHinchaRequest,
  RegisterRequest,
} from './types';

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export const authApi = {
  login: (request: LoginRequest): Promise<AuthResponse> =>
    http.post<AuthResponse>('/api/auth/login', request),

  register: (request: RegisterRequest): Promise<AuthResponse> =>
    http.post<AuthResponse>('/api/auth/register', request),

  registerHincha: (request: RegisterHinchaRequest): Promise<AuthResponse> =>
    http.post<AuthResponse>('/api/auth/register-hincha', request),

  forgotPassword: (request: ForgotPasswordRequest): Promise<void> =>
    http.post<void>('/api/auth/password/forgot', request),

  changeMyPassword: (request: ChangePasswordRequest): Promise<void> =>
    http.put<void>('/api/users/me/password', request),

  refresh: (refreshToken: string): Promise<RefreshResponse> =>
    http.post<RefreshResponse>('/api/auth/refresh', { refreshToken }),
};
