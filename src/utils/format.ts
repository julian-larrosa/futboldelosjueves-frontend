import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: string | null | undefined): string {
  const date = parseDate(value)
  return date ? format(date, "dd/MM/yyyy", { locale: es }) : '—'
}

export function formatDateTime(value: string | null | undefined): string {
  const date = parseDate(value)
  return date ? format(date, "dd/MM/yyyy HH:mm", { locale: es }) : '—'
}

export function formatTime(value: string | null | undefined): string {
  const date = parseDate(value)
  return date ? format(date, 'HH:mm', { locale: es }) : '—'
}

export function formatRelative(value: string | null | undefined): string {
  const date = parseDate(value)
  return date ? formatDistanceToNow(date, { addSuffix: true, locale: es }) : '—'
}

export function formatRating(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return value.toFixed(2)
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${Math.round(value * 100)}%`
}

export function initials(nombre: string, apellido: string): string {
  const first = nombre.charAt(0)
  const second = apellido.charAt(0)
  return `${first}${second}`.toUpperCase()
}