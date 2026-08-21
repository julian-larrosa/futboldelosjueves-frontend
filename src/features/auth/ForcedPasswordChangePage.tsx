import { toast } from 'sonner'
import { AuthLayout } from './AuthLayout'
import { useAuth } from '@/auth/useAuth'
import { ChangePasswordForm } from '@/components/password'

export default function ForcedPasswordChangePage() {
  const { completePasswordChange } = useAuth()

  return (
    <AuthLayout
      title="Cambiá tu contraseña"
      subtitle="Un administrador restableció tu contraseña. Necesitás elegir una nueva para continuar."
    >
      <ChangePasswordForm
        submitLabel="Guardar y continuar"
        onSuccess={() => {
          toast.success('Contraseña actualizada correctamente')
          completePasswordChange()
        }}
      />
    </AuthLayout>
  )
}
