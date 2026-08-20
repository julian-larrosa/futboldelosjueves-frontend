import { useAuth } from '@/auth/AuthContext'
import { ROLE_LABEL } from '@/types'

export default function PlaceholderPage() {
  const { user } = useAuth()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-2xl font-bold">Fútbol de los Jueves</h1>
      <p className="text-gray-500">
        {user ? `Sesión iniciada como ${ROLE_LABEL[user.role]}` : 'Infraestructura lista — Fase 1'}
      </p>
      <p className="text-sm text-gray-400">Las vistas se construyen en las siguientes fases.</p>
    </div>
  )
}