import { http } from './client';
import type { AttributeRatingResponse, MatchAttributeRatingsRequest, PlayerAttributeHistoryResponse, PlayerAttributesResponse } from './types';

export const attributesApi = {
  getPlayerAttributes: (playerId: number): Promise<PlayerAttributesResponse> =>
    http.get<PlayerAttributesResponse>(`/api/players/${playerId}/attributes`),

  getPlayerAttributeHistory: (playerId: number): Promise<PlayerAttributeHistoryResponse> =>
    http.get<PlayerAttributeHistoryResponse>(`/api/players/${playerId}/attributes/history`),

  submitMatchRatings: (matchId: number, request: MatchAttributeRatingsRequest): Promise<AttributeRatingResponse[]> =>
    http.post<AttributeRatingResponse[]>(`/api/matches/${matchId}/attribute-ratings`, request),
};