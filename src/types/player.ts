import type { AttributeType, PlayerPosition } from './enums'

export interface PlayerAttributeResponse {
  attributeType: AttributeType
  currentValue: number
}

export interface PlayerAttributesResponse {
  playerId: number
  attributes: PlayerAttributeResponse[]
}

export interface PlayerResponse {
  id: number
  nombre: string
  apellido: string
  email: string
  posicion: PlayerPosition
  activo: boolean
  attributes: PlayerAttributesResponse | null
}

export interface PlayerRequest {
  nombre: string
  apellido: string
  email: string
  posicion: PlayerPosition
}

export interface PlayerQuery {
  nombre?: string
  apellido?: string
  email?: string
  posicion?: PlayerPosition
  page?: number
  size?: number
  sort?: string
}

export interface AttributeHistoryEntry {
  id: number
  attributeType: AttributeType
  matchId: number
  ratingValue: number
}

export interface PlayerAttributeHistoryResponse {
  playerId: number
  history: AttributeHistoryEntry[]
}

export interface RecentFormResponse {
  partidosJugados: number
  victorias: number
  derrotas: number
  empates: number
  goles: number
  ratingPromedio: number
  indiceForma: number
}

export interface PlayerStatisticsResponse {
  playerId: number
  partidosJugados: number
  victorias: number
  derrotas: number
  empates: number
  goles: number
  ratingPromedio: number
  porcentajeVictorias: number
  rendimientoReciente: RecentFormResponse
}

export function fullName(player: Pick<PlayerResponse, 'nombre' | 'apellido'>): string {
  return `${player.nombre} ${player.apellido}`.trim()
}