// Articles API routes: GET (single), PUT (update), DELETE
// Per 20-api-articles.md Sections 4, 6, 7
// Per 19-api-overview.md Section 8 (Authentication)

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { apiSuccess, apiError, formatZodErrors, handleServiceError } from '@/lib/api/response';
import { UpdateArticleSchema } from '@/lib/modules/articles/schema';
import * as articlesService from '@/lib/modules/articles/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/articles/[id]
 * Retrieve a single article with full content and SEO
 * Per 20-api-articles.md Section 4
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify session per 19-api-overview.md Section 8
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const { id } = await params;

    // Retrieve article via service
    const article = await articlesService.getArticleById(id);

    // Per 20-api-articles.md Section 4: Return full record including content and seo
    return apiSuccess(article, 200);
  } catch (error) {
    return handleServiceError(error);
  }
}

/**
 * PUT /api/admin/articles/[id]
 * Update an existing article
 * Per 20-api-articles.md Section 6
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify session per 19-api-overview.md Section 8
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const { id } = await params;
    const body = await request.json();

    // Validate input per 19-api-overview.md Section 5 and 17-article-validation.md
    const parseResult = UpdateArticleSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = formatZodErrors(parseResult.error);
      return apiError('VALIDATION_ERROR', 'Validation failed', errors, 422);
    }

    // Update article via service per 02-admin-architecture.md Section 5.2
    // Per 04-storage-strategy.md Section 5: id and createdAt preserved server-side
    const article = await articlesService.updateArticle(id, parseResult.data);

    // Per 20-api-articles.md Section 6: Return 200 OK with updated record
    return apiSuccess(article, 200);
  } catch (error) {
    return handleServiceError(error);
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * Delete an article and its associated images
 * Per 20-api-articles.md Section 7
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify session per 19-api-overview.md Section 8
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const { id } = await params;

    // Delete article via service per 02-admin-architecture.md Section 5.2
    // Per 12-articles.md Section 5.4: Images deleted as part of same operation
    await articlesService.deleteArticle(id);

    // Per 20-api-articles.md Section 7: Return 200 OK with deleted: true
    return apiSuccess({ deleted: true }, 200);
  } catch (error) {
    return handleServiceError(error);
  }
}
