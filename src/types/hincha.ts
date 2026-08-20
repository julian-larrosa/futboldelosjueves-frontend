export interface HinchaResponse {
  id: number
  nombre: string
  apellido: string
  activo: boolean
  username: string
  email: string
}

export interface HinchaQuery {
  page?: number
  size?: number
  sort?: string
}