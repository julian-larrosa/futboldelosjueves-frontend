import { http } from './client';
import type { MatchResultRequest, MatchResultResponse } from './types';

export const resultsApi = {
  get: (matchId: number): Promise<MatchResultResponse> =>
    http.get<MatchResultResponse>(`/api/matches/${matchId}/result`),

  update: (matchId: number, request: MatchResultRequest): Promise<MatchResultResponse> =>
    http.put<MatchResultResponse>(`/api/matches/${matchId}/result`, request),
};