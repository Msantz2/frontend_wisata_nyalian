// Articles service layer - Data access and business logic
// Per 02-admin-architecture.md Section 7.1 (Module Service Layer)
// Implements all CRUD and publishing operations per 12-articles.md and 15-article-publishing.md

import { readJSON, atomicWriteJSON, withWriteLock } from '@/lib/storage';
import {
  DraftArticleSchema,
  PublishArticleSchema,
  type DraftArticle,
  type PublishArticle,
  type FullArticle,
  type ArticleListItem,
} from './schema';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import sanitizeHtml from 'sanitize-html';

/**
 * Service-specific errors for clear error handling
 */
export class ArticleServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ArticleServiceError';
  }
}

export class ArticleNotFoundError extends ArticleServiceError {
  constructor(identifier: string) {
    super(`Article not found: ${identifier}`, 'NOT_FOUND');
  }
}

export class SlugConflictError extends ArticleServiceError {
  constructor(slug: string) {
    super(`Slug already in use: ${slug}`, 'SLUG_CONFLICT');
  }
}

export class ValidationError extends ArticleServiceError {
  constructor(
    message: string,
    public readonly errors: Array<{ field: string; message: string }> = []
  ) {
    super(message, 'VALIDATION_ERROR');
  }
}

/**
 * Content directory path per 04-storage-strategy.md Section 3
 */
const CONTENT_DIR = path.join(process.cwd(), 'content');
const ARTICLES_FILE = path.join(CONTENT_DIR, 'articles.json');

/**
 * Image storage directory per 04-storage-strategy.md Section 4
 */
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

/**
 * Generate a UUID for article IDs
 * Per 04-storage-strategy.md Section 6
 */
function generateId(): string {
  // Use crypto.randomUUID if available (Node.js 15.7+)
  // Fallback to timestamp-based ID for compatibility
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: timestamp-based with random suffix
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize HTML content per 06-security.md Section 6
 * Removes unsafe tags and attributes to prevent XSS
 * Per 17-article-validation.md Section 6
 */
function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'div', 'span'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'div': ['class', 'id'],
      'span': ['class', 'id'],
      '*': ['class', 'id']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard'
  });
}

/**
 * Validate image references in content
 * Per 17-article-validation.md Section 7
 * Ensures all image URLs follow valid article image namespace pattern
 * Detects and prevents invalid image references that would cause 404s
 */
function validateImageReferences(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Match HTML img tags: <img src="..." />
  const imgTagRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  // Match markdown image syntax: ![alt](url)
  const markdownImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  
  let match;
  const validImagePath = /^\/images\/articles\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\/.*\.(webp|jpg|jpeg|png)$/i;
  
  // Check HTML img tags
  while ((match = imgTagRegex.exec(content)) !== null) {
    const src = match[1];
    if (!validImagePath.test(src)) {
      errors.push(`Invalid image URL: ${src}. Must be within /images/articles/{slug}/ namespace`);
    }
  }
  
  // Check markdown image syntax
  while ((match = markdownImgRegex.exec(content)) !== null) {
    const src = match[1];
    if (!validImagePath.test(src)) {
      errors.push(`Invalid image URL in markdown: ${src}. Must be within /images/articles/{slug}/ namespace`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Read all articles from storage
 * Per 04-storage-strategy.md Section 7
 */
async function readAllArticles(): Promise<FullArticle[]> {
  try {
    return await readJSON<FullArticle[]>(ARTICLES_FILE);
  } catch (error) {
    // If file doesn't exist yet, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Write all articles to storage atomically
 * Per 04-storage-strategy.md Section 8 (Atomic Write Pattern)
 */
async function writeAllArticles(articles: FullArticle[]): Promise<void> {
  await atomicWriteJSON<FullArticle[]>(ARTICLES_FILE, articles);
}

/**
 * Find an article by ID
 */
function findArticleById(articles: FullArticle[], id: string): FullArticle | undefined {
  return articles.find((article) => article.id === id);
}

/**
 * Find an article by slug
 */
function findArticleBySlug(articles: FullArticle[], slug: string): FullArticle | undefined {
  return articles.find((article) => article.slug === slug);
}

/**
 * Check if a slug exists (excluding a specific article, for update operations)
 */
function slugExistsExcept(articles: FullArticle[], slug: string, excludeId?: string): boolean {
  return articles.some((article) => article.slug === slug && article.id !== excludeId);
}

/**
 * Get all articles (read operation)
 * Per 20-api-articles.md Section 3
 */
export async function getArticles(): Promise<FullArticle[]> {
  return readAllArticles();
}

/**
 * Get an article by ID (read operation)
 * Per 20-api-articles.md Section 4
 *
 * @throws ArticleNotFoundError if article not found
 */
export async function getArticleById(id: string): Promise<FullArticle> {
  const articles = await readAllArticles();
  const article = findArticleById(articles, id);

  if (!article) {
    throw new ArticleNotFoundError(id);
  }

  return article;
}

/**
 * Get an article by slug (read operation)
 * Per 12-articles.md Section 4 (List View)
 *
 * @throws ArticleNotFoundError if article not found
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle> {
  const articles = await readAllArticles();
  const article = findArticleBySlug(articles, slug);

  if (!article) {
    throw new ArticleNotFoundError(slug);
  }

  return article;
}

/**
 * Get article summary for list views (lightweight projection)
 * Per 20-api-articles.md Section 3
 */
export async function getArticleSummaries(): Promise<ArticleListItem[]> {
  const articles = await readAllArticles();
  return articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    status: article.status,
    coverImage: article.coverImage,
    category: article.category,
    updatedAt: article.updatedAt,
  }));
}

/**
 * Search articles by title
 * Per 20-api-articles.md Section 3 (search parameter)
 */
export async function searchArticles(query: string): Promise<ArticleListItem[]> {
  const articles = await readAllArticles();
  const lowerQuery = query.toLowerCase();

  return articles
    .filter((article) => article.title.toLowerCase().includes(lowerQuery))
    .map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      status: article.status,
      coverImage: article.coverImage,
      category: article.category,
      updatedAt: article.updatedAt,
    }));
}

