import { cookies } from 'next/headers';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import type { AuthSession } from '@/types/auth';

const COOKIE_NAME = 'auth-session';
const SESSION_DURATION = 86400; // 24 hours in seconds

function createSessionToken(session: AuthSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

function parseSessionToken(token: string): AuthSession | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded) as AuthSession;
  } catch {
    return null;
  }
}

export async function setAuthCookie(session: AuthSession): Promise<void> {
  const cookieStore = await cookies();
  const token = createSessionToken(session);

  const cookieOptions: ResponseCookie = {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_DURATION,
    path: '/',
  };

  cookieStore.set(cookieOptions);
}

export async function getAuthCookie(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  if (!cookie || !cookie.value) {
    return null;
  }

  return parseSessionToken(cookie.value);
}

export async function deleteAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function validateSession(session: AuthSession): boolean {
  const now = Date.now();
  return now < session.expiresAt;
}
