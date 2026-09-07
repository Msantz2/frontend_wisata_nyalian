import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { LoginRequest } from '@/types/auth';
import { setAuthCookie, createSession } from '@/lib/auth';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

interface BackendLoginResponse {
  success: boolean;
  message: string;
  data?: {
    admin: {
      id_admin: number;
      username: string;
      nama_lengkap: string;
      role: string;
      created_by: number | null;
      updated_by: number | null;
      deleted_by: number | null;
    };
    token: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: body.username,
        password: body.password,
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error('[AUTH] Backend login failed status:', backendResponse.status);
      console.error('[AUTH] Backend login failed:', errorData);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const data: BackendLoginResponse = await backendResponse.json();

    if (!data.success || !data.data) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const session = createSession();
    
    try {
      await setAuthCookie(session);
    } catch (cookieError) {
      console.error('[AUTH] Cookie error:', cookieError);
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.data.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token: data.data.token,
        admin: data.data.admin
      }
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  }
}

