/**
 * Galeri Service - API calls for gallery/photos
 */

import { apiClient } from './client';
import { SingleResponse } from './types';

export interface GalleryImageMetadata {
  url: string;
  width: number;
  height: number;
  format: string;
}

export interface GalleryImage {
  id_galeri: number;
  id_destinasi: number;
  url_foto_cdn: string;
  caption: string | null;
  urutan: number;
  alt_text: string | null;
  tipe_media: 'foto' | 'video';
  foto_public_id: string;
  foto_metadata: GalleryImageMetadata;
  destinasi: {
    id_destinasi: number;
    nama_destinasi: string;
  } | null;
}

export interface GalleryResponse {
  success: boolean;
  message: string;
  data: GalleryImage[];
}

export function groupGalleriesByDestination(
  photos: GalleryImage[]
): Map<string, GalleryImage[]> {
  const grouped = new Map<string, GalleryImage[]>();

  photos.forEach((photo) => {
    // Use destination name if caption is null or empty
    let category: string;
    
    if (photo.caption && photo.caption.trim().length > 0) {
      // Extract category from caption by removing "- Foto X" suffix
      // e.g., "Pura Tirtha Harum - Foto 8" -> "Pura Tirtha Harum"
      category = photo.caption.replace(/ - Foto \d+$/, '').trim();
    } else if (photo.destinasi && photo.destinasi.nama_destinasi) {
      // Fallback to destination name if caption is empty
      category = photo.destinasi.nama_destinasi;
    } else {
      // Final fallback
      category = 'Galeri Lainnya';
    }
    
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)?.push(photo);
  });

  return grouped;
}

export const galeriService = {
  /**
   * Get all gallery images (with optional limit and destination filter)
   */
  getAll: async (limit?: number, id_destinasi?: number): Promise<GalleryResponse> => {
    const params: Record<string, unknown> = limit ? { limit } : { limit: 100 };
    if (id_destinasi) {
      params.id_destinasi = id_destinasi;
    }
    const response = await apiClient.get<GalleryImage[]>('/galeri', params);
    return response as GalleryResponse;
  },

  /**
   * Get limited gallery images (for home preview - first 10)
   */
  getByLimit: async (limitCount: number): Promise<GalleryImage[]> => {
    const response = await galeriService.getAll(100);
    return response.data.slice(0, limitCount);
  },
};
