import type { ErrorResponse } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly body?: ErrorResponse;

  constructor(message: string, status: number, body?: ErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isConflict(): boolean {
    return this.status === 409;
  }
}
