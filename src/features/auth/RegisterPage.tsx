import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AuthLayout } from './AuthLayout'
import { registerSchema } from './schemas'
import type { RegisterForm } from './schemas'
import { useAuth } from '@/auth/useAuth'
import { getErrorMessage } from '@/api/client'
import { Button, FieldError, Input, Label, Select } from '@/components/ui'
import { POSITION_OPTIONS } from '@/types'

export default function RegisterPage() {
  const { register: registerPlayer } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      posicion: undefined,
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    setServerError(null)
    try {
      await registerPlayer(data)
      toast.success('Cuenta de jugador creada. ¡Bienvenido!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo crear la cuenta'))
    }
  }

  return (
    <AuthLayout title="Registrate como jugador" subtitle="Tu carta, tus stats, tu lugar en la cancha">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Juan"
              invalid={Boolean(errors.nombre)}
              {...register('nombre')}
            />
            <FieldError message={errors.nombre?.message} />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              placeholder="Pérez"
              invalid={Boolean(errors.apellido)}
              {...register('apellido')}
            />
            <FieldError message={errors.apellido?.message} />
          </div>
        </div>

        <div>
          <Label htmlFor="username">Usuario</Label>
          <Input id="username" placeholder="juanperez" invalid={Boolean(errors.username)} {...register('username')} />
          <FieldError message={errors.username?.message} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
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
            placeholder="Mínimo 8 caracteres"
            invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <Label htmlFor="posicion">Posición</Label>
          <Select id="posicion" invalid={Boolean(errors.posicion)} {...register('posicion')}>
            <option value="">Seleccioná tu posición</option>
            {POSITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.posicion?.message} />
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </AuthLayout>
  )
}