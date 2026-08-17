export const MATCH_STATUSES = [
  'PROGRAMADO',
  'CONVOCATORIA_ABIERTA',
  'CONVOCATORIA_CERRADA',
  'EN_CURSO',
  'FINALIZADO',
  'CANCELADO',
] as const;

export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const PLAYER_POSITIONS = [
  'ARQUERO',
  'DEFENSOR',
  'MEDIOCAMPISTA',
  'DELANTERO',
] as const;

export type PlayerPosition = (typeof PLAYER_POSITIONS)[number];

export const ATTRIBUTE_TYPES = [
  'TECNICA',
  'FISICO',
  'DEFINICION',
  'MENTALIDAD',
  'PASE',
] as const;

export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];

export const ROLES = ['ADMIN', 'PLAYER'] as const;

export type Role = (typeof ROLES)[number];

export const RESULTADOS_PARTIDO = [
  'GANA_EQUIPO_A',
  'EMPATE',
  'GANA_EQUIPO_B',
] as const;

export type ResultadoPartido = (typeof RESULTADOS_PARTIDO)[number];

export const TEAM_SIDES = ['EQUIPO_A', 'EQUIPO_B'] as const;

export type TeamSide = (typeof TEAM_SIDES)[number];
