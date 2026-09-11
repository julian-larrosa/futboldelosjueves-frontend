import type { MatchResponse } from '../api';
import { formatMatchDate, formatMatchTime } from './format';

export interface AppNotification {
  id: string;
  type: 'new-match';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

const NOTIFICATIONS_KEY = 'fdlj.notifications.v1';
const SEEN_MATCHES_KEY = 'fdlj.seenMatchIds.v1';
const MAX_NOTIFICATIONS = 30;
// Límite por sincronización para no inundar en la primera carga con historial viejo
const MAX_NEW_PER_SYNC = 5;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

export function getNotifications(): AppNotification[] {
  return readJson<AppNotification[]>(NOTIFICATIONS_KEY, []);
}

function saveNotifications(notifications: AppNotification[]): void {
  writeJson(NOTIFICATIONS_KEY, notifications);
}

export function markAllNotificationsRead(): AppNotification[] {
  const updated = getNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
  return updated;
}

export function countUnread(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.read).length;
}

function isUpcoming(match: MatchResponse): boolean {
  return (
    match.estado === 'PROGRAMADO' ||
    match.estado === 'CONVOCATORIA_ABIERTA' ||
    match.estado === 'CONVOCATORIA_CERRADA' ||
    match.estado === 'EN_CURSO'
  );
}

/**
 * Detecta partidos nuevos (no vistos previamente) y genera notificaciones
 * locales para el usuario. Devuelve la lista de notificaciones actualizada.
 */
export function syncMatchNotifications(matches: MatchResponse[]): AppNotification[] {
  const seen = new Set(readJson<string[]>(SEEN_MATCHES_KEY, []));
  const currentIds = new Set(matches.map((m) => String(m.id)));

  const newUpcoming = matches
    .filter((m) => isUpcoming(m) && !seen.has(String(m.id)))
    .sort(
      (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime(),
    )
    .slice(0, MAX_NEW_PER_SYNC);

  // Siempre actualizar los vistos para no re-notificar
  writeJson(SEEN_MATCHES_KEY, [...currentIds]);

  // Partidos finalizados o cancelados cuyas notificaciones deben eliminarse
  const finishedOrCancelledIds = new Set(
    matches
      .filter((m) => m.estado === 'FINALIZADO' || m.estado === 'CANCELADO')
      .map((m) => String(m.id)),
  );

  const existing = getNotifications().filter((n) => {
    const matchId = n.id.replace('new-match-', '');
    return !finishedOrCancelledIds.has(matchId);
  });

  if (newUpcoming.length === 0) {
    saveNotifications(existing);
    return existing;
  }

  const created: AppNotification[] = newUpcoming.map((match) => ({
    id: `new-match-${match.id}`,
    type: 'new-match',
    title: 'Nuevo partido programado',
    body: `${formatMatchDate(match.fechaHora)} · ${formatMatchTime(match.fechaHora)}${
      match.lugar ? ` · ${match.lugar}` : ''
    }`,
    createdAt: new Date().toISOString(),
    read: false,
  }));

  const updated = [...created, ...existing].slice(0, MAX_NOTIFICATIONS);
  saveNotifications(updated);
  return updated;
}
