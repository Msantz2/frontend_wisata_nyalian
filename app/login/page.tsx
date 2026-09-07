'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCard, LoginForm } from '@/components/admin/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`/api/auth/check`, {
          method: 'GET',
          credentials: 'include', // ✅ CRITICAL: Include cookies
        });

        if (response.ok) {
          router.push('/admin/dashboard');
        }
      } catch (err) {
        console.error('[AUTH] Check failed:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (username: string, password: string) => {
    setError(undefined);

    try {
      console.log('[AUTH] Login attempt:', { username });
       console.log('[AUTH] API URL:', `/api/auth/login`);

      const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ CRITICAL: Include cookies for Set-Cookie
        body: JSON.stringify({ username, password }),
      });

      console.log('[AUTH] Response status:', response.status);
      console.log('[AUTH] Response headers:', {
        'set-cookie': response.headers.get('set-cookie'),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[AUTH] ✅ Login successful:', data.message);
        console.log('[AUTH] Token received:', data.data?.token?.substring(0, 30) + '...');
        
        if (data.data?.token) {
          localStorage.setItem('authToken', data.data.token);
          console.log('[AUTH] Token stored in localStorage');
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        console.error('[AUTH] ❌ Login failed:', errorData);
        setError(errorData.message || errorData.error || 'Login failed');
      }
    } catch (err) {
      console.error('[AUTH] ❌ Error:', err);
      setError('Connection failed');
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LoginCard>
      <LoginForm onSubmit={handleLogin} error={error} />
    </LoginCard>
  );
}