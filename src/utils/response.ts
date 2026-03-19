import { ApiSuccess, ApiError } from '@/types';

export function successResponse<T>(message: string, data: T): ApiSuccess<T> {
  return { success: true, message, data };
}

export function errorResponse(message: string, error?: string): ApiError {
  return { success: false, message, ...(error ? { error } : {}) };
}
