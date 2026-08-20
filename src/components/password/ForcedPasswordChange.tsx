import { useAuth } from '@/auth/useAuth'
import { ChangePasswordModal } from './ChangePasswordModal'

export function ForcedPasswordChange() {
  const { mustChangePassword, completePasswordChange } = useAuth()

  return (
    <ChangePasswordModal
      open={mustChangePassword}
      dismissible={false}
      onSuccess={completePasswordChange}
      title="Cambiá tu contraseña"
      description="Un administrador restableció tu contraseña. Necesitás elegir una nueva para continuar."
    />
  )
}