import { apiClient } from './client'
import type {
  ApiResponse,
  TeamAssignmentRequest,
  TeamBalanceResponse,
  TeamResponse,
} from '@/types'

export async function generateTeams(matchId: number): Promise<TeamResponse[]> {
  const res = await apiClient.post<ApiResponse<TeamResponse[]>>(`/api/matches/${matchId}/teams/generate`)
  return res.data.data
}

export async function getTeams(matchId: number): Promise<TeamResponse[]> {
  const res = await apiClient.get<ApiResponse<TeamResponse[]>>(`/api/matches/${matchId}/teams`)
  return res.data.data
}

export async function assignPlayerToTeam(
  matchId: number,
  playerId: number,
  data: TeamAssignmentRequest,
): Promise<TeamResponse[]> {
  const res = await apiClient.put<ApiResponse<TeamResponse[]>>(
    `/api/matches/${matchId}/teams/${playerId}`,
    data,
  )
  return res.data.data
}

export async function getTeamBalance(matchId: number): Promise<TeamBalanceResponse> {
  const res = await apiClient.get<ApiResponse<TeamBalanceResponse>>(`/api/matches/${matchId}/teams/balance`)
  return res.data.data
}