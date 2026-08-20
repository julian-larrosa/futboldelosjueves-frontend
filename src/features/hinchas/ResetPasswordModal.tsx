import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { resetUserPasswordByEmail } from '@/api/users'
import { getErrorMessage } from '@/api/client'
import { Button, FieldError, Input, Label, Modal } from '@/components/ui'

const resetPasswordSchema = z
  .object({
    email: z.string().trim().min(1, 'El email es obligatorio').email('Ingresá un email válido'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
    confirmPassword: z.string().min(1, 'Repetí la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

interface ResetPasswordModalProps {
  open: boolean
  defaultEmail?: string
  onClose: () => void
}

export function ResetPasswordModal({ open, defaultEmail = '', onClose }: ResetPasswordModalProps) {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: defaultEmail, newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ResetPasswordForm) => {
    setServerError(null)
    try {
      await resetUserPasswordByEmail({ email: data.email, newPassword: data.newPassword })
      toast.success('Contraseña restablecida. El usuario deberá cambiarla en su próximo ingreso.')
      reset()
      onClose()
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo restablecer la contraseña'))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Restablecer contraseña" description="Se define una contraseña temporal y el usuario deberá cambiarla al iniciar sesión.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email del usuario</Label>
          <Input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="usuario@ejemplo.com"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="off"
            placeholder="Mínimo 8 caracteres"
            invalid={Boolean(errors.newPassword)}
            {...register('newPassword')}
          />
          <FieldError message={errors.newPassword?.message} />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Repetir contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="off"
            placeholder="••••••••"
            invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Restablecer contraseña
        </Button>
      </form>
    </Modal>
  )
}