import { http } from './client';
import type { HinchaResponse, PagedResponse } from './types';

export interface HinchaListParams {
  page?: number;
  size?: number;
}

export const hinchasApi = {
  list: (params: HinchaListParams = {}): Promise<PagedResponse<HinchaResponse>> =>
    http.get<PagedResponse<HinchaResponse>>('/api/hinchas', {
      sort: 'apellido:asc',
      ...params,
    }),
};
