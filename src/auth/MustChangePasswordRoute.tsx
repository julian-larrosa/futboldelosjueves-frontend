import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

interface MustChangePasswordRouteProps {
  children: ReactNode
}

export function MustChangePasswordRoute({ children }: MustChangePasswordRouteProps) {
  const { isAuthenticated, mustChangePassword } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!mustChangePassword) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
