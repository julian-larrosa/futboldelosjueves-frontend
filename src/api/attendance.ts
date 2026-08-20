import { apiClient } from './client'
import type {
  ApiResponse,
  AttendanceRankingResponse,
  AttendanceRegisterRequest,
  AttendanceStatisticsResponse,
  MatchAttendanceResponse,
} from '@/types'

export async function registerAttendance(
  matchId: number,
  data: AttendanceRegisterRequest,
): Promise<MatchAttendanceResponse[]> {
  const res = await apiClient.post<ApiResponse<MatchAttendanceResponse[]>>(
    `/api/matches/${matchId}/attendance`,
    data,
  )
  return res.data.data
}

export async function removeAttendance(matchId: number, hinchaId: number): Promise<void> {
  await apiClient.delete(`/api/matches/${matchId}/attendance/${hinchaId}`)
}

export async function getMatchAttendance(matchId: number): Promise<MatchAttendanceResponse[]> {
  const res = await apiClient.get<ApiResponse<MatchAttendanceResponse[]>>(`/api/matches/${matchId}/attendance`)
  return res.data.data
}

export async function getHinchaAttendance(hinchaId: number, year?: number): Promise<MatchAttendanceResponse[]> {
  const res = await apiClient.get<ApiResponse<MatchAttendanceResponse[]>>(`/api/hinchas/${hinchaId}/attendance`, {
    params: year ? { year } : undefined,
  })
  return res.data.data
}

export async function getAttendanceRanking(year?: number): Promise<AttendanceRankingResponse[]> {
  const res = await apiClient.get<ApiResponse<AttendanceRankingResponse[]>>('/api/attendance/ranking', {
    params: year ? { year } : undefined,
  })
  return res.data.data
}

export async function getAttendanceStatistics(year?: number): Promise<AttendanceStatisticsResponse> {
  const res = await apiClient.get<ApiResponse<AttendanceStatisticsResponse>>('/api/attendance/statistics', {
    params: year ? { year } : undefined,
  })
  return res.data.data
}