import { http } from './client';
import type { TeamAssignmentRequest, TeamBalanceResponse, TeamResponse } from './types';

export const teamsApi = {
  generate: (matchId: number): Promise<TeamResponse[]> =>
    http.post<TeamResponse[]>(`/api/matches/${matchId}/teams/generate`),

  list: (matchId: number): Promise<TeamResponse[]> =>
    http.get<TeamResponse[]>(`/api/matches/${matchId}/teams`),

  assignPlayer: (matchId: number, playerId: number, request: TeamAssignmentRequest): Promise<TeamResponse[]> =>
    http.put<TeamResponse[]>(`/api/matches/${matchId}/teams/${playerId}`, request),

  balance: (matchId: number): Promise<TeamBalanceResponse> =>
    http.get<TeamBalanceResponse>(`/api/matches/${matchId}/teams/balance`),
};