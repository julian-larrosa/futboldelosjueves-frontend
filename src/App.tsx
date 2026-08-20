import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { PublicOnlyRoute } from '@/auth/PublicOnlyRoute'
import { useAuth } from '@/auth/useAuth'
import { AppShell } from '@/components/layout'
import { LoginPage, RegisterHinchaPage, RegisterPage } from '@/features/auth'
import { DashboardPage } from '@/features/dashboard'
import { HinchasPage } from '@/features/hinchas'
import { PlaceholderPage } from '@/features/placeholder'
import { ForcedPasswordChange } from '@/components/password'
import { Role } from '@/types'

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" theme="dark" />
      <ForcedPasswordChange />
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