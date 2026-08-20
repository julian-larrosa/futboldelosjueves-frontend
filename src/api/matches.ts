import { apiClient } from './client'
import type {
  ApiResponse,
  MatchQuery,
  MatchRequest,
  MatchResponse,
  PagedResponse,
} from '@/types'

function buildQuery(params: MatchQuery): URLSearchParams {
  const query = new URLSearchParams()
  if (params.estado) query.set('estado', params.estado)
  if (params.lugar) query.set('lugar', params.lugar)
  if (params.fechaDesde) query.set('fechaDesde', params.fechaDesde)
  if (params.fechaHasta) query.set('fechaHasta', params.fechaHasta)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.size !== undefined) query.set('size', String(params.size))
  if (params.sort) query.set('sort', params.sort)
  return query
}

export async function getMatches(params: MatchQuery = {}): Promise<PagedResponse<MatchResponse>> {
  const res = await apiClient.get<ApiResponse<PagedResponse<MatchResponse>>>('/api/matches', {
    params: buildQuery(params),
  })
  return res.data.data
}

export async function getMatch(id: number): Promise<MatchResponse> {
  const res = await apiClient.get<ApiResponse<MatchResponse>>(`/api/matches/${id}`)
  return res.data.data
}

export async function createMatch(data: MatchRequest): Promise<MatchResponse> {
  const res = await apiClient.post<ApiResponse<MatchResponse>>('/api/matches', data)
  return res.data.data
}

export async function updateMatch(id: number, data: MatchRequest): Promise<MatchResponse> {
  const res = await apiClient.put<ApiResponse<MatchResponse>>(`/api/matches/${id}`, data)
  return res.data.data
}

export async function openConvocatoria(id: number): Promise<MatchResponse> {
  const res = await apiClient.post<ApiResponse<MatchResponse>>(`/api/matches/${id}/convocatoria/abrir`)
  return res.data.data
}

export async function closeConvocatoria(id: number): Promise<MatchResponse> {
  const res = await apiClient.post<ApiResponse<MatchResponse>>(`/api/matches/${id}/convocatoria/cerrar`)
  return res.data.data
}

export async function reopenConvocatoria(id: number): Promise<MatchResponse> {
  const res = await apiClient.post<ApiResponse<MatchResponse>>(`/api/matches/${id}/convocatoria/reabrir`)
  return res.data.data
}

export async function startMatch(id: number): Promise<MatchResponse> {
  const res = await apiClient.post<ApiResponse<MatchResponse>>(`/api/matches/${id}/iniciar`)
  return res.data.data
}

export async function cancelMatch(id: number): Promise<MatchResponse> {
  const res = await apiClient.post<ApiResponse<MatchResponse>>(`/api/matches/${id}/cancelar`)
  return res.data.data
}