import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PagedResponse } from '@/types'

interface UsePaginatedQueryOptions<T> {
  queryKey: readonly unknown[]
  queryFn: (page: number, size: number) => Promise<PagedResponse<T>>
  page: number
  size?: number
  enabled?: boolean
}

export function usePaginatedQuery<T>({ queryKey, queryFn, page, size = 10, enabled = true }: UsePaginatedQueryOptions<T>) {
  return useQuery({
    queryKey: [...queryKey, page, size],
    queryFn: () => queryFn(page, size),
    placeholderData: keepPreviousData,
    enabled,
  })
}