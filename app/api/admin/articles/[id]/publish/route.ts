// Articles publish action route
// Per 20-api-articles.md Section 8 (Publish)
// Per 15-article-publishing.md Section 4 (Publishing workflow)
// Per 19-api-overview.md Section 8 (Authentication)

import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/api/auth';
import { apiSuccess, handleServiceError } from '@/lib/api/response';
import * as articlesService from '@/lib/modules/articles/service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/admin/articles/[id]/publish
 * Publish an article (transition draft → published)
 * Per 20-api-articles.md Section 8
 * Per 15-article-publishing.md Section 4.2: Sets publishedAt on first publish, preserves on republish
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify session per 19-api-overview.md Section 8
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const { id } = await params;

    // No request body required per 20-api-articles.md Section 8
    // Publish article via service per 02-admin-architecture.md Section 5.2
    const article = await articlesService.publishArticle(id);

    // Per 15-article-publishing.md Section 6: Trigger revalidation of affected public routes
    // Revalidate article list and detail page
    revalidatePath('/articles', 'page');
    revalidatePath(`/articles/${article.slug}`, 'page');

    // Per 20-api-articles.md Section 8: Return 200 OK with updated record
    return apiSuccess(article, 200);
  } catch (error) {
    return handleServiceError(error);
  }
}
