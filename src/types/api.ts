export interface ApiResponse<T> {
  success: boolean
  status: number
  message: string
  data: T
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
}

export interface PageRequest {
  page?: number
  size?: number
  sort?: string
}

export type SortDirection = 'asc' | 'desc'

export function buildSort(property: string, direction: SortDirection): string {
  return `${property}:${direction}`
}