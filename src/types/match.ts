import type { MatchStatus } from './enums'

export interface MatchResponse {
  id: number
  fechaHora: string
  lugar: string
  estado: MatchStatus
  golesEquipoA: number
  golesEquipoB: number
  cantidadConvocados: number
}

export interface MatchRequest {
  fechaHora: string
  lugar?: string
}

export interface MatchQuery {
  estado?: MatchStatus
  lugar?: string
  fechaDesde?: string
  fechaHasta?: string
  page?: number
  size?: number
  sort?: string
}

export interface MatchResultRequest {
  golesEquipoA: number
  golesEquipoB: number
}

export interface MatchResultResponse {
  matchId: number
  golesEquipoA: number
  golesEquipoB: number
  resultado: string
}