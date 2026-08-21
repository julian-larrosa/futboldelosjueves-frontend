import { useCallback, useEffect, useState } from 'react';
import type { PagedResponse } from '../api';

export interface UsePaginatedApiResult<T> {
  data: T[] | undefined;
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setSize: (size: number) => void;
  refetch: () => void;
}

export function usePaginatedApi<T>(
  fetcher: (page: number, size: number) => Promise<PagedResponse<T>>,
  initialSize: number = 20,
): UsePaginatedApiResult<T> {
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialSize);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetcher(page, size)
      .then((result) => {
        if (active) {
          setData(result.content);
          setTotalElements(result.totalElements);
          setTotalPages(result.totalPages);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error al cargar los datos.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [fetcher, page, size, nonce]);

  const goToPage = useCallback((target: number) => {
    setPage(Math.max(0, target));
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSetSize = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return {
    data,
    loading,
    error,
    page,
    size,
    totalElements,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrevious: page > 0,
    goToPage,
    nextPage,
    previousPage,
    setSize: handleSetSize,
    refetch,
  };
}
