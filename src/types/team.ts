import type { TeamSide } from './enums'

export interface PlayerTeamMemberResponse {
  playerId: number
  nombre: string
  apellido: string
}

export interface TeamResponse {
  id: number
  side: TeamSide
  jugadores: PlayerTeamMemberResponse[]
  ratingPromedio: number
}

export interface TeamBalanceResponse {
  ratingPromedioEquipoA: number
  ratingPromedioEquipoB: number
  diferenciaNivel: number
}

export interface TeamAssignmentRequest {
  teamSide: TeamSide
}