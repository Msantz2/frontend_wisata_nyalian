/**
 * Gallery Data Normalization Utility
 * Handles various gallery response formats from the backend API
 * and converts them to a consistent array format
 */

export interface GalleryItem {
  id_foto?: number;
  id_galeri?: number;
  id_paket?: number;
  url_foto_cdn: string;
  urutan: number;
  [key: string]: any;
}

/**
 * Normalize gallery response data into a consistent array format
 * Handles multiple response formats:
 * 1. Array format: [{ url_foto_cdn, urutan, ... }, ...]
 * 2. Object with photo IDs as keys: { foto1: {...}, foto2: {...} }
 * 3. Nested data structure: { data: { data: [...] } }
 * 4. Single object wrapped: {...}
 * 5. Undefined/null/empty values
 *
 * @param data - Raw gallery response data
 * @returns Normalized array of gallery items
 */
export function normalizeGalleryData(data: any): GalleryItem[] {
  // Handle null, undefined, or empty values
  if (!data) {
    console.warn('[normalizeGalleryData] Data is null/undefined, returning empty array');
    return [];
  }

  // If already an array, validate and return
  if (Array.isArray(data)) {
    console.log('[normalizeGalleryData] Data is already an array, length:', data.length);
    return validateGalleryArray(data);
  }

  // If it's an object, check for various wrapper patterns
  if (typeof data === 'object') {
    // Check for nested data.data pattern
    if (data.data) {
      if (Array.isArray(data.data)) {
        console.log('[normalizeGalleryData] Found data.data array, length:', data.data.length);
        return validateGalleryArray(data.data);
      }

      // Check for nested data.data.data pattern
      if (data.data.data && Array.isArray(data.data.data)) {
        console.log('[normalizeGalleryData] Found data.data.data array, length:', data.data.data.length);
        return validateGalleryArray(data.data.data);
      }

      // data.data might be an object with photo IDs as keys
      if (typeof data.data === 'object' && !Array.isArray(data.data)) {
        console.log('[normalizeGalleryData] Converting data.data object to array');
        return objectToGalleryArray(data.data);
      }
    }

    // Check if root object has photo IDs as keys (foto1, foto2, etc.)
    if (isPhotoIdKeyObject(data)) {
      console.log('[normalizeGalleryData] Converting photo ID key object to array');
      return objectToGalleryArray(data);
    }

    // Single object that looks like a gallery item
    if (data.url_foto_cdn || data.url_gambar_cdn) {
      console.log('[normalizeGalleryData] Single gallery item detected');
      const normalized = normalizeGalleryItem(data);
      return normalized ? [normalized] : [];
    }
  }

  console.warn('[normalizeGalleryData] Unrecognized data format:', typeof data);
  return [];
}

/**
 * Validate and filter gallery array
 * Removes items with invalid/empty URLs and ensures proper structure
 */
function validateGalleryArray(items: any[]): GalleryItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => normalizeGalleryItem(item))
    .filter((item): item is GalleryItem => item !== null && isValidGalleryUrl(item.url_foto_cdn));
}

/**
 * Convert object with photo ID keys to gallery array
 * e.g., { foto1: {...}, foto2: {...} } => [{...}, {...}]
 */
function objectToGalleryArray(obj: Record<string, any>): GalleryItem[] {
  try {
    const items = Object.values(obj)
      .map((item) => normalizeGalleryItem(item))
      .filter((item): item is GalleryItem => item !== null && isValidGalleryUrl(item.url_foto_cdn));

    console.log('[objectToGalleryArray] Converted object to array, length:', items.length);
    return items;
  } catch (error) {
    console.error('[objectToGalleryArray] Error converting object:', error);
    return [];
  }
}

/**
 * Normalize individual gallery item
 * Handles different field names for URL and order
 */
function normalizeGalleryItem(item: any): GalleryItem | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  try {
    // Get URL from various possible field names
    const url = item.url_foto_cdn || item.url_gambar_cdn || item.url || '';

    // Get order/position from various possible field names
    let urutan = item.urutan ?? item.order ?? item.position ?? 0;
    if (typeof urutan !== 'number') {
      urutan = parseInt(String(urutan), 10) || 0;
    }

    if (!url) {
      console.warn('[normalizeGalleryItem] Item missing URL field:', item);
      return null;
    }

    return {
      id_foto: item.id_foto,
      id_galeri: item.id_galeri,
      id_paket: item.id_paket,
      url_foto_cdn: url,
      urutan,
      ...item, // Preserve all other fields
    };
  } catch (error) {
    console.error('[normalizeGalleryItem] Error normalizing item:', error, item);
    return null;
  }
}

/**
 * Check if object uses photo ID keys (foto1, foto2, etc.)
 */
function isPhotoIdKeyObject(obj: Record<string, any>): boolean {
  const keys = Object.keys(obj);
  if (keys.length === 0) return false;

  // Check if keys look like photo IDs (foto1, foto2, img1, etc.)
  const photoKeyPattern = /^(foto|img|photo|image|galeri)\d+$/i;
  return keys.some((key) => photoKeyPattern.test(key));
}

/**
 * Validate image URL
 * Ensures URL is non-empty and looks like a valid image URL
 */
function isValidGalleryUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmed = url.trim();

  // Check for empty string
  if (trimmed.length === 0) {
    return false;
  }

  // Check for common URL protocols or CDN patterns
  const validUrlPattern = /^(https?:\/\/|\/\/|data:image)/i;
  if (!validUrlPattern.test(trimmed)) {
    console.warn('[isValidGalleryUrl] Invalid URL format:', trimmed);
    return false;
  }

  return true;
}

/**
 * Sort gallery items by order
 */
export function sortGalleryByOrder(items: GalleryItem[]): GalleryItem[] {
  return [...items].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
}
