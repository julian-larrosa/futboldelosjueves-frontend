import { apiClient } from './client'
import type {
  ApiResponse,
  MatchStatisticsUpdateRequest,
  ParticipationQuery,
  ParticipationRequest,
  ParticipationResponse,
  PagedResponse,
} from '@/types'

export async function addParticipation(matchId: number, data: ParticipationRequest): Promise<ParticipationResponse> {
  const res = await apiClient.post<ApiResponse<ParticipationResponse>>(`/api/matches/${matchId}/participations`, data)
  return res.data.data
}

export async function removeParticipation(matchId: number, playerId: number): Promise<void> {
  await apiClient.delete(`/api/matches/${matchId}/participations/${playerId}`)
}

export async function getParticipations(
  matchId: number,
  params: ParticipationQuery = {},
): Promise<PagedResponse<ParticipationResponse>> {
  const res = await apiClient.get<ApiResponse<PagedResponse<ParticipationResponse>>>(
    `/api/matches/${matchId}/participations`,
    { params },
  )
  return res.data.data
}

export async function getMyParticipation(matchId: number): Promise<ParticipationResponse> {
  const res = await apiClient.get<ApiResponse<ParticipationResponse>>(`/api/matches/${matchId}/participations/mine`)
  return res.data.data
}

export async function updateParticipationStatistics(
  matchId: number,
  playerId: number,
  data: MatchStatisticsUpdateRequest,
): Promise<ParticipationResponse> {
  const res = await apiClient.put<ApiResponse<ParticipationResponse>>(
    `/api/matches/${matchId}/participations/${playerId}`,
    data,
  )
  return res.data.data
}