/**
 * Paginate articles
 * Per 20-api-articles.md Section 3 (pagination parameters)
 */
export async function paginateArticles(
  page: number = 1,
  limit: number = 20
): Promise<{
  items: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const articles = await readAllArticles();
  const total = articles.length;
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const items = articles
    .slice(skip, skip + limit)
    .map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      status: article.status,
      coverImage: article.coverImage,
      category: article.category,
      updatedAt: article.updatedAt,
    }));

  return { items, total, page, limit, totalPages };
}

/**
 * Check if an article exists by ID
 */
export async function articleExists(id: string): Promise<boolean> {
  const articles = await readAllArticles();
  return articles.some((article) => article.id === id);
}

/**
 * Check if a slug exists
 */
export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const articles = await readAllArticles();
  return slugExistsExcept(articles, slug, excludeId);
}

/**
 * Convert Zod errors to field-specific format
 */
function formatZodErrors(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'unknown',
    message: issue.message,
  }));
}

/**
 * Create a new article
 * Per 20-api-articles.md Section 5 and 12-articles.md Section 5.1
 *
 * Validates input, checks slug uniqueness, generates ID and timestamps,
 * then persists atomically.
 *
 * @throws ValidationError if validation fails
 * @throws SlugConflictError if slug already exists
 */
export async function createArticle(
  input: unknown
): Promise<FullArticle> {
  // Validate input based on status
  let validatedInput: DraftArticle | PublishArticle;

  // Check status field to determine which schema to use
  const statusField = (input as Record<string, unknown>)?.status;

  if (statusField === 'draft') {
    const result = DraftArticleSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Draft validation failed', formatZodErrors(result.error));
    }
    validatedInput = result.data;
  } else if (statusField === 'published') {
    const result = PublishArticleSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Publish validation failed', formatZodErrors(result.error));
    }
    validatedInput = result.data;
  } else {
    throw new ValidationError('Status must be "draft" or "published"', [
      { field: 'status', message: 'Status must be "draft" or "published"' },
    ]);
  }

  // Use write lock to serialize with other writes
  // Per 04-storage-strategy.md Section 8.2
  return await withWriteLock(ARTICLES_FILE, async () => {
    const articles = await readAllArticles();

    // Check slug uniqueness per 17-article-validation.md Section 5
    if (slugExistsExcept(articles, validatedInput.slug)) {
      throw new SlugConflictError(validatedInput.slug);
    }

    // Generate server-side ID and timestamps
    // Per 04-storage-strategy.md Section 6
    const now = new Date().toISOString();
    
    // Sanitize content per 06-security.md Section 6 and 17-article-validation.md Section 6
    const sanitizedContent = validatedInput.content ? sanitizeContent(validatedInput.content) : '';
    
    // Validate image references per 17-article-validation.md Section 7
    if (sanitizedContent) {
      const imageValidation = validateImageReferences(sanitizedContent);
      if (!imageValidation.valid) {
        throw new ValidationError('Invalid image references in content', 
          imageValidation.errors.map(err => ({ field: 'content', message: err }))
        );
      }
    }
    
    // Create article with proper typing
    const newArticle: FullArticle = {
      id: generateId(),
      title: validatedInput.title,
      slug: validatedInput.slug,
      category: validatedInput.category,
      content: sanitizedContent,
      coverImage: validatedInput.coverImage || '',
      excerpt: validatedInput.excerpt || '',
      author: validatedInput.author || '',
      seo: validatedInput.seo,
      status: validatedInput.status,
      publishedAt: validatedInput.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
      coverImageAlt: validatedInput.coverImageAlt,
      tags: (validatedInput as any).tags || [],
      featured: (validatedInput as any).featured || false,
      readTime: (validatedInput as any).readTime || '',
      relatedDestinations: (validatedInput as any).relatedDestinations || [],
      relatedPackages: (validatedInput as any).relatedPackages || [],
    };

    articles.push(newArticle);
    await writeAllArticles(articles);

    return newArticle;
  });
}

