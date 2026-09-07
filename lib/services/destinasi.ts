/**
 * Destinasi Service - Server-side data fetching with API fallback
 */

import { destinasiService, DestinasiResponse } from '@/lib/api';
import type { Destination } from '@/types/destination';
import { isValidImageUrl } from '@/lib/placeholderImage';

/**
 * Convert API response to frontend Destination type
 */
function convertApiToDestination(apiData: DestinasiResponse): Destination {
  const parseOperatingHours = (jamOperasional?: string, jamBuka?: string, jamTutup?: string) => {
    if (jamBuka && jamTutup) {
      return { open: jamBuka, close: jamTutup };
    }
    if (jamOperasional && jamOperasional.includes('-')) {
      const [open, close] = jamOperasional.split('-');
      return { open: open.trim() || '08:00', close: close.trim() || '17:00' };
    }
    return { open: '08:00', close: '17:00' };
  };

  return {
    id: String(apiData.id_destinasi),
    slug: apiData.slug,
    name: apiData.nama_destinasi,
    category: apiData.desa,
    shortDescription: apiData.deskripsi_pendek || apiData.deskripsi || '',
    description: apiData.deskripsi || '',
    location: {
      village: apiData.desa,
      district: apiData.kecamatan,
      regency: apiData.kabupaten,
      province: apiData.provinsi,
      address: apiData.alamat || '',
      latitude: parseFloat(apiData.latitude) || 0,
      longitude: parseFloat(apiData.longitude) || 0,
    },
    images: [],
    videos: [],
    facilities: apiData.fasilitas ? apiData.fasilitas.split(',').map(f => f.trim()) : [],
    operatingHours: parseOperatingHours(apiData.jam_operasional, apiData.jam_buka, apiData.jam_tutup),
    ticketPrice: {
      adult: apiData.harga_tiket_dewasa || apiData.harga_tiket || 0,
      child: apiData.harga_tiket_anak || 0,
    },
    rating: 0,
    totalReviews: 0,
    featured: apiData.featured,
    thumbnailUrl: apiData.url_gambar_cdn || null,
    fullImageUrl: apiData.url_gambar_cdn || null,
    imageMetadata: apiData.gambar_metadata || {},
    apiId: apiData.id_destinasi,
  };
}

/**
 * Get all destinations from API
 */
export async function getDestinationsServer(): Promise<Destination[]> {
  try {
    const response = await destinasiService.list({ limit: 100 });
    if (response.success && response.data) {
      return response.data.map(convertApiToDestination);
    }
  } catch (error) {
    console.error('Failed to fetch destinations from API:', error);
    return [];
  }
  
  return [];
}

/**
 * Get destination by ID from API
 */
export async function getDestinationByIdServer(id: string | number): Promise<Destination | undefined> {
  try {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId)) return undefined;
    
    const response = await destinasiService.getById(numId);
    if (response.success && response.data) {
      const destination = convertApiToDestination(response.data);
      return destination;
    }
  } catch (error) {
    console.error(`Failed to fetch destination ${id} from API:`, error);
  }
  
  return undefined;
}

/**
 * Get featured destinations from API
 */
export async function getFeaturedDestinationsServer(): Promise<Destination[]> {
  try {
    const response = await destinasiService.list({ featured: true, limit: 100 });
    if (response.success && response.data) {
      return response.data.map(convertApiToDestination);
    }
  } catch (error) {
    console.error('Failed to fetch featured destinations from API:', error);
  }
  
  return [];
}

/**
 * Get destination by slug from API
 */
export async function getDestinationBySlugServer(slug: string): Promise<Destination | undefined> {
  try {
    const response = await destinasiService.list({ limit: 100 });
    if (response.success && response.data) {
      const destination = response.data.find(d => d.slug === slug);
      if (destination) {
         const converted = convertApiToDestination(destination);
         return converted;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch destination by slug ${slug} from API:`, error);
  }
  
  return undefined;
}
