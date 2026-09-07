/**
 * Sharp Image Processing Optimization
 * Limits concurrent image operations to prevent process explosion
 * 
 * Usage: Add to app/api/admin/articles/upload-image/route.ts
 */

import sharp from "sharp";

// ========== SHARP CONFIGURATION ==========
// Limit concurrent operations to 2 to reduce process spawning
const SHARP_MAX_CONCURRENT = 2;
let sharpQueueLength = 0;

/**
 * Execute sharp operation with concurrency limit
 * Queues operations to prevent spawning unlimited worker threads
 */
async function executeWithConcurrencyLimit<T>(
  operation: () => Promise<T>
): Promise<T> {
  // Wait if queue is full
  while (sharpQueueLength >= SHARP_MAX_CONCURRENT) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  sharpQueueLength++;
  try {
    return await operation();
  } finally {
    sharpQueueLength--;
  }
}

/**
 * Optimized image processing with concurrency limits
 * Replace existing sharp processing code with this
 */
export async function processImageOptimized(
  buffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<Buffer> {
  const { maxWidth = 4096, maxHeight = 4096, quality = 80 } = options;

  return executeWithConcurrencyLimit(async () => {
    return sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
  });
}

/**
 * Generate thumbnail with concurrency limit
 */
export async function generateThumbnail(
  buffer: Buffer,
  size: number = 200
): Promise<Buffer> {
  return executeWithConcurrencyLimit(async () => {
    return sharp(buffer)
      .resize(size, size, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 75 })
      .toBuffer();
  });
}

/**
 * Get image metadata with concurrency limit
 */
export async function getImageMetadata(buffer: Buffer) {
  return executeWithConcurrencyLimit(async () => {
    return sharp(buffer).metadata();
  });
}
