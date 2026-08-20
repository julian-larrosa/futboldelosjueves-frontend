export interface RatingResponse {
  id: number
  matchId: number
  calificadorId: number
  calificadorNombreCompleto: string
  calificadoId: number
  calificadoNombreCompleto: string
  puntaje: number
}

export interface RatingRequest {
  calificadoId: number
  puntaje: number
}

export interface RatingQuery {
  page?: number
  size?: number
}