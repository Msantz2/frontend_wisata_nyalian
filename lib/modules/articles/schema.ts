// Zod validation schemas for Articles module
// Implements validation rules defined in 17-article-validation.md
// Applied server-side to all write operations (create, update, publish)

import { z } from 'zod';

/**
 * SLUG VALIDATION
 * Per 17-article-validation.md, Section 5:
 * - Lowercase, kebab-case (alphanumeric segments separated by single hyphens)
 * - No leading/trailing/duplicate hyphens
 * - Max 100 characters
 * - Uniqueness checked at data access layer (not in schema)
 */
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must not exceed 100 characters')
  .regex(
    slugRegex,
    'Slug must be lowercase, kebab-case (alphanumeric with hyphens only)'
  );

/**
 * SEO METADATA SCHEMA
 * Per 17-article-validation.md, Section 4 and 16-article-seo.md, Section 2
 * All fields optional; client shows recommended length as guidance only
 * 
 * Image paths are stored as /images/articles/{slug}/ (served by Next.js from /public directory)
 * Per 04-storage-strategy.md Section 4: Files in /public are served at /
 */
export const ArticleSeoSchema = z
  .object({
    metaTitle: z
      .string()
      .max(200, 'Meta title must not exceed 200 characters')
      .nullable()
      .optional(),
    metaDescription: z
      .string()
      .max(500, 'Meta description must not exceed 500 characters')
      .nullable()
      .optional(),
    ogImage: z
      .string()
      .regex(
        /^\/images\/articles\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\/.*\.(webp|jpg|jpeg|png)$/i,
        'OG image must be a valid image path within article namespace'
      )
      .nullable()
      .optional(),
    canonicalUrl: z
      .string()
      .url('Canonical URL must be a valid URL if provided')
      .nullable()
      .optional(),
    noIndex: z.boolean().default(false),
  })
  .optional();

/**
 * IMAGE METADATA SCHEMA
 * Per 17-article-validation.md, Section 7 and 20-api-articles.md, Section 9
 * Represents validated, uploaded image references
 * Image paths are client-facing URLs (/images/articles/{slug}/, not /public/images/)
 */
export const ImageMetadataSchema = z.object({
  url: z
    .string()
    .regex(
      /^\/images\/articles\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\/.*\.(webp|jpg|jpeg|png)$/i,
      'Image URL must be a valid path within article namespace'
    ),
  alt: z
    .string()
    .max(200, 'Alt text must not exceed 200 characters')
    .nullable()
    .optional(),
});

/**
 * DRAFT ARTICLE SCHEMA
 * Per 17-article-validation.md, Section 3
 * Permissive validation for articles being saved as draft
 * Required: title, slug, category
 * Optional: content, coverImage, excerpt, author, seo
 * 
 * Image paths are client-facing URLs (/images/articles/{slug}/, not /public/images/)
 * 
 * Note: If coverImage is provided, coverImageAlt MUST also be provided (non-empty).
 * This prevents schema mismatches where drafts can be saved with empty alt text
 * but then cannot be published. Per 14-article-image.md Section 7, alt text is
 * optional for drafts but required for publishing - enforcing it here prevents
 * users from creating unpublishable articles.
 */
