import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarX2, ListChecks } from 'lucide-react'
import { getMatches } from '@/api/matches'
import { Card, Badge } from '@/components/ui'
import { useAuth } from '@/auth/useAuth'
import { MATCH_STATUS_LABEL, MatchStatus } from '@/types'
import { formatDateTime } from '@/utils/format'

const STATUS_VARIANT: Record<MatchStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'> = {
  PROGRAMADO: 'outline',
  CONVOCATORIA_ABIERTA: 'success',
  CONVOCATORIA_CERRADA: 'info',
  EN_CURSO: 'warning',
  FINALIZADO: 'default',
  CANCELADO: 'danger',
}

function CardSkeleton() {
  return (
    <Card className="animate-pulse p-4">
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="mt-3 h-3 w-1/3 rounded bg-muted" />
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const nowIso = new Date().toISOString()

  const nextMatchQuery = useQuery({
    queryKey: ['matches', 'next'],
    queryFn: () => getMatches({ sort: 'fechaHora:asc', size: 1, fechaDesde: nowIso }),
  })

  const recentMatchesQuery = useQuery({
    queryKey: ['matches', 'recent'],
    queryFn: () => getMatches({ sort: 'fechaHora:desc', size: 5, estado: MatchStatus.FINALIZADO }),
  })

  const nextMatch = nextMatchQuery.data?.content[0]
  const recentMatches = recentMatchesQuery.data?.content ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hola, @{user?.username}</h1>
          <p className="text-sm text-muted-foreground">El fútbol del barrio, todos los jueves.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Próximo partido</h2>
            <Link to="/matches" className="text-xs font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          {nextMatchQuery.isLoading && <CardSkeleton />}

          {nextMatchQuery.isError && (
            <Card className="p-4 text-sm text-destructive">No se pudo cargar el próximo partido.</Card>
          )}

          {nextMatch && (
            <Card className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{nextMatch.lugar || 'Sin lugar definido'}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{formatDateTime(nextMatch.fechaHora)}</p>
                </div>
                <Badge variant={STATUS_VARIANT[nextMatch.estado]}>{MATCH_STATUS_LABEL[nextMatch.estado]}</Badge>
              </div>
              <Link
                to={`/matches/${nextMatch.id}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ListChecks className="h-4 w-4" />
                Ver detalle
              </Link>
            </Card>
          )}

          {!nextMatch && !nextMatchQuery.isLoading && !nextMatchQuery.isError && (
            <Card className="flex flex-col items-center gap-2 p-6 text-center">
              <CalendarX2 className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No hay partidos programados todavía.</p>
            </Card>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Últimos resultados</h2>
            <Link to="/rankings" className="text-xs font-medium text-primary hover:underline">
              Ver rankings
            </Link>
          </div>

          {recentMatchesQuery.isLoading && (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          )}

          {recentMatchesQuery.isError && (
            <Card className="p-4 text-sm text-destructive">No se pudieron cargar los resultados.</Card>
          )}

          {recentMatches.length > 0 && (
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <Card key={match.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{match.lugar || 'Sin lugar definido'}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(match.fechaHora)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {match.estado === MatchStatus.FINALIZADO && (
                      <span className="text-sm font-bold text-foreground">
                        {match.golesEquipoA} - {match.golesEquipoB}
                      </span>
                    )}
                    <Badge variant={STATUS_VARIANT[match.estado]}>{MATCH_STATUS_LABEL[match.estado]}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {recentMatches.length === 0 && !recentMatchesQuery.isLoading && !recentMatchesQuery.isError && (
            <Card className="flex flex-col items-center gap-2 p-6 text-center">
              <CalendarX2 className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Todavía no hay partidos finalizados.</p>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}