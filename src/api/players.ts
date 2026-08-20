import { apiClient } from './client'
import type {
  ApiResponse,
  PagedResponse,
  PlayerQuery,
  PlayerRequest,
  PlayerResponse,
} from '@/types'

function buildQuery(params: PlayerQuery): URLSearchParams {
  const query = new URLSearchParams()
  if (params.nombre) query.set('nombre', params.nombre)
  if (params.apellido) query.set('apellido', params.apellido)
  if (params.email) query.set('email', params.email)
  if (params.posicion) query.set('posicion', params.posicion)
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.size !== undefined) query.set('size', String(params.size))
  if (params.sort) query.set('sort', params.sort)
  return query
}

export async function getPlayers(params: PlayerQuery = {}): Promise<PagedResponse<PlayerResponse>> {
  const res = await apiClient.get<ApiResponse<PagedResponse<PlayerResponse>>>('/api/players', {
    params: buildQuery(params),
  })
  return res.data.data
}

export async function getPlayer(id: number): Promise<PlayerResponse> {
  const res = await apiClient.get<ApiResponse<PlayerResponse>>(`/api/players/${id}`)
  return res.data.data
}

export async function createPlayer(data: PlayerRequest): Promise<PlayerResponse> {
  const res = await apiClient.post<ApiResponse<PlayerResponse>>('/api/players', data)
  return res.data.data
}

export async function updatePlayer(id: number, data: PlayerRequest): Promise<PlayerResponse> {
  const res = await apiClient.put<ApiResponse<PlayerResponse>>(`/api/players/${id}`, data)
  return res.data.data
}

export async function deletePlayer(id: number): Promise<void> {
  await apiClient.delete(`/api/players/${id}`)
}