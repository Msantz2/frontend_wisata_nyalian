/**
 * Paket Wisata Service - API calls for tour packages
 * Extended with CRUD operations for admin panel
 */

import { apiClient, ApiListParams } from './client';
import {
  PaketWisataResponse,
  GaleriResponse,
  KuotaResponse,
  PaketDestinasiResponse,
  ListResponse,
  SingleResponse,
} from './types';

// ============================================================================
// PAYLOAD INTERFACES
// ============================================================================

export interface CreatePaketWisataPayload {
  // Basic info
  nama_paket: string;              // Required, min 3, max 100
  id_kategori: number;             // Required, FK to kategori_paket
  deskripsi_paket?: string;        // Optional, full description
  deskripsi_pendek?: string;       // Optional, short description
  
  // Pricing & capacity
  harga_per_pax: number;           // Required, >= 0
  kuota_default: number;           // Required, >= 0
  kapasitas_min?: number;          // Optional, default 1
  kapasitas_max?: number;          // Optional
  
  // Duration
  durasi?: string;                 // Optional, e.g., "3 Hari 2 Malam"
  durasi_hari?: number;            // Optional
  durasi_jam?: number;             // Optional
  
  // Content (JSONB arrays)
  highlights?: string[];           // Optional, array of highlights
  included?: string[];             // Optional, what's included
  excluded?: string[];             // Optional, what's excluded
  itinerary?: any[];               // Optional, daily itinerary (flexible JSONB)
  
  // Flags
  featured?: boolean;              // Optional, default false
  is_active?: boolean;             // Optional, default true
  
  // Image (will be sent as FormData)
  gambar?: File;                   // Optional, image file for Cloudinary
}

export interface UpdatePaketWisataPayload extends Partial<CreatePaketWisataPayload> {}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Get auth token from cookie or localStorage
 * Pattern reference: lib/api/destinasi.ts
 */
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

/**
 * Upload with FormData for image handling
 * Pattern reference: lib/api/destinasi.ts uploadWithFormData()
 */
async function uploadWithFormData(
  endpoint: string,
  payload: CreatePaketWisataPayload | UpdatePaketWisataPayload,
  method: 'POST' | 'PUT' = 'POST'
): Promise<SingleResponse<PaketWisataResponse>> {
  const formData = new FormData();

  console.log('[PaketWisata] Payload before FormData:', payload);

  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
      console.log(`[PaketWisata] FormData append File: ${key}`, value.name);
    } else if (Array.isArray(value)) {
      // Backend expects JSONB arrays - send as JSON string
      formData.append(key, JSON.stringify(value));
      console.log(`[PaketWisata] FormData append Array: ${key}`, JSON.stringify(value));
    } else if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
      console.log(`[PaketWisata] FormData append: ${key} = ${value}`);
    }
  });

  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  console.log('[PaketWisata] Request URL:', url);
  console.log('[PaketWisata] Auth token present:', !!token);

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
      console.error('[PaketWisata] Backend error response:', data);
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data as SingleResponse<PaketWisataResponse>;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[PaketWisata] Network Error:', { endpoint, method, error: errorMessage });
    throw error;
  }
}

// ============================================================================
// SERVICE OBJECT
// ============================================================================


