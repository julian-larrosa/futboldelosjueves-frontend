import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { changeMyPassword } from '@/api/users'
import { getErrorMessage } from '@/api/client'
import { Button, FieldError, Input, Label, Modal } from '@/components/ui'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresá tu contraseña actual'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
    confirmPassword: z.string().min(1, 'Repetí la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

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
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ChangePasswordForm) => {
    setServerError(null)
    try {
      await changeMyPassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      toast.success('Contraseña actualizada correctamente')
      reset()
      onSuccess?.()
      onClose?.()
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo cambiar la contraseña'))
    }
  }

  return (
    <Modal
      open={open}
      dismissible={dismissible}
      onClose={onClose}
      title={title}
      description={description}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <Label htmlFor="currentPassword">Contraseña actual</Label>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={Boolean(errors.currentPassword)}
            {...register('currentPassword')}
          />
          <FieldError message={errors.currentPassword?.message} />
        </div>

        <div>
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            invalid={Boolean(errors.newPassword)}
            {...register('newPassword')}
          />
          <FieldError message={errors.newPassword?.message} />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Repetir nueva contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Guardar contraseña
        </Button>
      </form>
    </Modal>
  )
}