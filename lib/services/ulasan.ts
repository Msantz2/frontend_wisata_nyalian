/**
 * Ulasan Service - Server-side data fetching with API fallback
 */

import { ulasanService, UlasanResponse } from '@/lib/api';
import type { Review } from '@/types/review';

/**
 * Convert API response to frontend Review type
 */
function convertApiToReview(apiData: UlasanResponse): Review {
  return {
    id: String(apiData.id_ulasan),
    visitorName: 'Visitor', // API doesn't provide visitor name in review
    visitorCountry: '', // API doesn't provide country
    avatar: '', // API doesn't provide avatar
    rating: apiData.rating_bintang,
    comment: apiData.komentar,
    visitDate: apiData.tanggal_ulasan,
  };
}

/**
 * Get all published reviews from API
 */
export async function getReviewsServer(): Promise<Review[]> {
  try {
    const response = await ulasanService.list({ 
      limit: 100,
      is_published: true,
    });
    if (response.success && response.data) {
      return response.data
        .map(convertApiToReview)
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
    }
  } catch (error) {
    console.error('Failed to fetch reviews from API:', error);
  }
  
  return [];
}

/**
 * Get review by ID from API
 */
export async function getReviewByIdServer(id: string | number): Promise<Review | undefined> {
  try {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId)) return undefined;
    
    const response = await ulasanService.getById(numId);
    if (response.success && response.data) {
      return convertApiToReview(response.data);
    }
  } catch (error) {
    console.error(`Failed to fetch review ${id} from API:`, error);
  }

  return undefined;
}

/**
 * Get reviews for a specific reservation from API
 */
export async function getReviewByReservasiIdServer(id_reservasi: number): Promise<Review | undefined> {
  try {
    const response = await ulasanService.getByReservasiId(id_reservasi);
    if (response.success && response.data) {
      return convertApiToReview(response.data);
    }
  } catch (error) {
    console.error(`Failed to fetch review for reservation ${id_reservasi} from API:`, error);
  }

  return undefined;
}

/**
 * Get high-rated reviews (4+ stars) from API
 */
export async function getHighRatedReviewsServer(): Promise<Review[]> {
  try {
    const response = await ulasanService.list({ 
      limit: 100,
      is_published: true,
    });
    if (response.success && response.data) {
      return response.data
        .filter(r => r.rating_bintang >= 4)
        .map(convertApiToReview)
        .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
    }
  } catch (error) {
    console.error('Failed to fetch high-rated reviews from API:', error);
  }

  return [];
}
