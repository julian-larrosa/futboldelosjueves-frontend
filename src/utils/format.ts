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