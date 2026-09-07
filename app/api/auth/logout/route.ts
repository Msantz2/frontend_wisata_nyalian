import { NextRequest, NextResponse } from 'next/server';
import { deleteAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await deleteAuthCookie();

    const response = NextResponse.redirect(new URL('/login', request.url));
    return response;
  } catch (error) {
    console.error('[AUTH] Logout error:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    return response;
  }
}
