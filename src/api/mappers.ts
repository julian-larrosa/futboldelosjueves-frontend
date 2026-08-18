import type { Match, Player, PlayerAttributes } from '../types';
import type { AttributeType, MatchStatus, PlayerPosition } from './enums';
import type { MatchResponse, PlayerResponse, PlayerStatisticsResponse, RecentFormResponse } from './types';

const ATTRIBUTE_KEY_BY_TYPE: Record<AttributeType, keyof PlayerAttributes> = {
  TECNICA: 'tecnica',
  FISICO: 'fisico',
  DEFINICION: 'definicion',
  MENTALIDAD: 'mentalidad',
  PASE: 'pase',
};

export function mapAttributeTypeToKey(type: AttributeType): keyof PlayerAttributes {
  return ATTRIBUTE_KEY_BY_TYPE[type];
}

export function mapPlayerPosition(posicion: PlayerPosition): Player['position'] {
  switch (posicion) {
    case 'ARQUERO':
      return 'POR';
    case 'DEFENSOR':
      return 'DEF';
    case 'MEDIOCAMPISTA':
      return 'MED';
    case 'DELANTERO':
      return 'DEL';
  }
}

export function mapMatchStatus(estado: MatchStatus): Match['status'] {
  switch (estado) {
    case 'EN_CURSO':
      return 'live';
    case 'FINALIZADO':
      return 'finished';
    case 'PROGRAMADO':
    case 'CONVOCATORIA_ABIERTA':
    case 'CONVOCATORIA_CERRADA':
    case 'CANCELADO':
      return 'upcoming';
  }
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function hasOfficialAttributes(player: PlayerResponse): boolean {
  return player.attributes !== null && player.attributes.attributes.length > 0;
}

export function toPlayer(player: PlayerResponse): Player {
  const attributes: PlayerAttributes = { definicion: 0, pase: 0, tecnica: 0, mentalidad: 0, fisico: 0 };
  for (const attribute of player.attributes?.attributes ?? []) {
    attributes[mapAttributeTypeToKey(attribute.attributeType)] = attribute.currentValue;
  }
  const ovr = roundToOneDecimal(average(Object.values(attributes)));
  return {
    id: String(player.id),
    name: `${player.nombre} ${player.apellido}`.trim(),
    avatar: '',
    roleTitle: '',
    ovr,
    position: mapPlayerPosition(player.posicion),
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    points: 0,
    rating: ovr,
    forma: 'neutral',
    victorias: 0,
    empates: 0,
    derrotas: 0,
    attributes,
    recentFormRatings: [],
    recentMatches: [],
  };
}

function formatMatchDate(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatMatchTime(date: Date): string {
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

export function toMatch(match: MatchResponse): Match {
  const date = new Date(match.fechaHora);
  const hasScore = match.golesEquipoA !== null && match.golesEquipoB !== null;
  return {
    id: String(match.id),
    jornada: 0,
    fase: '',
    date: formatMatchDate(date),
    time: formatMatchTime(date),
    location: match.lugar ?? '',
    status: mapMatchStatus(match.estado),
    teamA: {
      name: 'Equipo A',
      color: '',
      score: hasScore ? match.golesEquipoA ?? 0 : undefined,
    },
    teamB: {
      name: 'Equipo B',
      color: '',
      score: hasScore ? match.golesEquipoB ?? 0 : undefined,
    },
    scorers: [],
    lineupA: [],
    lineupB: [],
    officialRatings: [],
  };
}

export function toPlayerStatistics(stats: PlayerStatisticsResponse): {
  matchesPlayed: number;
  victorias: number;
  empates: number;
  derrotas: number;
  goles: number;
  rating: number;
  rendimientoReciente: RecentFormResponse;
} {
  return {
    matchesPlayed: stats.partidosJugados,
    victorias: stats.victorias,
    empates: stats.empates,
    derrotas: stats.derrotas,
    goles: stats.goles,
    rating: stats.ratingPromedio ?? 0,
    rendimientoReciente: stats.rendimientoReciente,
  };
}
