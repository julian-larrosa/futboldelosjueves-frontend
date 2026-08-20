import { apiClient } from './client'
import type {
  ApiResponse,
  PagedResponse,
  RatingQuery,
  RatingRequest,
  RatingResponse,
} from '@/types'

export async function submitRating(matchId: number, data: RatingRequest): Promise<RatingResponse> {
  const res = await apiClient.post<ApiResponse<RatingResponse>>(`/api/matches/${matchId}/ratings`, data)
  return res.data.data
}

export async function getRatings(
  matchId: number,
  params: RatingQuery = {},
): Promise<PagedResponse<RatingResponse>> {
  const res = await apiClient.get<ApiResponse<PagedResponse<RatingResponse>>>(
    `/api/matches/${matchId}/ratings`,
    { params },
  )
  return res.data.data
}