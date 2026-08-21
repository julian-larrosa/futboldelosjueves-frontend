import { Modal } from '@/components/ui'
import { ChangePasswordForm } from './ChangePasswordForm'

interface ChangePasswordModalProps {
  open: boolean
  dismissible?: boolean
  onClose?: () => void
  onSuccess?: () => void
  title?: string
  description?: string
}

export function ChangePasswordModal({
  open,
  dismissible = true,
  onClose,
  onSuccess,
  title = 'Cambiar contraseña',
  description = 'Ingresá tu contraseña actual y elegí una nueva.',
}: ChangePasswordModalProps) {
  return (
    <Modal
      open={open}
      dismissible={dismissible}
      onClose={onClose}
      title={title}
      description={description}
    >
      <ChangePasswordForm
        onSuccess={() => {
          onSuccess?.()
          onClose?.()
        }}
      />
    </Modal>
  )
}
