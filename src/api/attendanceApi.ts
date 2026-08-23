import { http } from './client';
import type {
  AttendanceRankingResponse,
  AttendanceRegisterRequest,
  AttendanceStatisticsResponse,
  MatchAttendanceResponse,
} from './types';

export const attendanceApi = {
  registerAttendance: (
    matchId: number,
    request: AttendanceRegisterRequest,
  ): Promise<MatchAttendanceResponse[]> =>
    http.post<MatchAttendanceResponse[]>(`/api/matches/${matchId}/attendance`, request),

  removeAttendance: (matchId: number, hinchaId: number): Promise<void> =>
    http.delete<void>(`/api/matches/${matchId}/attendance/${hinchaId}`),

  getMatchAttendance: (matchId: number): Promise<MatchAttendanceResponse[]> =>
    http.get<MatchAttendanceResponse[]>(`/api/matches/${matchId}/attendance`),

  getAttendanceRanking: (year?: number): Promise<AttendanceRankingResponse[]> =>
    http.get<AttendanceRankingResponse[]>('/api/attendance/ranking', { year }),

  getAttendanceStatistics: (year?: number): Promise<AttendanceStatisticsResponse> =>
    http.get<AttendanceStatisticsResponse>('/api/attendance/statistics', { year }),
};
