import { z } from 'zod'
import { PlayerPosition } from '@/types'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'El email es obligatorio').email('Ingresá un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'El usuario es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  email: z.string().trim().min(1, 'El email es obligatorio').email('Ingresá un email válido').max(100, 'Máximo 100 caracteres'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio').max(100, 'Máximo 100 caracteres'),
  posicion: z.nativeEnum(PlayerPosition, { message: 'Seleccioná una posición' }),
})

export const registerHinchaSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio').max(100, 'Máximo 100 caracteres'),
  email: z.string().trim().min(1, 'El email es obligatorio').email('Ingresá un email válido').max(100, 'Máximo 100 caracteres'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(72, 'Máximo 72 caracteres'),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type RegisterHinchaForm = z.infer<typeof registerHinchaSchema>