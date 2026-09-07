/**
 * FAQ Service - API calls for FAQs
 * Handles data type conversion to match backend expectations
 */

import { apiClient, ApiListParams } from './client';
import type { FAQ, CreateFAQPayload, UpdateFAQPayload, FAQResponse, FAQListResponse } from '@/types/faq';

export const faqService = {
  /**
   * Get all FAQs with optional filters
   */
  list: async (params?: ApiListParams & { kategori?: string; featured?: boolean; is_active?: boolean }) => {
    try {
      const response = await apiClient.get<FAQ[]>('/faq', {
        limit: 100,
        ...params,
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch FAQs');
      }
      
      return response as FAQListResponse;
    } catch (error) {
      console.error('[FAQ] Error fetching FAQs:', error);
      throw error;
    }
  },

  /**
   * Get FAQ by ID
   */
  getById: async (id: number) => {
    try {
      const response = await apiClient.get<FAQ>(`/faq/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch FAQ');
      }
      
      return response as FAQResponse;
    } catch (error) {
      console.error(`[FAQ] Error fetching FAQ ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new FAQ
   * Converts data types to match backend expectations
   */
  create: async (payload: CreateFAQPayload) => {
    try {
      console.log('[FAQ] Creating new FAQ:', payload);

      // Ensure correct data types matching backend expectations
      const faqData = {
        pertanyaan: String(payload.pertanyaan).trim(),
        jawaban: String(payload.jawaban).trim(),
        kategori: payload.kategori 
          ? String(payload.kategori).trim() 
          : 'Umum', // Default value if not provided
        urutan: payload.urutan 
          ? Number(payload.urutan) 
          : 0, // Convert to number, default 0
        featured: Boolean(payload.featured) // Convert to boolean
      };

      console.log('[FAQ] Sending to backend:', {
        ...faqData,
        urutan_type: typeof faqData.urutan,
        featured_type: typeof faqData.featured
      });

      const response = await apiClient.post<FAQ>('/faq', faqData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create FAQ');
      }

      console.log('[FAQ] ✅ Created successfully:', response.data);
      return response as FAQResponse;
    } catch (error) {
      console.error('[FAQ] ❌ Error creating FAQ:', error);
      throw error;
    }
  },

  /**
   * Update FAQ
   * Converts data types and only sends provided fields
   */
  update: async (id: number, payload: UpdateFAQPayload) => {
    try {
      console.log('[FAQ] Updating FAQ:', id, payload);

      // Build update object with only provided fields
      const faqData: Record<string, string | number | boolean> = {};

      if (payload.pertanyaan !== undefined) {
        faqData.pertanyaan = String(payload.pertanyaan).trim();
      }
      if (payload.jawaban !== undefined) {
        faqData.jawaban = String(payload.jawaban).trim();
      }
      if (payload.kategori !== undefined) {
        faqData.kategori = String(payload.kategori).trim();
      }
      if (payload.urutan !== undefined) {
        faqData.urutan = Number(payload.urutan);
      }
      if (payload.featured !== undefined) {
        faqData.featured = Boolean(payload.featured);
      }
      if (payload.is_active !== undefined) {
        faqData.is_active = Boolean(payload.is_active);
      }

      console.log('[FAQ] Sending update to backend:', faqData);

      const response = await apiClient.put<FAQ>(`/faq/${id}`, faqData);

      if (!response.success) {
        throw new Error(response.message || 'Failed to update FAQ');
      }

      console.log('[FAQ] ✅ Updated successfully:', response.data);
      return response as FAQResponse;
    } catch (error) {
      console.error(`[FAQ] Error updating FAQ ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete FAQ (soft delete)
   */
  delete: async (id: number) => {
    try {
      console.log('[FAQ] Deleting FAQ:', id);
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/faq/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete FAQ');
      }

      console.log('[FAQ] ✅ Deleted successfully');
      return response;
    } catch (error) {
      console.error(`[FAQ] Error deleting FAQ ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get FAQs by category
   */
  getByCategory: async (kategori: string, params?: ApiListParams) => {
    try {
      const response = await apiClient.get<FAQ[]>('/faq', {
        ...params,
        kategori,
        limit: 100,
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch FAQs');
      }
      
      return response as FAQListResponse;
    } catch (error) {
      console.error(`[FAQ] Error fetching FAQs for category ${kategori}:`, error);
      throw error;
    }
  },

  /**
   * Get featured FAQs
   */
  getFeatured: async (params?: ApiListParams) => {
    try {
      const response = await apiClient.get<FAQ[]>('/faq', {
        ...params,
        featured: true,
        limit: 100,
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch featured FAQs');
      }
      
      return response as FAQListResponse;
    } catch (error) {
      console.error('[FAQ] Error fetching featured FAQs:', error);
      throw error;
    }
  },
};
