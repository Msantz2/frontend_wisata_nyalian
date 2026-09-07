/**
 * Berita Service - Server-side data fetching with API fallback
 */

import { beritaService, BeritaResponse } from '@/lib/api';
import type { Article } from '@/types/article';
import { isValidImageUrl } from '@/lib/placeholderImage';

/**
 * Convert API response to frontend Article type
 */
function convertApiToArticle(apiData: BeritaResponse): Article {
  // Validate cover image URL
  const coverImage = isValidImageUrl(apiData.url_thumbnail_cdn) 
    ? apiData.url_thumbnail_cdn 
    : '';

  return {
    id: String(apiData.id_berita),
    slug: apiData.slug,
    title: apiData.judul_berita,
    excerpt: apiData.excerpt || apiData.deskripsi_pendek || '',
    content: apiData.isi_konten,
    coverImage,
    category: apiData.kategori || 'News',
    author: 'Admin',
    publishedAt: apiData.tanggal_publikasi,
    status: apiData.status as 'draft' | 'published',
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    tags: apiData.tags || [],
    featured: apiData.featured,
    relatedDestinations: apiData.related_destinasi_ids ? apiData.related_destinasi_ids.map(String) : [],
    relatedPackages: apiData.related_paket_ids ? apiData.related_paket_ids.map(String) : [],
  };
}

/**
 * Get all published articles from API
 */
export async function getArticlesServer(): Promise<Article[]> {
  try {
    const response = await beritaService.list({ 
      limit: 100,
      status: 'published',
    });
    if (response.success && response.data) {
      return response.data
        .map(convertApiToArticle)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
  } catch (error) {
    console.error('Failed to fetch articles from API:', error);
  }
  
  return [];
}

/**
 * Get article by ID from API
 */
export async function getArticleByIdServer(id: string | number): Promise<Article | undefined> {
  try {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numId)) return undefined;
    
    const response = await beritaService.getById(numId);
    if (response.success && response.data) {
      return convertApiToArticle(response.data);
    }
  } catch (error) {
    console.error(`Failed to fetch article ${id} from API:`, error);
  }
  
  return undefined;
}

/**
 * Get article by slug from API
 */
export async function getArticleBySlugServer(slug: string): Promise<Article | undefined> {
  try {
    const response = await beritaService.getBySlug(slug);
    if (response.success && response.data) {
      return convertApiToArticle(response.data);
    }
  } catch (error) {
    console.error(`Failed to fetch article with slug ${slug} from API:`, error);
  }

  return undefined;
}

/**
 * Get featured articles from API
 */
export async function getFeaturedArticlesServer(): Promise<Article[]> {
  try {
    const response = await beritaService.list({ 
      featured: true,
      status: 'published',
      limit: 100,
    });
    if (response.success && response.data) {
      return response.data
        .map(convertApiToArticle)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
  } catch (error) {
    console.error('Failed to fetch featured articles from API:', error);
  }
  
  return [];
}
