import type { TeamSide } from './enums'

export interface ParticipationResponse {
  id: number
  playerId: number
  playerNombreCompleto: string
  teamId: number
  teamSide: TeamSide
  goles: number
  jugoEfectivamente: boolean
}

export interface ParticipationRequest {
  playerId: number
}

export interface MatchStatisticsUpdateRequest {
  goles: number
  jugoEfectivamente: boolean
}

export interface ParticipationQuery {
  page?: number
  size?: number
}