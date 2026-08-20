import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { ROLE_LABEL } from '@/types'
import { initials } from '@/utils/format'
import { Button } from '@/components/ui'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="p-1 md:hidden" onClick={onMenuClick} aria-label="Abrir menú">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-semibold text-foreground md:hidden">FDLJ</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            {initials(user.username, user.username)}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight text-foreground">@{user.username}</p>
            <p className="text-xs leading-tight text-muted-foreground">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} aria-label="Cerrar sesión">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  )
}