// Article image upload endpoint
// Per 20-api-articles.md Section 9 and 14-article-image.md
// Handles cover image and inline image uploads with Sharp processing

import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { apiSuccess, apiError } from '@/lib/api/response';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB per 14-article-image.md Section 2.1
const MAX_DIMENSIONS = 4096; // per 14-article-image.md Section 2.1
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

/**
 * Get next available filename for inline images
 * Per 14-article-image.md Section 4: Sequential naming (article-1.webp, article-2.webp, etc.)
 * Finds the highest existing number and returns next sequential number
 */
async function getNextImageFilename(slug: string): Promise<string> {
  try {
    const fs = await import('fs/promises');
    const articleDir = path.join(IMAGES_DIR, slug);
    
    try {
      const files = await fs.readdir(articleDir);
      const inlineImages = files.filter((f) => f.match(/^article-\d+\.webp$/));
      
      if (inlineImages.length === 0) {
        return 'article-1.webp';
      }
      
      // Extract numbers from filenames and find maximum
      const numbers = inlineImages
        .map((f) => {
          const match = f.match(/^article-(\d+)\.webp$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((n) => n > 0);
      
      const maxNum = Math.max(...numbers);
      return `article-${maxNum + 1}.webp`;
    } catch {
      // Directory doesn't exist yet, start with article-1
      return 'article-1.webp';
    }
  } catch {
    return 'article-1.webp';
  }
}

/**
 * POST /api/admin/articles/upload-image
 * Per 20-api-articles.md Section 9 and 14-article-image.md
 */
export async function POST(request: NextRequest) {
  try {
    // Verify session per 19-api-overview.md Section 8
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;
    const type = formData.get('type') as 'cover' | 'content';
    const alt = (formData.get('alt') as string) || '';

    // Validate inputs
    if (!file) {
      return apiError('BAD_REQUEST', 'No file provided', undefined, 400);
    }
    if (!slug) {
      return apiError('BAD_REQUEST', 'Image upload failed. Article slug was not generated.', undefined, 400);
    }
    if (!type) {
      return apiError('BAD_REQUEST', 'Image upload failed. Missing upload type.', undefined, 400);
    }
    if (type !== 'cover' && type !== 'content') {
      return apiError('BAD_REQUEST', 'Invalid type (must be cover or content)', undefined, 400);
    }

    // Per 14-article-image.md Section 2.1: Validate file size
    const buffer = await file.arrayBuffer();
    if (buffer.byteLength > MAX_SIZE) {
      return apiError(
        'IMAGE_TOO_LARGE',
        'File size exceeds 5 MB limit',
        undefined,
        400
      );
    }

    // Per 14-article-image.md Section 2.1: Validate file type by magic number
    const fileType = await fileTypeFromBuffer(Buffer.from(buffer));
    if (!fileType || !['image/jpeg', 'image/png', 'image/webp'].includes(fileType.mime)) {
      return apiError(
        'IMAGE_TYPE_INVALID',
        'File type not supported. Accepted formats: jpg, jpeg, png, webp',
        undefined,
        422
      );
    }

    // Per 14-article-image.md Section 3: Process with Sharp
    const sharpImage = sharp(Buffer.from(buffer));
    const metadata = await sharpImage.metadata();

    // Validate dimensions per 14-article-image.md Section 2.1
    if (
      metadata.width &&
      metadata.height &&
      (metadata.width > MAX_DIMENSIONS || metadata.height > MAX_DIMENSIONS)
    ) {
      return apiError(
        'IMAGE_DIMENSIONS_INVALID',
        `Image dimensions must not exceed ${MAX_DIMENSIONS}×${MAX_DIMENSIONS} pixels`,
        undefined,
        422
      );
    }

    // Per 14-article-image.md Section 3: Process pipeline
    // Remove EXIF, normalize, compress, convert to WebP
    const processedBuffer = await sharp(Buffer.from(buffer))
      .rotate() // Auto-rotate based on EXIF
      .withMetadata({ orientation: undefined } as Record<string, unknown>) // Remove EXIF
      .normalize()
      .webp({ quality: 80 })
      .toBuffer();

    // Create article image directory if needed
    const articleDir = path.join(IMAGES_DIR, slug);
    await mkdir(articleDir, { recursive: true });

    // Determine filename
    // Per 14-article-image.md Section 4: cover.webp for cover, article-N.webp for inline
    const filename = type === 'cover' ? 'cover.webp' : await getNextImageFilename(slug);
    const filePath = path.join(articleDir, filename);

     // Per 04-storage-strategy.md Section 9: Write processed file
     await writeFile(filePath, processedBuffer);
 
     // Return success with URL
     // Per 20-api-articles.md Section 9 and 14-article-image.md
     // Files stored in public/images/{slug}/ are served at /images/{slug}/
     // Return client-facing URL without /public/ prefix (Next.js serves /public at /)
     const url = `/images/articles/${slug}/${filename}`;
     return apiSuccess({ url, alt }, 200);
  } catch (error) {
    console.error('[API] Image upload error:', error);

    if (error instanceof Error && error.message.includes('ENOSPC')) {
      return apiError(
        'INTERNAL_ERROR',
        'Server storage full',
        undefined,
        500
      );
    }

    return apiError(
      'IMAGE_PROCESSING_FAILED',
      'Failed to process image',
      undefined,
      422
    );
  }
}

