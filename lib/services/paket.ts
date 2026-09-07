/**
 * Paket Service - Server-side data fetching with API fallback
 */

import { paketService, PaketWisataResponse } from '@/lib/api';
import type { TourPackage } from '@/types/package';

/**
 * Parse itinerary string timeline format to array of objects
 * Format: "07:00\nActivity 1\n\n07:10\nActivity 2"
 */
function parseItineraryString(itineraryData: any): any[] {
  if (!itineraryData) {
    return [];
  }

  // If already array of objects with time/activity, return as-is
  if (Array.isArray(itineraryData)) {
    if (itineraryData.length > 0 && typeof itineraryData[0] === 'object' && ('time' in itineraryData[0] || 'day' in itineraryData[0])) {
      return itineraryData.map((item: any) => ({
        time: item.time || '',
        activity: item.activity || ''
      }));
    }

    // If array of strings/objects, parse each
    return itineraryData.flatMap((item: any) => {
      if (typeof item === 'object' && item !== null) {
        if (item.description) {
          return parseTimelineFromDescription(item.description);
        }
        if (item.time && item.activity) {
          return [{ time: item.time, activity: item.activity }];
        }
      }
      return [];
    });
  }

  // If string, parse as timeline
  if (typeof itineraryData === 'string') {
    return parseTimelineFromDescription(itineraryData);
  }

  return [];
}

/**
 * Parse timeline string format: "07:00\nActivity\n\n07:10\nActivity"
 */
function parseTimelineFromDescription(description: string): any[] {
  if (!description || typeof description !== 'string') {
    return [];
  }

  try {
    const lines = description.split('\n').filter(line => line.trim());
    const activities: any[] = [];

    for (let i = 0; i < lines.length; i += 2) {
      const time = lines[i]?.trim() || '';
      const activity = lines[i + 1]?.trim() || '';

      if (time && activity) {
        activities.push({
          time,
          activity
        });
      }
    }

    return activities;
  } catch (error) {
    console.error('Error parsing itinerary string:', error);
    return [];
  }
}

/**
 * Convert API response to frontend TourPackage type
 */
function convertApiToPackage(apiData: PaketWisataResponse): TourPackage {
  return {
    id: String(apiData.id_paket),
    name: apiData.nama_paket,
    slug: apiData.slug || '',
    category: apiData.kategori_paket?.nama_kategori || '',
    shortDescription: apiData.deskripsi_pendek || '',
    description: apiData.deskripsi_paket,
    gallery: [],
    price: apiData.harga_per_pax,
    duration: apiData.durasi || `${apiData.durasi_hari || 1} Day(s)`,
    capacity: `${apiData.kapasitas_min || 1}-${apiData.kapasitas_max || 'Unlimited'}`,
    destinations: [],
    highlights: Array.isArray(apiData.highlights) ? apiData.highlights : [],
    included: Array.isArray(apiData.included) ? apiData.included : [],
    excluded: Array.isArray(apiData.excluded) ? apiData.excluded : [],
    itinerary: parseItineraryString(apiData.itinerary),
    featured: apiData.featured || false,
    rating: 0,
    thumbnailUrl: apiData.url_gambar_cdn || null,
    fullImageUrl: apiData.url_gambar_cdn || null,
  };
}

/**
 * Get all packages from API
 */
export async function getPackagesServer(): Promise<TourPackage[]> {
  try {
    const response = await paketService.list({ limit: 100 });
    if (response.success && response.data) {
      return response.data.map(convertApiToPackage);
    }
  } catch (error) {
    console.error('Failed to fetch packages from API:', error);
  }
  
  return [];
}

/**
 * Get package by ID from API
 */
export async function getPackageByIdServer(id: string | number): Promise<TourPackage | undefined> {
  try {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId)) return undefined;
    
    const response = await paketService.getById(numId);
      if (response.success && response.data) {
        const pkg = convertApiToPackage(response.data);
        
        // Fetch destination list
        try {
          const destinasiResponse = await paketService.getDestinasi(numId);
          if (destinasiResponse.success && destinasiResponse.data) {
            pkg.destinations = destinasiResponse.data
              .sort((a, b) => a.urutan - b.urutan)
              .map(pd => String(pd.id_destinasi));
          }
        } catch (destError) {
          console.error(`Failed to fetch destinations for package ${id}:`, destError);
        }
        
        return pkg;
      }
  } catch (error) {
    console.error(`Failed to fetch package ${id} from API:`, error);
  }
  
  return undefined;
}

/**
 * Get featured packages from API
 */
export async function getFeaturedPackagesServer(): Promise<TourPackage[]> {
  try {
    const response = await paketService.list({ featured: true, limit: 100 });
    if (response.success && response.data) {
      return response.data.map(convertApiToPackage);
    }
  } catch (error) {
    console.error('Failed to fetch featured packages from API:', error);
  }
  
  return [];
}

/**
 * Get package by slug from API
 */
export async function getPackageBySlugServer(slug: string): Promise<TourPackage | undefined> {
  try {
    const response = await paketService.list({ limit: 100 });
    if (response.success && response.data) {
      const pkg = response.data.find(p => p.slug === slug);
      if (pkg) {
        const converted = convertApiToPackage(pkg);
        
        // Fetch destination list
        try {
          const destinasiResponse = await paketService.getDestinasi(pkg.id_paket);
          if (destinasiResponse.success && destinasiResponse.data) {
            converted.destinations = destinasiResponse.data
              .sort((a, b) => a.urutan - b.urutan)
              .map(pd => String(pd.id_destinasi));
          }
        } catch (destError) {
          console.error(`Failed to fetch destinations for package slug ${slug}:`, destError);
        }
        
        return converted;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch package by slug ${slug} from API:`, error);
  }
  
  return undefined;
}
