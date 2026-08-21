import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AuthLayout } from './AuthLayout'
import { forgotPasswordSchema } from './schemas'
import type { ForgotPasswordForm } from './schemas'
import * as authApi from '@/api/auth'
import { getErrorMessage } from '@/api/client'
import { Button, FieldError, Input, Label } from '@/components/ui'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setServerError(null)
    try {
      await authApi.forgotPassword({ email: data.email, newPassword: data.newPassword })
      toast.success('Contraseña actualizada. Ya podés iniciar sesión.')
      navigate('/login', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo actualizar la contraseña'))
    }
  }

  return (
    <AuthLayout title="Recuperar contraseña" subtitle="Elegí una contraseña nueva para tu cuenta">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email de tu cuenta</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
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

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary hover:underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  )
}
