import { BarChart3, CalendarDays, ClipboardCheck, LayoutDashboard, Megaphone, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  roles: Role[]
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'PLAYER', 'HINCHADA'] },
  { to: '/matches', label: 'Partidos', icon: CalendarDays, roles: ['ADMIN', 'PLAYER', 'HINCHADA'] },
  { to: '/players', label: 'Jugadores', icon: Users, roles: ['ADMIN', 'PLAYER', 'HINCHADA'] },
  { to: '/rankings', label: 'Rankings', icon: BarChart3, roles: ['ADMIN', 'PLAYER', 'HINCHADA'] },
  { to: '/attendance', label: 'Asistencia', icon: ClipboardCheck, roles: ['ADMIN', 'HINCHADA'] },
  { to: '/hinchas', label: 'Hinchas', icon: Megaphone, roles: ['ADMIN'] },
]

export function getNavItems(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role))
}