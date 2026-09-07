/**
 * API Health Check - Diagnose connectivity issues
 */

import { apiClient } from './client';

export async function checkApiHealth(): Promise<{
  isHealthy: boolean;
  apiUrl: string;
  error: string | null;
}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  try {
    const response = await fetch(`${apiUrl.replace('/api/v1', '')}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      return {
        isHealthy: true,
        apiUrl,
        error: null,
      };
    }

    return {
      isHealthy: false,
      apiUrl,
      error: `Server responded with status ${response.status}`,
    };
  } catch (error) {
    return {
      isHealthy: false,
      apiUrl,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

export async function diagnoseFAQApi(): Promise<{
  health: Awaited<ReturnType<typeof checkApiHealth>>;
  faqEndpoint: string;
  suggestion: string;
}> {
  const health = await checkApiHealth();

  let suggestion = '';
  if (!health.isHealthy) {
    if (health.error?.includes('Failed to fetch') || health.error?.includes('ERR_CONNECTION')) {
      suggestion = `Backend server is not running. Start it with: npm run start:api (or appropriate backend command) at ${health.apiUrl}`;
    } else if (health.error?.includes('CORS')) {
      suggestion = 'CORS issue detected. Check backend CORS configuration to allow http://localhost:3000';
    } else {
      suggestion = `API connection failed: ${health.error}. Check that the backend is running at ${health.apiUrl}`;
    }
  } else {
    suggestion = 'API is healthy. If you still see errors, check browser console for more details.';
  }

  return {
    health,
    faqEndpoint: `${health.apiUrl}/faq`,
    suggestion,
  };
}
