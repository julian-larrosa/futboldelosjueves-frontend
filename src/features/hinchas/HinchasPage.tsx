import { useState } from 'react'
import { Megaphone } from 'lucide-react'
import { getHinchas } from '@/api/hinchas'
import { Badge, Button, Card } from '@/components/ui'
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery'
import type { HinchaResponse } from '@/types'
import { initials } from '@/utils/format'
import { ResetPasswordModal } from './ResetPasswordModal'

function RowSkeleton() {
  return (
    <Card className="animate-pulse p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </Card>
  )
}

export default function HinchasPage() {
  const [page, setPage] = useState(0)
  const [resetTarget, setResetTarget] = useState<HinchaResponse | null>(null)

  const query = usePaginatedQuery<HinchaResponse>({
    queryKey: ['hinchas'],
    queryFn: (p, s) => getHinchas({ page: p, size: s }),
    page,
    size: 10,
  })

  const hinchas = query.data?.content ?? []
  const totalPages = Math.max(query.data?.totalPages ?? 1, 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hinchas</h1>
        <p className="text-sm text-muted-foreground">
          {query.data ? `${query.data.totalElements} hinchas registrados` : 'Cuentas de hinchas'}
        </p>
      </div>

      {query.isLoading && (
        <div className="space-y-3">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      )}

      {query.isError && (
        <Card className="p-4 text-sm text-destructive">No se pudieron cargar los hinchas.</Card>
      )}

      {!query.isLoading && !query.isError && hinchas.length > 0 && (
        <div className="space-y-3">
          {hinchas.map((hincha) => (
            <Card key={hincha.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {initials(hincha.nombre, hincha.apellido)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {hincha.nombre} {hincha.apellido}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{hincha.username} · {hincha.email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={hincha.activo ? 'success' : 'outline'}>
                  {hincha.activo ? 'Activo' : 'Inactivo'}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setResetTarget(hincha)}>
                  Resetear contraseña
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!query.isLoading && !query.isError && hinchas.length === 0 && (
        <Card className="flex flex-col items-center gap-2 p-6 text-center">
          <Megaphone className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Todavía no hay hinchas registrados.</p>
        </Card>
      )}

      {!query.isLoading && !query.isError && hinchas.length > 0 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      <ResetPasswordModal
        open={resetTarget !== null}
        defaultEmail={resetTarget?.email ?? ''}
        onClose={() => setResetTarget(null)}
      />
    </div>
  )
}