import type { AuthUser, AuthSession } from '@/types/auth';
import { getAuthCookie, validateSession } from './cookie';

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await getAuthCookie();

    if (!session) {
      return null;
    }

    if (!validateSession(session)) {
      return null;
    }

    return {
      username: session.userId,
      loginAt: new Date(session.issuedAt),
      expiresAt: new Date(session.expiresAt),
    };
  } catch (error) {
    console.error('[AUTH] Session validation failed:', error);
    return null;
  }
}

export function createSession(): AuthSession {
  const now = Date.now();
  const expiresAt = now + 86400000; // 24 hours in milliseconds

  return {
    userId: 'admin',
    issuedAt: now,
    expiresAt,
  };
}
