/**
 * Ulasan Service - API calls for reviews
 */

import { apiClient, ApiListParams } from './client';
import {
  UlasanResponse,
  ListResponse,
  SingleResponse,
} from './types';

export const ulasanService = {
  /**
   * Get all reviews with optional filters
   */
  list: async (params?: ApiListParams & { rating_bintang?: number; is_published?: boolean }) => {
    const response = await apiClient.get<UlasanResponse[]>('/ulasan', params);
    return response as ListResponse<UlasanResponse>;
  },

  /**
   * Get review by ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<UlasanResponse>(`/ulasan/${id}`);
    return response as SingleResponse<UlasanResponse>;
  },

  /**
   * Get review for a specific reservation
   */
  getByReservasiId: async (id_reservasi: number) => {
    const response = await apiClient.get<UlasanResponse>(`/ulasan/reservasi/${id_reservasi}`);
    return response as SingleResponse<UlasanResponse>;
  },

  /**
   * Create a review (public)
   */
  create: async (data: {
    id_reservasi: number;
    rating_bintang: number;
    komentar?: string;
  }) => {
    const response = await apiClient.post<UlasanResponse>('/ulasan', data);
    return response as SingleResponse<UlasanResponse>;
  },

  /**
   * Update a review (public)
   */
  update: async (
    id: number,
    data: {
      rating_bintang?: number;
      komentar?: string;
    }
  ) => {
    const response = await apiClient.put<UlasanResponse>(`/ulasan/${id}`, data);
    return response as SingleResponse<UlasanResponse>;
  },
};