export const paketService = {
  /**
   * Get all packages with optional filters
   */
  list: async (params?: ApiListParams & { id_kategori?: number; featured?: boolean }) => {
    const response = await apiClient.get<PaketWisataResponse[]>('/paket-wisata', params);
    return response as ListResponse<PaketWisataResponse>;
  },

  /**
   * Get package by ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<PaketWisataResponse>(`/paket-wisata/${id}`);
    return response as SingleResponse<PaketWisataResponse>;
  },

  /**
   * Get package gallery/photos
   */
  getGallery: async (id: number) => {
    const response = await apiClient.get<GaleriResponse[]>(`/paket-wisata/${id}/galeri`);
    return response as SingleResponse<GaleriResponse[]>;
  },

  /**
   * Get package quota availability for date range
   */
  getKuota: async (id: number, params?: { from_date?: string; to_date?: string }) => {
    const response = await apiClient.get<KuotaResponse[]>(`/paket-wisata/${id}/kuota`, params);
    return response as SingleResponse<KuotaResponse[]>;
  },

  /**
   * Get all destinations in a package (sorted by order)
   */
  getDestinasi: async (id: number) => {
    const response = await apiClient.get<PaketDestinasiResponse[]>(
      `/paket-destinasi/paket/${id}`
    );
    return response as SingleResponse<PaketDestinasiResponse[]>;
  },

  /**
   * Create new tour package with optional image upload
   * ADMIN only - requires auth token
   */
  create: async (payload: CreatePaketWisataPayload): Promise<SingleResponse<PaketWisataResponse>> => {
    try {
      console.log('[PaketWisata] Creating new package:', payload);

      // If image file is provided, use FormData
      if (payload.gambar instanceof File) {
        return await uploadWithFormData('/paket-wisata', payload, 'POST');
      }

      // Otherwise, use JSON
      const packageData: Record<string, any> = {
        nama_paket: String(payload.nama_paket).trim(),
        id_kategori: Number(payload.id_kategori),
        harga_per_pax: Number(payload.harga_per_pax),
        kuota_default: Number(payload.kuota_default),
      };

      // Optional fields
      if (payload.deskripsi_paket !== undefined) {
        packageData.deskripsi_paket = String(payload.deskripsi_paket).trim();
      }
      if (payload.deskripsi_pendek !== undefined) {
        packageData.deskripsi_pendek = String(payload.deskripsi_pendek).trim();
      }
      if (payload.durasi !== undefined) {
        packageData.durasi = String(payload.durasi).trim();
      }
      if (payload.durasi_hari !== undefined) {
        packageData.durasi_hari = Number(payload.durasi_hari);
      }
      if (payload.durasi_jam !== undefined) {
        packageData.durasi_jam = Number(payload.durasi_jam);
      }
      if (payload.kapasitas_min !== undefined) {
        packageData.kapasitas_min = Number(payload.kapasitas_min);
      }
      if (payload.kapasitas_max !== undefined) {
        packageData.kapasitas_max = Number(payload.kapasitas_max);
      }
      if (payload.highlights !== undefined) {
        packageData.highlights = payload.highlights;
      }
      if (payload.included !== undefined) {
        packageData.included = payload.included;
      }
      if (payload.excluded !== undefined) {
        packageData.excluded = payload.excluded;
      }
      if (payload.itinerary !== undefined) {
        packageData.itinerary = payload.itinerary;
      }
      if (payload.featured !== undefined) {
        packageData.featured = Boolean(payload.featured);
      }
      if (payload.is_active !== undefined) {
        packageData.is_active = Boolean(payload.is_active);
      }

      const response = await apiClient.post<PaketWisataResponse>('/paket-wisata', packageData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create paket wisata');
      }

      console.log('[PaketWisata] ✅ Created successfully:', response.data);
      return response as SingleResponse<PaketWisataResponse>;
    } catch (error) {
      console.error('[PaketWisata] ❌ Error creating package:', error);
      throw error;
    }
  },

  /**
   * Update existing tour package with optional image upload
   * ADMIN only - requires auth token
   * If new image provided, backend auto-deletes old image from Cloudinary
   */
  update: async (id: number, payload: UpdatePaketWisataPayload): Promise<SingleResponse<PaketWisataResponse>> => {
    try {
      console.log('[PaketWisata] Updating package:', id, payload);

      // If image file is provided, use FormData
      if (payload.gambar instanceof File) {
        return await uploadWithFormData(`/paket-wisata/${id}`, payload, 'PUT');
      }

      // Otherwise, use JSON with only provided fields
      const packageData: Record<string, any> = {};

      if (payload.nama_paket !== undefined) {
        packageData.nama_paket = String(payload.nama_paket).trim();
      }
      if (payload.id_kategori !== undefined) {
        packageData.id_kategori = Number(payload.id_kategori);
      }
      if (payload.deskripsi_paket !== undefined) {
        packageData.deskripsi_paket = String(payload.deskripsi_paket).trim();
      }
      if (payload.deskripsi_pendek !== undefined) {
        packageData.deskripsi_pendek = String(payload.deskripsi_pendek).trim();
      }
      if (payload.harga_per_pax !== undefined) {
        packageData.harga_per_pax = Number(payload.harga_per_pax);
      }
      if (payload.kuota_default !== undefined) {
        packageData.kuota_default = Number(payload.kuota_default);
      }
      if (payload.durasi !== undefined) {
        packageData.durasi = String(payload.durasi).trim();
      }
      if (payload.durasi_hari !== undefined) {
        packageData.durasi_hari = Number(payload.durasi_hari);
      }
      if (payload.durasi_jam !== undefined) {
        packageData.durasi_jam = Number(payload.durasi_jam);
      }
      if (payload.kapasitas_min !== undefined) {
        packageData.kapasitas_min = Number(payload.kapasitas_min);
      }
      if (payload.kapasitas_max !== undefined) {
        packageData.kapasitas_max = Number(payload.kapasitas_max);
      }
      if (payload.highlights !== undefined) {
        packageData.highlights = payload.highlights;
      }
      if (payload.included !== undefined) {
        packageData.included = payload.included;
      }
      if (payload.excluded !== undefined) {
        packageData.excluded = payload.excluded;
      }
      if (payload.itinerary !== undefined) {
        packageData.itinerary = payload.itinerary;
      }
      if (payload.featured !== undefined) {
        packageData.featured = Boolean(payload.featured);
      }
      if (payload.is_active !== undefined) {
        packageData.is_active = Boolean(payload.is_active);
      }

      const response = await apiClient.put<PaketWisataResponse>(`/paket-wisata/${id}`, packageData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update paket wisata');
      }

      console.log('[PaketWisata] ✅ Updated successfully:', response.data);
      return response as SingleResponse<PaketWisataResponse>;
    } catch (error) {
      console.error(`[PaketWisata] Error updating package ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete tour package (soft delete)
   * ADMIN only - requires auth token
   * Backend also deletes image from Cloudinary
   */
  delete: async (id: number): Promise<SingleResponse<{ success: boolean; message: string }>> => {
    try {
      console.log('[PaketWisata] Deleting package:', id);
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/paket-wisata/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete paket wisata');
      }

      console.log('[PaketWisata] ✅ Deleted successfully');
      return response;
    } catch (error) {
      console.error(`[PaketWisata] Error deleting package ${id}:`, error);
      throw error;
    }
  },
};

