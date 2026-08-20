import { apiClient } from './client'
import type { ApiResponse, HinchaQuery, HinchaResponse, PagedResponse } from '@/types'

export async function getHinchas(params: HinchaQuery = {}): Promise<PagedResponse<HinchaResponse>> {
  const res = await apiClient.get<ApiResponse<PagedResponse<HinchaResponse>>>('/api/hinchas', {
    params,
  })
  return res.data.data
}

export async function getHincha(id: number): Promise<HinchaResponse> {
  const res = await apiClient.get<ApiResponse<HinchaResponse>>(`/api/hinchas/${id}`)
  return res.data.data
}