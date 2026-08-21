import type { PlayerAttributes } from '../types';
import type { MatchResponse, PlayerAttributeHistoryResponse, TopScorerResponse } from '../api';
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

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function toRadarPoints(attributes: PlayerAttributes): RadarPoint[] {
  return ATTRIBUTE_RADAR.map(({ key, subject }) => ({
    subject,
    metric: attributes[key],
  }));
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