import { apiClient } from './client'
import type {
  ApiResponse,
  AttributeHistoryEntry,
  AttributeRatingResponse,
  MatchAttributeRatingsRequest,
  PlayerAttributeHistoryResponse,
  PlayerAttributesResponse,
} from '@/types'

export async function getPlayerAttributes(playerId: number): Promise<PlayerAttributesResponse> {
  const res = await apiClient.get<ApiResponse<PlayerAttributesResponse>>(`/api/players/${playerId}/attributes`)
  return res.data.data
}

export async function getPlayerAttributeHistory(playerId: number): Promise<AttributeHistoryEntry[]> {
  const res = await apiClient.get<ApiResponse<PlayerAttributeHistoryResponse>>(
    `/api/players/${playerId}/attributes/history`,
  )
  return res.data.data.history
}

export async function saveMatchAttributeRatings(
  matchId: number,
  data: MatchAttributeRatingsRequest,
): Promise<AttributeRatingResponse[]> {
  const res = await apiClient.post<ApiResponse<AttributeRatingResponse[]>>(
    `/api/matches/${matchId}/attribute-ratings`,
    data,
  )
  return res.data.data
}