import { apiClient } from './client'
import type { ApiResponse, MatchResultRequest, MatchResultResponse } from '@/types'

export async function getMatchResult(matchId: number): Promise<MatchResultResponse> {
  const res = await apiClient.get<ApiResponse<MatchResultResponse>>(`/api/matches/${matchId}/result`)
  return res.data.data
}

export async function saveMatchResult(matchId: number, data: MatchResultRequest): Promise<MatchResultResponse> {
  const res = await apiClient.put<ApiResponse<MatchResultResponse>>(`/api/matches/${matchId}/result`, data)
  return res.data.data
}