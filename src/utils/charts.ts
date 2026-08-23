import type { PlayerAttributes } from '../types';
import type { AttributeType, MatchResponse, PlayerAttributeHistoryResponse, TopScorerResponse } from '../api';
import { ATTRIBUTE_TYPES } from '../api';
import type { RadarPoint } from '../components/charts/MonoRoundedRadarChart';
import type { BarPoint } from '../components/charts/MonoRoundedBarChart';
import type { LinePoint } from '../components/charts/MonoRoundedLineChart';
import { formatShortDate, getFirstNameInitials } from './format';

const ATTRIBUTE_RADAR: Array<{ key: keyof PlayerAttributes; subject: string }> = [
  { key: 'definicion', subject: 'Definición' },
  { key: 'pase', subject: 'Pase' },
  { key: 'tecnica', subject: 'Técnica' },
  { key: 'mentalidad', subject: 'Mentalidad' },
  { key: 'fisico', subject: 'Físico' },
];

const RADAR_SUBJECT_BY_TYPE: Record<AttributeType, string> = {
  TECNICA: 'Técnica',
  FISICO: 'Físico',
  DEFINICION: 'Definición',
  MENTALIDAD: 'Mentalidad',
  PASE: 'Pase',
};

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function toRadarPoints(attributes: PlayerAttributes): RadarPoint[] {
  return ATTRIBUTE_RADAR.map(({ key, subject }) => ({
    subject,
    metric: attributes[key],
  }));
}

export interface YearlyRadar {
  year: number;
  points: RadarPoint[];
}

/**
 * Agrupa los ratings crudos del historial de atributos por año
 * (uniendo matchId → fechaHora) y promedia cada atributo.
 */
export function buildYearlyAttributeRadars(
  history: PlayerAttributeHistoryResponse | null,
  matches: MatchResponse[],
): YearlyRadar[] {
  if (!history) return [];

  const yearById = new Map<number, number>();
  for (const match of matches) {
    const date = new Date(match.fechaHora);
    if (!Number.isNaN(date.getTime())) {
      yearById.set(match.id, date.getFullYear());
    }
  }

  const valuesByYear = new Map<number, Map<AttributeType, number[]>>();
  for (const entry of history.history) {
    const year = yearById.get(entry.matchId);
    if (year === undefined) continue;
    let byType = valuesByYear.get(year);
    if (!byType) {
      byType = new Map();
      valuesByYear.set(year, byType);
    }
    const values = byType.get(entry.attributeType) ?? [];
    values.push(entry.ratingValue);
    byType.set(entry.attributeType, values);
  }

  return [...valuesByYear.entries()]
    .map(([year, byType]) => ({
      year,
      points: ATTRIBUTE_TYPES.map((type) => {
        const values = byType.get(type) ?? [];
        const average =
          values.length > 0 ? values.reduce((acc, v) => acc + v, 0) / values.length : 0;
        return { subject: RADAR_SUBJECT_BY_TYPE[type], metric: roundToOneDecimal(average) };
      }),
    }))
    .sort((a, b) => b.year - a.year);
}

export function toTopScorerBarPoints(scorers: TopScorerResponse[], limit = 8): BarPoint[] {
  return scorers.slice(0, limit).map((scorer) => ({
    label: getFirstNameInitials(`${scorer.nombre} ${scorer.apellido}`.trim()),
    value: scorer.goles,
    playerId: scorer.playerId,
  }));
}

export function toRatingEvolutionLinePoints(
  history: PlayerAttributeHistoryResponse,
  matches: MatchResponse[],
  year?: number,
): LinePoint[] {
  const dateById = new Map<number, string>();
  for (const match of matches) {
    dateById.set(match.id, match.fechaHora);
  }

  const valuesByMatch = new Map<number, number[]>();
  for (const entry of history.history) {
    const values = valuesByMatch.get(entry.matchId) ?? [];
    values.push(entry.ratingValue);
    valuesByMatch.set(entry.matchId, values);
  }

  const rows: Array<{ fechaHora: string; value: number }> = [];
  for (const [matchId, values] of valuesByMatch) {
    const fechaHora = dateById.get(matchId);
    if (!fechaHora) continue;
    const date = new Date(fechaHora);
    if (Number.isNaN(date.getTime())) continue;
    if (year !== undefined && date.getFullYear() !== year) continue;
    const average = values.reduce((acc, value) => acc + value, 0) / values.length;
    rows.push({ fechaHora, value: roundToOneDecimal(average) });
  }

  rows.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

  return rows.map((row) => ({
    label: formatShortDate(row.fechaHora),
    value: row.value,
  }));
}