import { apiClient } from './client'
import type {
  ApiResponse,
  PlayerStatisticsResponse,
  RatingAverageResponse,
  RecentFormResponse,
  TeamStandingResponse,
  TopScorerResponse,
} from '@/types'

export async function getMatchStatistics(matchId: number): Promise<unknown[]> {
  const res = await apiClient.get<ApiResponse<unknown[]>>(`/api/matches/${matchId}/statistics`)
  return res.data.data
}

export async function getPlayerStatistics(playerId: number, year?: number): Promise<PlayerStatisticsResponse> {
  const res = await apiClient.get<ApiResponse<PlayerStatisticsResponse>>(`/api/players/${playerId}/statistics`, {
    params: year ? { year } : undefined,
  })
  return res.data.data
}

export async function getRecentForm(playerId: number, limit = 3, year?: number): Promise<RecentFormResponse> {
  const res = await apiClient.get<ApiResponse<RecentFormResponse>>(`/api/players/${playerId}/statistics/recent`, {
    params: { limit, ...(year ? { year } : {}) },
  })
  return res.data.data
}

export async function getMatchStandings(matchId: number): Promise<TeamStandingResponse[]> {
  const res = await apiClient.get<ApiResponse<TeamStandingResponse[]>>(`/api/matches/${matchId}/standings`)
  return res.data.data
}

export async function getSeasonStandings(year?: number): Promise<TeamStandingResponse[]> {
  const res = await apiClient.get<ApiResponse<TeamStandingResponse[]>>('/api/statistics/standings', {
    params: year ? { year } : undefined,
  })
  return res.data.data
}

export async function getTopScorers(year?: number): Promise<TopScorerResponse[]> {
  const res = await apiClient.get<ApiResponse<TopScorerResponse[]>>('/api/statistics/top-scorers', {
    params: year ? { year } : undefined,
  })
  return res.data.data
}

export async function getRatingAverages(year?: number): Promise<RatingAverageResponse[]> {
  const res = await apiClient.get<ApiResponse<RatingAverageResponse[]>>('/api/statistics/ratings', {
    params: year ? { year } : undefined,
  })
  return res.data.data
}