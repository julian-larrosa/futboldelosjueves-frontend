import { http } from './client';
import type { MatchStatus } from './enums';
import type { MatchRequest, MatchResponse, MatchResultRequest, PagedResponse } from './types';

export interface MatchListParams {
  estado?: MatchStatus;
  lugar?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const matchesApi = {
  list: (params: MatchListParams = {}): Promise<PagedResponse<MatchResponse>> =>
    http.get<PagedResponse<MatchResponse>>('/api/matches', {
      sort: 'fechaHora:desc',
      ...params,
    }),

  get: (id: number): Promise<MatchResponse> =>
    http.get<MatchResponse>(`/api/matches/${id}`),

  create: (request: MatchRequest): Promise<MatchResponse> =>
    http.post<MatchResponse>('/api/matches', request),

  update: (id: number, request: MatchRequest): Promise<MatchResponse> =>
    http.put<MatchResponse>(`/api/matches/${id}`, request),

  openConvocatoria: (id: number): Promise<MatchResponse> =>
    http.post<MatchResponse>(`/api/matches/${id}/convocatoria/abrir`),

  closeConvocatoria: (id: number): Promise<MatchResponse> =>
    http.post<MatchResponse>(`/api/matches/${id}/convocatoria/cerrar`),

  reopenConvocatoria: (id: number): Promise<MatchResponse> =>
    http.post<MatchResponse>(`/api/matches/${id}/convocatoria/reabrir`),

  start: (id: number): Promise<MatchResponse> =>
    http.post<MatchResponse>(`/api/matches/${id}/iniciar`),

  finish: (id: number, request: MatchResultRequest): Promise<MatchResponse> =>
    http.post<MatchResponse>(`/api/matches/${id}/finalizar`, request),

  cancel: (id: number): Promise<MatchResponse> =>
    http.post<MatchResponse>(`/api/matches/${id}/cancelar`),
};