export const DraftArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must not exceed 150 characters'),
  slug: SlugSchema,
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must not exceed 50 characters'),
  content: z
    .string()
    .max(50000, 'Content must not exceed 50000 characters')
    .optional()
    .or(z.literal('')),
  coverImage: z
    .string()
    .regex(
      /^\/images\/articles\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\/.*\.(webp|jpg|jpeg|png)$/i,
      'Cover image must be a valid image path within article namespace'
    )
    .optional()
    .or(z.literal('')),
  coverImageAlt: z
    .string()
    .max(200, 'Cover image alt text must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  excerpt: z
    .string()
    .max(300, 'Excerpt must not exceed 300 characters')
    .optional()
    .or(z.literal('')),
  author: z
    .string()
    .max(100, 'Author must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  seo: ArticleSeoSchema,
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  readTime: z.string().optional(),
  relatedDestinations: z.array(z.string()).default([]),
  relatedPackages: z.array(z.string()).default([]),
  status: z.literal('draft'),
}).refine(
  (data) => {
    // Per 14-article-image.md Section 7: If coverImage is present, coverImageAlt must be non-empty
    // This prevents drafts with images but no alt text from being saved, which would block publishing
    if (data.coverImage && data.coverImage.trim()) {
      return data.coverImageAlt && data.coverImageAlt.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Cover image alt text is required when a cover image is provided',
    path: ['coverImageAlt'],
  }
);

/**
 * PUBLISH ARTICLE SCHEMA
 * Per 17-article-validation.md, Section 3 and 15-article-publishing.md, Section 4.3
 * Strict validation for articles transitioning to published state
 * All core fields required: title, slug, category, content, coverImage, coverImageAlt, excerpt
 * 
 * Image paths are client-facing URLs (/images/articles/{slug}/, not /public/images/)
 */
export const PublishArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must not exceed 150 characters'),
  slug: SlugSchema,
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must not exceed 50 characters'),
  content: z
    .string()
    .min(1, 'Content is required to publish')
    .max(50000, 'Content must not exceed 50000 characters')
    .refine(
      (val) => val.trim().length > 0,
      'Content cannot be empty or whitespace only'
    ),
  coverImage: z
    .string()
    .min(1, 'Cover image is required to publish')
    .regex(
      /^\/images\/articles\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\/.*\.(webp|jpg|jpeg|png)$/i,
      'Cover image must be a valid image path within article namespace'
    ),
  coverImageAlt: z
    .string()
    .min(1, 'Cover image alt text is required for accessibility')
    .max(200, 'Cover image alt text must not exceed 200 characters'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required to publish')
    .max(300, 'Excerpt must not exceed 300 characters'),
  author: z
    .string()
    .max(100, 'Author must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  seo: ArticleSeoSchema,
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  readTime: z.string().optional(),
  relatedDestinations: z.array(z.string()).default([]),
  relatedPackages: z.array(z.string()).default([]),
  status: z.literal('published'),
});

/**
 * CREATE ARTICLE REQUEST SCHEMA
 * Allows creation as draft (permissive) or direct publish (strict)
 * Per 20-api-articles.md, Section 5
 */
export const CreateArticleSchema = z.union([
  DraftArticleSchema,
  PublishArticleSchema,
]);

/**
 * UPDATE ARTICLE REQUEST SCHEMA
 * Allows update to draft or published state with corresponding validation
 * Per 20-api-articles.md, Section 6
 */
export const UpdateArticleSchema = z.union([
  DraftArticleSchema,
  PublishArticleSchema,
]);

/**
 * FULL ARTICLE RESPONSE SCHEMA
 * Server-managed fields (id, createdAt, updatedAt, publishedAt) included
 * Per 20-api-articles.md, Sections 4-8
 */
export const FullArticleSchema = z.object({
  id: z.string().uuid('Article ID must be a valid UUID'),
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  content: z.string(),
  coverImage: z.string(),
  coverImageAlt: z.string().optional(),
  excerpt: z.string(),
  author: z.string().optional(),
  seo: ArticleSeoSchema,
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  readTime: z.string().optional(),
  relatedDestinations: z.array(z.string()).default([]),
  relatedPackages: z.array(z.string()).default([]),
});

/**
 * ARTICLE LIST ITEM SCHEMA
 * Lightweight projection for list views (excludes content, seo detail)
 * Per 20-api-articles.md, Section 3
 */
export const ArticleListItemSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  status: z.enum(['draft', 'published']),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  updatedAt: z.string().datetime(),
});

/**
 * PUBLISH ACTION SCHEMA
 * No request body required; validation occurs through PublishArticleSchema
 * Per 20-api-articles.md, Section 8
 */
export const PublishActionSchema = z.object({}).strict();

/**
 * UNPUBLISH ACTION SCHEMA
 * No request body required
 * Per 20-api-articles.md, Section 8
 */
export const UnpublishActionSchema = z.object({}).strict();

// ============================================================================
// TYPE EXPORTS
// Inferred types for use throughout the service and API layers
// ============================================================================

export type ArticleSeo = z.infer<typeof ArticleSeoSchema>;
export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;
export type DraftArticle = z.infer<typeof DraftArticleSchema>;
export type PublishArticle = z.infer<typeof PublishArticleSchema>;
export type CreateArticleRequest = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleRequest = z.infer<typeof UpdateArticleSchema>;
export type FullArticle = z.infer<typeof FullArticleSchema>;
export type ArticleListItem = z.infer<typeof ArticleListItemSchema>;
export type PublishAction = z.infer<typeof PublishActionSchema>;
export type UnpublishAction = z.infer<typeof UnpublishActionSchema>;