/**
 * Update an existing article
 * Per 20-api-articles.md Section 6 and 12-articles.md Section 5.3
 *
 * Preserves id and createdAt, refreshes updatedAt, checks slug uniqueness.
 * Allows status transitions via this endpoint or dedicated publish/unpublish actions.
 *
 * @throws ArticleNotFoundError if article not found
 * @throws ValidationError if validation fails
 * @throws SlugConflictError if slug already exists (excluding current article)
 */
export async function updateArticle(
  id: string,
  input: unknown
): Promise<FullArticle> {
  // Validate input based on status
  let validatedInput: DraftArticle | PublishArticle;

  const statusField = (input as Record<string, unknown>)?.status;

  if (statusField === 'draft') {
    const result = DraftArticleSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Draft validation failed', formatZodErrors(result.error));
    }
    validatedInput = result.data;
  } else if (statusField === 'published') {
    const result = PublishArticleSchema.safeParse(input);
    if (!result.success) {
      throw new ValidationError('Publish validation failed', formatZodErrors(result.error));
    }
    validatedInput = result.data;
  } else {
    throw new ValidationError('Status must be "draft" or "published"', [
      { field: 'status', message: 'Status must be "draft" or "published"' },
    ]);
  }

  return await withWriteLock(ARTICLES_FILE, async () => {
    const articles = await readAllArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      throw new ArticleNotFoundError(id);
    }

    const existing = articles[index];

    // Check slug uniqueness excluding current article
    // Per 17-article-validation.md Section 5
    if (validatedInput.slug !== existing.slug && slugExistsExcept(articles, validatedInput.slug, id)) {
      throw new SlugConflictError(validatedInput.slug);
    }

    const now = new Date().toISOString();

    // Sanitize content per 06-security.md Section 6 and 17-article-validation.md Section 6
    const sanitizedContent = validatedInput.content ? sanitizeContent(validatedInput.content) : '';
    
    // Validate image references per 17-article-validation.md Section 7
    if (sanitizedContent) {
      const imageValidation = validateImageReferences(sanitizedContent);
      if (!imageValidation.valid) {
        throw new ValidationError('Invalid image references in content', 
          imageValidation.errors.map(err => ({ field: 'content', message: err }))
        );
      }
    }

    // Preserve id and createdAt, refresh updatedAt
    // Per 04-storage-strategy.md Section 5
    const updated: FullArticle = {
      id: existing.id,
      title: validatedInput.title,
      slug: validatedInput.slug,
      category: validatedInput.category,
      content: sanitizedContent,
      coverImage: validatedInput.coverImage || '',
      excerpt: validatedInput.excerpt || '',
      author: validatedInput.author || '',
      seo: validatedInput.seo,
      status: validatedInput.status,
      coverImageAlt: validatedInput.coverImageAlt,
      createdAt: existing.createdAt,
      updatedAt: now,
      tags: (validatedInput as any).tags || existing.tags || [],
      featured: (validatedInput as any).featured !== undefined ? (validatedInput as any).featured : (existing.featured || false),
      readTime: (validatedInput as any).readTime || existing.readTime || '',
      relatedDestinations: (validatedInput as any).relatedDestinations || existing.relatedDestinations || [],
      relatedPackages: (validatedInput as any).relatedPackages || existing.relatedPackages || [],
      // If transitioning to published for first time, set publishedAt
      // Otherwise preserve existing publishedAt
      // Per 15-article-publishing.md Section 4.2
      publishedAt:
        validatedInput.status === 'published' && existing.publishedAt === null
          ? now
          : existing.publishedAt,
    };

    articles[index] = updated;
    await writeAllArticles(articles);

    return updated;
  });
}

