/**
 * FAQ Service - Server-side data fetching with API fallback
 * Handles fetching FAQs from API with graceful fallback to static data
 */

import { faqService } from '@/lib/api/faq';
import type { FAQ } from '@/types/faq';

/**
 * Get all FAQs from API
 */
export async function getFAQsServer(): Promise<FAQ[]> {
  try {
    const response = await faqService.list({ limit: 100, is_active: true });
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('Failed to fetch FAQs from API:', error);
  }

  return [];
}

/**
 * Get FAQ by ID from API
 */
export async function getFAQByIdServer(id: string): Promise<FAQ | undefined> {
  try {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return undefined;
    }

    const response = await faqService.getById(numId);
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to fetch FAQ ${id} from API:`, error);
  }

  return undefined;
}

/**
 * Get FAQs by category from API
 */
export async function getFAQsByCategoryServer(category: string): Promise<FAQ[]> {
  try {
    const response = await faqService.getByCategory(category, { limit: 100, is_active: true });
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to fetch FAQs for category ${category} from API:`, error);
  }

  return [];
}

/**
 * Get featured FAQs from API
 */
export async function getFeaturedFAQsServer(): Promise<FAQ[]> {
  try {
    const response = await faqService.getFeatured({ limit: 100, is_active: true });
    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('Failed to fetch featured FAQs from API:', error);
  }

  return [];
}
