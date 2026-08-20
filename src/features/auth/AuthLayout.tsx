import type { ReactNode } from 'react'
import { Trophy } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,197,94,0.25), transparent), radial-gradient(ellipse 50% 40% at 90% 110%, rgba(59,130,246,0.15), transparent)',
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fútbol de los Jueves</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}