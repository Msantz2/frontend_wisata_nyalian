/**
 * Destinasi Service - API calls for destinations
 */

import { apiClient, ApiListParams, ApiError } from './client';
import {
  DestinasiResponse,
  GaleriResponse,
  ListResponse,
  SingleResponse,
  KategoriDestinasiResponse,
} from './types';

export interface CreateDestinasiPayload {
  id_kategori: number;
  nama_destinasi: string;
  deskripsi?: string;
  deskripsi_pendek?: string;
  alamat?: string;
  lokasi_maps?: string;
  jam_operasional?: string;
  jam_buka?: string;
  jam_tutup?: string;
  fasilitas?: string;
  latitude?: number | string;
  longitude?: number | string;
  harga_tiket?: string | number;
  harga_tiket_dewasa?: number;
  harga_tiket_anak?: number;
  featured?: boolean;
  is_active?: boolean;
  desa?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  gambar?: File;
}

export interface UpdateDestinasiPayload extends Partial<CreateDestinasiPayload> {
  id_destinasi?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      const [name, value] = trimmed.split('=');
      if (name === 'auth_token' && value) {
        return decodeURIComponent(value);
      }
    }
  } catch (error) {
    console.error('[Auth] Error parsing cookies:', error);
  }

  if (typeof window !== 'undefined') {
    const localToken = 
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth-token');
    
    if (localToken) return localToken;
  }

  return null;
}

async function uploadWithFormData<T>(
  endpoint: string,
  payload: CreateDestinasiPayload | UpdateDestinasiPayload,
  method: 'POST' | 'PUT' = 'POST'
): Promise<SingleResponse<T>> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    method,
    body: formData,
    credentials: 'include',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || `HTTP ${response.status}`,
        data.errors
      );
    }

    return data as SingleResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[API Network Error]', { endpoint, method, error: errorMessage, url });
    throw new ApiError(0, errorMessage);
  }
}

export const destinasiService = {
  /**
   * Get all destinations with optional filters
   */
  list: async (params?: ApiListParams & { id_kategori?: number; featured?: boolean; is_active?: boolean; search?: string }) => {
    try {
      const response = await apiClient.get<DestinasiResponse[]>('/destinasi', params);
      return response as ListResponse<DestinasiResponse>;
    } catch (error) {
      console.error('[Destinasi] Error fetching destinations:', error);
      throw error;
    }
  },

  /**
   * Get destination by ID
   */
  getById: async (id: number) => {
    try {
      const response = await apiClient.get<DestinasiResponse>(`/destinasi/${id}`);
      return response as SingleResponse<DestinasiResponse>;
    } catch (error) {
      console.error(`[Destinasi] Error fetching destination ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get destination gallery/photos
   */
  getGallery: async (id: number) => {
    try {
      const response = await apiClient.get<GaleriResponse[]>(`/destinasi/${id}/galeri`);
      return response as SingleResponse<GaleriResponse[]>;
    } catch (error) {
      console.error(`[Destinasi] Error fetching gallery for ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new destination
   */
  create: async (payload: CreateDestinasiPayload) => {
    try {
      console.log('[Destinasi] Creating new destination:', payload);
      const response = await uploadWithFormData<DestinasiResponse>(
        '/destinasi',
        payload,
        'POST'
      );
      console.log('[Destinasi] ✅ Created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('[Destinasi] ❌ Error creating destination:', error);
      throw error;
    }
  },

  /**
   * Update destination
   */
  update: async (id: number, payload: UpdateDestinasiPayload) => {
    try {
      console.log('[Destinasi] Updating destination:', id, payload);
      const response = await uploadWithFormData<DestinasiResponse>(
        `/destinasi/${id}`,
        payload,
        'PUT'
      );
      console.log('[Destinasi] ✅ Updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`[Destinasi] Error updating destination ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete destination (soft delete)
   */
  delete: async (id: number) => {
    try {
      console.log('[Destinasi] Deleting destination:', id);
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/destinasi/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete destination');
      }

      console.log('[Destinasi] ✅ Deleted successfully');
      return response;
    } catch (error) {
      console.error(`[Destinasi] Error deleting destination ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all destination categories
   */
  getCategories: async () => {
    try {
      const response = await apiClient.get<KategoriDestinasiResponse[]>('/kategori-destinasi');
      return response as ListResponse<KategoriDestinasiResponse>;
    } catch (error) {
      console.error('[Destinasi] Error fetching categories:', error);
      throw error;
    }
  },
};
