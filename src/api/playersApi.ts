import { http } from './client';
import type { PlayerPosition } from './enums';
import type { PagedResponse, PlayerRequest, PlayerResponse } from './types';

export interface PlayerListParams {
  nombre?: string;
  apellido?: string;
  email?: string;
  posicion?: PlayerPosition;
  page?: number;
  size?: number;
  sort?: string;
}

export const playersApi = {
  list: (params: PlayerListParams = {}): Promise<PagedResponse<PlayerResponse>> =>
    http.get<PagedResponse<PlayerResponse>>('/api/players', {
      sort: 'apellido:asc',
      ...params,
    }),

  get: (id: number): Promise<PlayerResponse> =>
    http.get<PlayerResponse>(`/api/players/${id}`),

  create: (request: PlayerRequest): Promise<PlayerResponse> =>
    http.post<PlayerResponse>('/api/players', request),

  update: (id: number, request: PlayerRequest): Promise<PlayerResponse> =>
    http.put<PlayerResponse>(`/api/players/${id}`, request),

  deactivate: (id: number): Promise<void> =>
    http.delete<void>(`/api/players/${id}`),
};