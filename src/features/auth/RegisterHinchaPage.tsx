import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AuthLayout } from './AuthLayout'
import { registerHinchaSchema } from './schemas'
import type { RegisterHinchaForm } from './schemas'
import { useAuth } from '@/auth/useAuth'
import { getErrorMessage } from '@/api/client'
import { Button, FieldError, Input, Label } from '@/components/ui'

export default function RegisterHinchaPage() {
  const { registerHincha } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterHinchaForm>({
    resolver: zodResolver(registerHinchaSchema),
    defaultValues: { nombre: '', apellido: '', email: '', password: '' },
  })

  const onSubmit = async (data: RegisterHinchaForm) => {
    setServerError(null)
    try {
      await registerHincha(data)
      toast.success('Cuenta de hincha creada. ¡A alentar!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error, 'No se pudo crear la cuenta'))
    }
  }

  return (
    <AuthLayout title="Registrate como hincha" subtitle="Tu asistencia no se pierde, se registra">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" placeholder="María" invalid={Boolean(errors.nombre)} {...register('nombre')} />
            <FieldError message={errors.nombre?.message} />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" placeholder="Gómez" invalid={Boolean(errors.apellido)} {...register('apellido')} />
            <FieldError message={errors.apellido?.message} />
          </div>
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