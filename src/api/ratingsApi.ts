import { http } from './client';
import type { PagedResponse, RatingRequest, RatingResponse } from './types';

export type RatingListParams = {
  page?: number;
  size?: number;
};

export const ratingsApi = {
  create: (matchId: number, request: RatingRequest): Promise<RatingResponse> =>
    http.post<RatingResponse>(`/api/matches/${matchId}/ratings`, request),

  list: (matchId: number, params: RatingListParams = {}): Promise<PagedResponse<RatingResponse>> =>
    http.get<PagedResponse<RatingResponse>>(`/api/matches/${matchId}/ratings`, params),
};