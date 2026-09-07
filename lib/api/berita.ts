/**
 * Berita Service - API calls for news/articles
 */

import { apiClient, ApiListParams } from './client';
import {
  BeritaResponse,
  ListResponse,
  SingleResponse,
} from './types';

export const beritaService = {
  /**
   * Get all news/articles with optional filters
   */
  list: async (params?: ApiListParams & { featured?: boolean; status?: string }) => {
    const response = await apiClient.get<BeritaResponse[]>('/berita', params);
    return response as ListResponse<BeritaResponse>;
  },

  /**
   * Get news/article by ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<BeritaResponse>(`/berita/${id}`);
    return response as SingleResponse<BeritaResponse>;
  },

  /**
   * Get news/article by slug
   */
  getBySlug: async (slug: string) => {
    // Note: API doesn't provide slug endpoint, so we fetch all and filter
    // In real implementation, consider adding this endpoint to backend
    const response = await apiClient.get<BeritaResponse[]>('/berita', {
      limit: 100,
      status: 'published',
    });
    const item = (response as ListResponse<BeritaResponse>).data.find(
      (article) => article.slug === slug
    );
    if (!item) {
      throw new Error(`Berita dengan slug "${slug}" tidak ditemukan`);
    }
    return { success: true, message: 'Success', data: item } as SingleResponse<BeritaResponse>;
  },
};
