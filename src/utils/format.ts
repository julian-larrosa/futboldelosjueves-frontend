export function formatMatchDate(fechaHora: string): string {
  return new Date(fechaHora).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMatchTime(fechaHora: string): string {
  return new Date(fechaHora).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(fechaHora: string): string {
  return new Date(fechaHora).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function getFirstNameInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) {
    return '';
  }
  const first = parts[0];
  const second = parts[1];
  return `${first.charAt(0)}.${second ? ` ${second}` : ''}`.trim();
}

export type Forma = 'up' | 'down' | 'neutral';

/**
 * Regla de estado de forma según puntos en los últimos 2 partidos
 * (victoria = 3 pts, empate = 1 pt):
 * - Menos de 2 partidos jugados → neutral
 * - 4 o más puntos (2 victorias o victoria+empate) → arriba
 * - Cualquier otro caso → abajo
 */
export function mapFormaByLastTwo(
  victorias: number,
  empates: number,
  partidosJugados: number,
): Forma {
  if (!Number.isFinite(victorias) || !Number.isFinite(empates) || partidosJugados < 2) {
    return 'neutral';
  }
  const points = victorias * 3 + empates;
  return points >= 4 ? 'up' : 'down';
}