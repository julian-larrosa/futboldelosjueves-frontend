import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '@/api/auth'
import { clearToken, getToken, setToken } from '@/api/token'
import { setSessionExpiredHandler } from '@/api/client'
import { AuthContext } from './auth-context'
import type { LoginRequest, RegisterHinchaRequest, RegisterRequest, Role, UserResponse } from '@/types'

const USER_KEY = 'fdlj_user'
const MUST_CHANGE_KEY = 'fdlj_must_change_password'

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

function loadMustChangePassword(): boolean {
  return localStorage.getItem(MUST_CHANGE_KEY) === 'true'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(() => loadUser())
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => loadMustChangePassword())

  const persistSession = useCallback(
    (authToken: string, authUser: UserResponse, mustChange: boolean) => {
      setToken(authToken)
      localStorage.setItem(USER_KEY, JSON.stringify(authUser))
      localStorage.setItem(MUST_CHANGE_KEY, String(mustChange))
      setTokenState(authToken)
      setUser(authUser)
      setMustChangePassword(mustChange)
    },
    [],
  )

  const logout = useCallback(() => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(MUST_CHANGE_KEY)
    setTokenState(null)
    setUser(null)
    setMustChangePassword(false)
  }, [])

  const login = useCallback(
    async (data: LoginRequest) => {
      const response = await authApi.login(data)
      persistSession(response.token, response.user, response.mustChangePassword)
      return response
    },
    [persistSession],
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
      const response = await authApi.register(data)
      persistSession(response.token, response.user, false)
    },
    [persistSession],
  )

  const registerHincha = useCallback(
    async (data: RegisterHinchaRequest) => {
      const response = await authApi.registerHincha(data)
      persistSession(response.token, response.user, false)
    },
    [persistSession],
  )

  const completePasswordChange = useCallback(() => {
    localStorage.removeItem(MUST_CHANGE_KEY)
    setMustChangePassword(false)
  }, [])

  const hasRole = useCallback((role: Role) => user?.role === role, [user])

  useEffect(() => {
    setSessionExpiredHandler(() => logout())
    return () => setSessionExpiredHandler(null)
  }, [logout])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      mustChangePassword,
      hasRole,
      login,
      register,
      registerHincha,
      completePasswordChange,
      logout,
    }),
    [
      user,
      token,
      mustChangePassword,
      hasRole,
      login,
      register,
      registerHincha,
      completePasswordChange,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}