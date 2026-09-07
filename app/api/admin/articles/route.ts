// Articles API routes: GET (list) and POST (create)
// Per 20-api-articles.md Section 3 (List) and Section 5 (Create)
// Per 19-api-overview.md Section 8 (Authentication)

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { apiSuccess, apiError, formatZodErrors, handleServiceError } from '@/lib/api/response';
import { CreateArticleSchema } from '@/lib/modules/articles/schema';
import * as articlesService from '@/lib/modules/articles/service';

/**
 * GET /api/admin/articles
 * List articles with pagination, search, and sorting
 * Per 20-api-articles.md Section 3
 */
export async function GET(request: NextRequest) {
  try {
    // Verify session per 19-api-overview.md Section 8
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    // Parse query parameters per 19-api-overview.md Section 5
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const search = searchParams.get('search') || '';

    // Get summary items for list view per 20-api-articles.md Section 3
    let items = await articlesService.getArticleSummaries();

    // Apply search filter if provided
    if (search) {
      items = await articlesService.searchArticles(search);
    }

    // Apply pagination
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedItems = items.slice(skip, skip + limit);

    // Per 20-api-articles.md Section 3: Return summary projection (not full content/seo)
    const response = {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };

    return apiSuccess(response, 200);
  } catch (error) {
    console.error('[API] GET /api/admin/articles error:', error);
    return handleServiceError(error);
  }
}

/**
 * POST /api/admin/articles
 * Create a new article
 * Per 20-api-articles.md Section 5
 */
export async function POST(request: NextRequest) {
  try {
    // Verify session per 19-api-overview.md Section 8
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    // Parse request body
    const body = await request.json();

    // Validate input per 19-api-overview.md Section 5 and 17-article-validation.md
    const parseResult = CreateArticleSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = formatZodErrors(parseResult.error);
      return apiError('VALIDATION_ERROR', 'Validation failed', errors, 422);
    }

    // Create article via service per 02-admin-architecture.md Section 5.2
    const article = await articlesService.createArticle(parseResult.data);

    // Per 20-api-articles.md Section 5: Return 201 Created with full record
    return apiSuccess(article, 201);
  } catch (error) {
    return handleServiceError(error);
  }
}
