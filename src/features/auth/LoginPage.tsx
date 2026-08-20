import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AuthLayout } from './AuthLayout'
import { loginSchema } from './schemas'
import type { LoginForm } from './schemas'
import { useAuth } from '@/auth/useAuth'
import { getErrorMessage } from '@/api/client'
import { Button, FieldError, Input, Label } from '@/components/ui'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const onSubmit = async (data: LoginForm) => {
    setServerError(null)
    try {
      await login(data)
      toast.success('Sesión iniciada correctamente')
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo iniciar sesión'))
    }
  }

  return (
    <AuthLayout title="Iniciar sesión" subtitle="El fútbol del barrio, todos los jueves">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Ingresar
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
        <p>
          ¿Sos jugador?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Registrate acá
          </Link>
        </p>
        <p>
          ¿Venís solo a alentar?{' '}
          <Link to="/register-hincha" className="font-medium text-primary hover:underline">
            Creá tu cuenta de hincha
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}