import { apiClient } from './client'
import type {
  ApiResponse,
  MatchCommentRequest,
  MatchCommentResponse,
} from '@/types'

export async function getComments(matchId: number): Promise<MatchCommentResponse[]> {
  const res = await apiClient.get<ApiResponse<MatchCommentResponse[]>>(`/api/matches/${matchId}/comments`)
  return res.data.data
}

export async function createComment(matchId: number, data: MatchCommentRequest): Promise<MatchCommentResponse> {
  const res = await apiClient.post<ApiResponse<MatchCommentResponse>>(`/api/matches/${matchId}/comments`, data)
  return res.data.data
}

export async function updateComment(
  matchId: number,
  commentId: number,
  data: MatchCommentRequest,
): Promise<MatchCommentResponse> {
  const res = await apiClient.put<ApiResponse<MatchCommentResponse>>(
    `/api/matches/${matchId}/comments/${commentId}`,
    data,
  )
  return res.data.data
}