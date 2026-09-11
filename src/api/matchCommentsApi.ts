import { http } from './client';
import type { MatchCommentResponse } from './types';

export const matchCommentsApi = {
  list: (matchId: number): Promise<MatchCommentResponse[]> =>
    http.get<MatchCommentResponse[]>(`/api/matches/${matchId}/comments`),
};
