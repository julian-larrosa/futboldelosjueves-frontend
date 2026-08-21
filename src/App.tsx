import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { MustChangePasswordRoute } from '@/auth/MustChangePasswordRoute'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { PublicOnlyRoute } from '@/auth/PublicOnlyRoute'
import { useAuth } from '@/auth/useAuth'
import { AppShell } from '@/components/layout'
import {
  ForgotPasswordPage,
  ForcedPasswordChangePage,
  LoginPage,
  RegisterHinchaPage,
  RegisterPage,
} from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { HinchasPage } from '@/features/hinchas'
import { PlaceholderPage } from '@/features/placeholder'
import { Role } from '@/types'

function HomeRedirect() {
  const { user, mustChangePassword } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (mustChangePassword) return <Navigate to="/change-password" replace />
  return <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" theme="dark" />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register-hincha"
          element={
            <PublicOnlyRoute>
              <RegisterHinchaPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <MustChangePasswordRoute>
              <ForcedPasswordChangePage />
            </MustChangePasswordRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/matches" element={<PlaceholderPage />} />
          <Route path="/matches/:id" element={<PlaceholderPage />} />
          <Route path="/players" element={<PlaceholderPage />} />
          <Route path="/players/:id" element={<PlaceholderPage />} />
          <Route path="/rankings" element={<PlaceholderPage />} />
          <Route path="/attendance" element={<PlaceholderPage />} />

          <Route
            path="/hinchas"
            element={
              <ProtectedRoute roles={[Role.ADMIN]}>
                <HinchasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/:id/manage"
            element={
              <ProtectedRoute roles={[Role.ADMIN]}>
                <PlaceholderPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
