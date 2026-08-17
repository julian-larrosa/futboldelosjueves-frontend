import { http } from './client';
import type { MatchStatisticsUpdateRequest, PagedResponse, ParticipationRequest, ParticipationResponse } from './types';

export type ParticipationListParams = {
  page?: number;
  size?: number;
};

export const participationsApi = {
  add: (matchId: number, request: ParticipationRequest): Promise<ParticipationResponse> =>
    http.post<ParticipationResponse>(`/api/matches/${matchId}/participations`, request),

  remove: (matchId: number, playerId: number): Promise<void> =>
    http.delete<void>(`/api/matches/${matchId}/participations/${playerId}`),

  list: (matchId: number, params: ParticipationListParams = {}): Promise<PagedResponse<ParticipationResponse>> =>
    http.get<PagedResponse<ParticipationResponse>>(`/api/matches/${matchId}/participations`, params),

  mine: (matchId: number): Promise<ParticipationResponse> =>
    http.get<ParticipationResponse>(`/api/matches/${matchId}/participations/mine`),

  updateStatistics: (
    matchId: number,
    playerId: number,
    request: MatchStatisticsUpdateRequest,
  ): Promise<ParticipationResponse> =>
    http.put<ParticipationResponse>(`/api/matches/${matchId}/participations/${playerId}`, request),
};