import type { AttributeType } from './enums'

export interface AttributeRatingRequest {
  playerId: number
  tecnica: number
  fisico: number
  definicion: number
  mentalidad: number
  pase: number
}

export interface MatchAttributeRatingsRequest {
  ratings: AttributeRatingRequest[]
}

export interface AttributeRatingResponse {
  playerId: number
  nombre: string
  apellido: string
}

export interface TeamStandingResponse {
  playerId: number
  nombre: string
  apellido: string
  partidosJugados: number
  victorias: number
  empates: number
  derrotas: number
  golesAFavor: number
  golesEnContra: number
  diferenciaGoles: number
  puntos: number
}

export interface TopScorerResponse {
  playerId: number
  nombre: string
  apellido: string
  goles: number
  partidosJugados: number
}

export interface RatingAverageResponse {
  playerId: number
  nombre: string
  apellido: string
  promedio: number
  cantidadCalificaciones: number
}

export interface AttributeTypeLabel {
  type: AttributeType
  label: string
}