import type { PlayerAttributesResponse } from './player'
import type { Role } from './enums'

export interface UserResponse {
  id: number
  username: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  tokenType: string
  user: UserResponse
  player: PlayerAuthInfo | null
}

export interface PlayerAuthInfo {
  id: number
  nombre: string
  apellido: string
  email: string
  posicion: string
  activo: boolean
  attributes: PlayerAttributesResponse | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  nombre: string
  apellido: string
  posicion: string
}

export interface RegisterHinchaRequest {
  nombre: string
  apellido: string
  email: string
  password: string
}