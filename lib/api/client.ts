/**
 * API Client - Base HTTP client for all API calls
 * Handles request/response formatting, error handling, and base URL configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  errors?: string[];
}

export interface ApiListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get JWT token from cookies (auth_token)
 * Token is stored in cookies by backend after successful login
 */
function getAuthToken(): string | null {
  if (typeof document === 'undefined') {
    console.debug('[Auth] SSR context - no document available');
    return null;
  }

  try {
    // Parse cookies and find auth_token
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      const [name, value] = trimmed.split('=');
      
      // Look for "auth_token" cookie (JWT token set by login route)
      if (name === 'auth_token' && value) {
        const decodedToken = decodeURIComponent(value);
        console.debug('[Auth] ✅ Token found in cookies (auth_token)');
        console.debug('[Auth] Token prefix:', decodedToken.substring(0, 30) + '...');
        return decodedToken;
      }
    }
  } catch (error) {
    console.error('[Auth] Error parsing cookies:', error);
  }

  // Fallback: Try localStorage (if token also stored there)
  if (typeof window !== 'undefined') {
    const localToken = 
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth-token');
    
    if (localToken) {
      console.debug('[Auth] ✅ Token found in localStorage (fallback)');
      return localToken;
    }
  }

  console.warn('[Auth] ❌ No auth_token found in cookies or localStorage');
  return null;
}

/**
 * Make HTTP request to API
 */
async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, params } = options;

  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Get auth token
  const token = getAuthToken();

  // Prepare request options
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  // Add auth token if available
  if (token) {
    (fetchOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Add body if present
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), fetchOptions);

    // Parse response
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch {
      // If response is not JSON, create error response
      data = {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText}`,
        data: undefined as unknown as T,
      };
    }

    // Handle error responses
    if (!response.ok) {
      console.error('[API Error]', {
        endpoint,
        method,
        status: response.status,
        message: data.message,
        url: url.toString(),
      });

      throw new ApiError(
        response.status,
        data.message || `HTTP ${response.status}`,
        data.errors
      );
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof ApiError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[API Network Error]', {
      endpoint,
      method,
      error: errorMessage,
      url: url.toString(),
    });

    throw new ApiError(
      0,
      errorMessage,
      undefined
    );
  }
}

export const apiClient = {
  /**
   * GET request
   */
  get: async <T>(endpoint: string, params?: ApiListParams) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  /**
   * POST request
   */
  post: async <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'POST', body }),

  /**
   * PUT request
   */
  put: async <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'PUT', body }),

  /**
   * PATCH request
   */
  patch: async <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body }),

  /**
   * DELETE request
   */
  delete: async <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
