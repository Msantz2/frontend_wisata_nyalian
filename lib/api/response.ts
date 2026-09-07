// Shared API response utilities
// Per 19-api-overview.md Section 6 (Standard Response Format)

import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Success response envelope
 * Per 19-api-overview.md Section 6.1
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Error response envelope
 * Per 19-api-overview.md Section 6.2
 */
export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Return a success response
 * Per 19-api-overview.md Section 6.1
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Return an error response
 * Per 19-api-overview.md Section 6.2 and 7
 */
export function apiError(
  code: string,
  message: string,
  errors?: Array<{ field: string; message: string }>,
  status: number = 400
): NextResponse {
  const response: ApiErrorResponse = {
    success: false,
    code,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return NextResponse.json(response, { status });
}

/**
 * Convert Zod validation errors to field format
 * Per 19-api-overview.md Section 6.2 and 17-article-validation.md Section 8
 */
export function formatZodErrors(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'unknown',
    message: issue.message,
  }));
}

/**
 * Handle different error types and return appropriate response
 * Per 19-api-overview.md Section 7
 * 
 * Maps service layer errors to API responses
 */
export function handleServiceError(error: unknown): NextResponse {
  // Check error type by name to avoid circular dependency
  const errorName = (error as Record<string, unknown>).constructor?.name;
  const message = error instanceof Error ? error.message : 'Unknown error';
  const errors = (error as Record<string, unknown>).errors as Array<{ field: string; message: string }> | undefined;

  switch (errorName) {
    case 'ValidationError':
      return apiError('VALIDATION_ERROR', message, errors, 422);

    case 'ArticleNotFoundError':
      return apiError('NOT_FOUND', message, undefined, 404);

    case 'SlugConflictError':
      return apiError(
        'CONFLICT',
        message,
        [{ field: 'slug', message: 'This slug is already in use.' }],
        409
      );

    default:
      if (error instanceof Error) {
        console.error('[API] Error:', error);
      } else {
        console.error('[API] Unknown error:', error);
      }
      return apiError(
        'INTERNAL_ERROR',
        'An unexpected error occurred. Please try again later.',
        undefined,
        500
      );
  }
}
