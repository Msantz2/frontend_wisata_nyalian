// Shared authentication middleware for API routes
// Per 19-api-overview.md Section 8 (Authentication Enforcement)
// Per 03-authentication.md (Session validation)

import { getCurrentUser } from '@/lib/auth/session';
import { apiError } from './response';
import { NextResponse } from 'next/server';

/**
 * Verify admin session and return current user
 * Per 19-api-overview.md Section 8
 * All admin API endpoints (except login) require this check
 *
 * @throws Returns 401 if no valid session
 */
export async function requireAuth() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { user: null, response: apiError('UNAUTHORIZED', 'Session expired or invalid', undefined, 401) };
    }

    return { user, response: null };
  } catch (error) {
    console.error('[AUTH] Error verifying session:', error);
    return { user: null, response: apiError('UNAUTHORIZED', 'Session validation failed', undefined, 401) };
  }
}

/**
 * Middleware wrapper that enforces authentication
 * Usage: const auth = await requireAuth(); if (auth.response) return auth.response;
 */
export async function withAuth<T>(handler: () => Promise<NextResponse<T>>): Promise<NextResponse> {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    return await handler();
  } catch (error) {
    console.error('[API] Route handler error:', error);
    return apiError('INTERNAL_ERROR', 'An unexpected error occurred', undefined, 500);
  }
}
