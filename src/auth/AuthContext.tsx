import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '@/api/auth'
import { clearToken, getToken, setToken } from '@/api/token'
import { setSessionExpiredHandler } from '@/api/client'
import type { LoginRequest, RegisterHinchaRequest, RegisterRequest, Role, UserResponse } from '@/types'

const USER_KEY = 'fdlj_user'

interface AuthContextValue {
  user: UserResponse | null
  token: string | null
  isAuthenticated: boolean
  hasRole: (role: Role) => boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  registerHincha: (data: RegisterHinchaRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): UserResponse | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserResponse
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(() => loadUser())
  const [token, setTokenState] = useState<string | null>(() => getToken())

  const persistSession = useCallback((authToken: string, authUser: UserResponse) => {
    setToken(authToken)
    localStorage.setItem(USER_KEY, JSON.stringify(authUser))
    setTokenState(authToken)
    setUser(authUser)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setTokenState(null)
    setUser(null)
  }, [])

  const login = useCallback(
    async (data: LoginRequest) => {
      const response = await authApi.login(data)
      persistSession(response.token, response.user)
    },
    [persistSession],
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
      const response = await authApi.register(data)
      persistSession(response.token, response.user)
    },
    [persistSession],
  )

  const registerHincha = useCallback(
    async (data: RegisterHinchaRequest) => {
      const response = await authApi.registerHincha(data)
      persistSession(response.token, response.user)
    },
    [persistSession],
  )

  const hasRole = useCallback((role: Role) => user?.role === role, [user])

  useEffect(() => {
    setSessionExpiredHandler(() => logout())
    return () => setSessionExpiredHandler(null)
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      hasRole,
      login,
      register,
      registerHincha,
      logout,
    }),
    [user, token, hasRole, login, register, registerHincha, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}