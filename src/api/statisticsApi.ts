import { http } from './client';
import type { ParticipationResponse, PlayerStatisticsResponse, RatingAverageResponse, RecentFormResponse, TeamStandingResponse, TopScorerResponse } from './types';

export type PlayerStatisticsParams = {
  year?: number;
};

export type RecentFormParams = {
  limit?: number;
  year?: number;
};

export const statisticsApi = {
  getMatchStatistics: (matchId: number): Promise<ParticipationResponse[]> =>
    http.get<ParticipationResponse[]>(`/api/matches/${matchId}/statistics`),

  getPlayerStatistics: (playerId: number, params: PlayerStatisticsParams = {}): Promise<PlayerStatisticsResponse> =>
    http.get<PlayerStatisticsResponse>(`/api/players/${playerId}/statistics`, params),

  getRecentForm: (playerId: number, params: RecentFormParams = {}): Promise<RecentFormResponse> =>
    http.get<RecentFormResponse>(`/api/players/${playerId}/statistics/recent`, params),

  getMatchStandings: (matchId: number): Promise<TeamStandingResponse[]> =>
    http.get<TeamStandingResponse[]>(`/api/matches/${matchId}/standings`),

  getStandings: (params: PlayerStatisticsParams = {}): Promise<TeamStandingResponse[]> =>
    http.get<TeamStandingResponse[]>('/api/statistics/standings', params),

  getTopScorers: (params: PlayerStatisticsParams = {}): Promise<TopScorerResponse[]> =>
    http.get<TopScorerResponse[]>('/api/statistics/top-scorers', params),

  getRatingRanking: (params: PlayerStatisticsParams = {}): Promise<RatingAverageResponse[]> =>
    http.get<RatingAverageResponse[]>('/api/statistics/ratings', params),
};