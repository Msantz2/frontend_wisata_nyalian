/**
 * Kategori Paket Service - API calls for tour package categories
 * Pattern reference: lib/api/faq.ts (simple CRUD, no file upload)
 */

import { apiClient, ApiListParams } from './client';
import {
  KategoriPaketResponse,
  ListResponse,
  SingleResponse,
} from './types';

export interface CreateKategoriPaketPayload {
  nama_kategori: string;        // Required, min 2, max 100, unique
  slug: string;                 // Required, auto-generated or provided
  deskripsi_kategori?: string;  // Optional
  is_active?: boolean;          // Optional, default true
}

export interface UpdateKategoriPaketPayload extends Partial<CreateKategoriPaketPayload> {}

export const kategoriPaketService = {
  /**
   * Get all categories with optional filters
   */
  list: async (params?: ApiListParams & { is_active?: boolean }) => {
    try {
      const response = await apiClient.get<KategoriPaketResponse[]>('/kategori-paket', {
        limit: 100,
        ...params,
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch kategori paket');
      }
      
      return response as ListResponse<KategoriPaketResponse>;
    } catch (error) {
      console.error('[KategoriPaket] Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   */
  getById: async (id: number) => {
    try {
      const response = await apiClient.get<KategoriPaketResponse>(`/kategori-paket/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch kategori paket');
      }
      
      return response as SingleResponse<KategoriPaketResponse>;
    } catch (error) {
      console.error(`[KategoriPaket] Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new category
   * ADMIN only - requires auth token
   */
   create: async (payload: CreateKategoriPaketPayload) => {
     try {
       console.log('[KategoriPaket] Creating new category:', payload);

       // Generate slug from nama_kategori if not provided
       const slug = payload.slug || payload.nama_kategori
         .toLowerCase()
         .trim()
         .replace(/\s+/g, '-')
         .replace(/[^\w-]/g, '');

       // Ensure correct data types
       const categoryData = {
         nama_kategori: String(payload.nama_kategori).trim(),
         slug: slug.trim(),
         deskripsi_kategori: payload.deskripsi_kategori 
           ? String(payload.deskripsi_kategori).trim() 
           : undefined,
         is_active: payload.is_active !== undefined 
           ? Boolean(payload.is_active) 
           : true,
       };

       const response = await apiClient.post<KategoriPaketResponse>('/kategori-paket', categoryData);

       if (!response.success) {
         throw new Error(response.message || 'Failed to create kategori paket');
       }

       console.log('[KategoriPaket] ✅ Created successfully:', response.data);
       return response as SingleResponse<KategoriPaketResponse>;
     } catch (error) {
       console.error('[KategoriPaket] ❌ Error creating category:', error);
       throw error;
     }
   },

  /**
   * Update category
   * ADMIN only - requires auth token
   */
  update: async (id: number, payload: UpdateKategoriPaketPayload) => {
    try {
      console.log('[KategoriPaket] Updating category:', id, payload);

      // Build update object with only provided fields
      const categoryData: Record<string, string | boolean> = {};

      if (payload.nama_kategori !== undefined) {
        categoryData.nama_kategori = String(payload.nama_kategori).trim();
      }
      if (payload.deskripsi_kategori !== undefined) {
        categoryData.deskripsi_kategori = String(payload.deskripsi_kategori).trim();
      }
      if (payload.is_active !== undefined) {
        categoryData.is_active = Boolean(payload.is_active);
      }

      const response = await apiClient.put<KategoriPaketResponse>(`/kategori-paket/${id}`, categoryData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update kategori paket');
      }

      console.log('[KategoriPaket] ✅ Updated successfully:', response.data);
      return response as SingleResponse<KategoriPaketResponse>;
    } catch (error) {
      console.error(`[KategoriPaket] Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete category (soft delete)
   * ADMIN only - requires auth token
   */
  delete: async (id: number) => {
    try {
      console.log('[KategoriPaket] Deleting category:', id);
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/kategori-paket/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete kategori paket');
      }

      console.log('[KategoriPaket] ✅ Deleted successfully');
      return response;
    } catch (error) {
      console.error(`[KategoriPaket] Error deleting category ${id}:`, error);
      throw error;
    }
  },
};
