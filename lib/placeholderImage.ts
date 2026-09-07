/**
 * Image path helper with validation
 * 
 * Safely handles image URLs by validating and filtering out:
 * - Empty strings
 * - Null/undefined values
 * - Whitespace-only values
 * - Invalid URL formats
 * 
 * Returns the path as-is if valid, or empty string for invalid inputs.
 * SafeImage component handles empty strings gracefully by showing placeholder.
 * 
 * Usage:
 *   import { getPlaceholderImage, isValidImageUrl } from '@/lib/placeholderImage';
 *   const imageUrl = getPlaceholderImage('/images/Desa Nyalian_1.webp');
 */

/**
 * Check if an image URL is valid and safe to render
 */
export function isValidImageUrl(
  url: string | null | undefined
): url is string {
  if (!url) return false;
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.length > 0;
}

/**
 * Get image URL with validation
 * Returns the URL if valid, null otherwise
 * Useful for conditional rendering
 */
export function getValidImageUrl(
  relativePath: string | null | undefined
): string | null {
  if (!isValidImageUrl(relativePath)) {
    return null;
  }
  return relativePath.trim();
}

/**
 * Get image path for Next.js Image component
 * Returns validated URL or empty string
 * Safe to pass to SafeImage (handles empty strings)
 */
export function getPlaceholderImage(
  relativePath: string | null | undefined
): string {
  const valid = getValidImageUrl(relativePath);
  return valid || '';
}

/**
 * Get avatar URL using ui-avatars.com for user reviews
 */
export function getPlaceholderAvatar(name: string): string {
  // Generate avatar using ui-avatars.com for user reviews
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2F855A&color=fff&size=128&bold=true`;
}

/**
 * Get YouTube thumbnail URL
 * Returns thumbnail URL or empty string
 * Useful as fallback for video previews
 */
export function getYouTubeThumbnail(youtubeId: string | null | undefined): string {
  if (!youtubeId || typeof youtubeId !== 'string') return '';
  const id = youtubeId.trim();
  if (id.length === 0) return '';
  // Return hqdefault for reliable quality
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
