import { createContext } from 'react'
import type { LoginRequest, RegisterHinchaRequest, RegisterRequest, Role, UserResponse } from '@/types'

export interface AuthContextValue {
  user: UserResponse | null
  token: string | null
  isAuthenticated: boolean
  mustChangePassword: boolean
  hasRole: (role: Role) => boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  registerHincha: (data: RegisterHinchaRequest) => Promise<void>
  completePasswordChange: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)