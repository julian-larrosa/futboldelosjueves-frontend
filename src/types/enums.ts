export const Role = {
  ADMIN: 'ADMIN',
  PLAYER: 'PLAYER',
  HINCHADA: 'HINCHADA',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const ROLE_LABEL: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.PLAYER]: 'Jugador',
  [Role.HINCHADA]: 'Hinchada',
}

export const PlayerPosition = {
  ARQUERO: 'ARQUERO',
  DEFENSOR: 'DEFENSOR',
  MEDIOCAMPISTA: 'MEDIOCAMPISTA',
  DELANTERO: 'DELANTERO',
} as const

export type PlayerPosition = (typeof PlayerPosition)[keyof typeof PlayerPosition]

export const POSITION_LABEL: Record<PlayerPosition, string> = {
  [PlayerPosition.ARQUERO]: 'Arquero',
  [PlayerPosition.DEFENSOR]: 'Defensor',
  [PlayerPosition.MEDIOCAMPISTA]: 'Mediocampista',
  [PlayerPosition.DELANTERO]: 'Delantero',
}

export const POSITION_ORDER: Record<PlayerPosition, number> = {
  [PlayerPosition.ARQUERO]: 0,
  [PlayerPosition.DEFENSOR]: 1,
  [PlayerPosition.MEDIOCAMPISTA]: 2,
  [PlayerPosition.DELANTERO]: 3,
}

export const POSITION_OPTIONS = Object.values(PlayerPosition).map((value) => ({
  value,
  label: POSITION_LABEL[value],
}))

export const MatchStatus = {
  PROGRAMADO: 'PROGRAMADO',
  CONVOCATORIA_ABIERTA: 'CONVOCATORIA_ABIERTA',
  CONVOCATORIA_CERRADA: 'CONVOCATORIA_CERRADA',
  EN_CURSO: 'EN_CURSO',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
} as const

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus]

export const MATCH_STATUS_LABEL: Record<MatchStatus, string> = {
  [MatchStatus.PROGRAMADO]: 'Programado',
  [MatchStatus.CONVOCATORIA_ABIERTA]: 'Convocatoria abierta',
  [MatchStatus.CONVOCATORIA_CERRADA]: 'Convocatoria cerrada',
  [MatchStatus.EN_CURSO]: 'En curso',
  [MatchStatus.FINALIZADO]: 'Finalizado',
  [MatchStatus.CANCELADO]: 'Cancelado',
}

export const MATCH_STATUS_OPTIONS = Object.values(MatchStatus).map((value) => ({
  value,
  label: MATCH_STATUS_LABEL[value],
}))

export const TeamSide = {
  EQUIPO_A: 'EQUIPO_A',
  EQUIPO_B: 'EQUIPO_B',
} as const

export type TeamSide = (typeof TeamSide)[keyof typeof TeamSide]

export const TEAM_SIDE_LABEL: Record<TeamSide, string> = {
  [TeamSide.EQUIPO_A]: 'Equipo A',
  [TeamSide.EQUIPO_B]: 'Equipo B',
}

export const AttributeType = {
  TECNICA: 'TECNICA',
  FISICO: 'FISICO',
  DEFINICION: 'DEFINICION',
  MENTALIDAD: 'MENTALIDAD',
  PASE: 'PASE',
} as const

export type AttributeType = (typeof AttributeType)[keyof typeof AttributeType]

export const ATTRIBUTE_LABEL: Record<AttributeType, string> = {
  [AttributeType.TECNICA]: 'Técnica',
  [AttributeType.FISICO]: 'Físico',
  [AttributeType.DEFINICION]: 'Definición',
  [AttributeType.MENTALIDAD]: 'Mentalidad',
  [AttributeType.PASE]: 'Pase',
}

export const ATTRIBUTE_TYPES = Object.values(AttributeType)

export const ResultadoPartido = {
  GANA_EQUIPO_A: 'GANA_EQUIPO_A',
  EMPATE: 'EMPATE',
  GANA_EQUIPO_B: 'GANA_EQUIPO_B',
} as const

export type ResultadoPartido = (typeof ResultadoPartido)[keyof typeof ResultadoPartido]

export const RESULTADO_LABEL: Record<ResultadoPartido, string> = {
  [ResultadoPartido.GANA_EQUIPO_A]: 'Gana Equipo A',
  [ResultadoPartido.EMPATE]: 'Empate',
  [ResultadoPartido.GANA_EQUIPO_B]: 'Gana Equipo B',
}