/**
 * Delete an article
 * Per 20-api-articles.md Section 7 and 12-articles.md Section 5.4
 *
 * Removes the article record and its associated image folder.
 *
 * @throws ArticleNotFoundError if article not found
 */
export async function deleteArticle(id: string): Promise<void> {
  return await withWriteLock(ARTICLES_FILE, async () => {
    const articles = await readAllArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      throw new ArticleNotFoundError(id);
    }

    const article = articles[index];

    // Remove image folder if it exists
    // Per 12-articles.md Section 5.4 and 04-storage-strategy.md Section 9
    const articleImageDir = path.join(IMAGES_DIR, article.slug);
    try {
      await fs.rm(articleImageDir, { recursive: true, force: true });
    } catch {
      // Ignore if folder doesn't exist
    }

    // Remove article record
    articles.splice(index, 1);
    await writeAllArticles(articles);
  });
}

/**
 * Publish an article
 * Per 20-api-articles.md Section 8 and 15-article-publishing.md Section 4
 *
 * Validates publish requirements, sets status to published,
 * sets publishedAt if first publish, and triggers revalidation.
 *
 * @throws ArticleNotFoundError if article not found
 * @throws ValidationError if publish requirements not met
 */
export async function publishArticle(id: string): Promise<FullArticle> {
  return await withWriteLock(ARTICLES_FILE, async () => {
    const articles = await readAllArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      throw new ArticleNotFoundError(id);
    }

    const article = articles[index];

    // Validate publish requirements per 15-article-publishing.md Section 4.3
    // and 17-article-validation.md Section 3
    const result = PublishArticleSchema.safeParse({
      title: article.title,
      slug: article.slug,
      category: article.category,
      content: article.content,
      coverImage: article.coverImage,
      coverImageAlt: article.coverImageAlt,
      excerpt: article.excerpt,
      author: article.author,
      seo: article.seo,
      status: 'published' as const,
    });

    if (!result.success) {
      throw new ValidationError(
        'Article cannot be published. Missing requirements:',
        formatZodErrors(result.error)
      );
    }

    const now = new Date().toISOString();

    // Update article with published state
    // Per 15-article-publishing.md Section 4.2:
    // - Set status to published
    // - Set publishedAt only if previously null (preserve first-publish date)
    // - Refresh updatedAt
    const updated: FullArticle = {
      ...article,
      status: 'published',
      publishedAt: article.publishedAt || now,
      updatedAt: now,
    };

    articles[index] = updated;
    await writeAllArticles(articles);

    // Per 15-article-publishing.md Section 6: Trigger revalidation
    // This would be handled by the API layer, not the service
    // The service only manages data; revalidation is API layer concern

    return updated;
  });
}

/**
 * Unpublish an article
 * Per 20-api-articles.md Section 8 and 15-article-publishing.md Section 5
 *
 * Sets status to draft, preserves publishedAt, refreshes updatedAt.
 *
 * @throws ArticleNotFoundError if article not found
 */
export async function unpublishArticle(id: string): Promise<FullArticle> {
  return await withWriteLock(ARTICLES_FILE, async () => {
    const articles = await readAllArticles();
    const index = articles.findIndex((article) => article.id === id);

    if (index === -1) {
      throw new ArticleNotFoundError(id);
    }

    const article = articles[index];
    const now = new Date().toISOString();

    // Update article with draft state
    // Per 15-article-publishing.md Section 5:
    // - Set status to draft
    // - Preserve publishedAt (historical record)
    // - Refresh updatedAt
    const updated: FullArticle = {
      ...article,
      status: 'draft',
      updatedAt: now,
    };

    articles[index] = updated;
    await writeAllArticles(articles);

    // Per 15-article-publishing.md Section 6: Trigger revalidation
    // This would be handled by the API layer, not the service

    return updated;
  });
}
