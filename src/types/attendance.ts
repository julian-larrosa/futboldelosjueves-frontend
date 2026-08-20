import type { MatchStatus } from './enums'

export interface MatchAttendanceResponse {
  id: number
  matchId: number
  hinchaId: number
  hinchaNombre: string
  fechaHora: string
  estado: MatchStatus
}

export interface AttendanceRegisterRequest {
  hinchaIds: number[]
}

export interface AnioAttendance {
  anio: number
  partidos: number
}

export interface AttendanceRankingResponse {
  hinchaId: number
  nombre: string
  apellido: string
  totalPartidos: number
  asistenciasPorAnio: AnioAttendance[]
}

export interface AttendanceStatisticsResponse {
  totalHinchas: number
  totalAsistencias: number
  promedioPorPartido: number
}