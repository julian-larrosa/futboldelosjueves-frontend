import { NavLink } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { getNavItems } from './nav'
import { useAuth } from '@/auth/useAuth'

interface SidebarProps {
  mobile?: boolean
  onNavigate?: () => void
}

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const { user } = useAuth()
  if (!user) return null

  const items = getNavItems(user.role)

  return (
    <nav className={`flex flex-col gap-1 p-3 ${mobile ? 'h-full' : 'h-full'}`} aria-label="Navegación principal">
      {!mobile && (
        <div className="mb-4 flex items-center gap-2 px-2 pt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-bold text-foreground">Fútbol de los Jueves</span>
        </div>
      )}

      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}