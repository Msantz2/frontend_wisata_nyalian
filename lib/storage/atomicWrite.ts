// Atomic write utility for safe, reliable file operations
// Per 04-storage-strategy.md Section 8 (Write Strategy & Data Integrity)

import fs from 'fs/promises';
import { open } from 'fs/promises';

export interface AtomicWriteOptions {
  encoding?: 'utf-8' | 'utf8';
  backup?: boolean;
}

// Per 04-storage-strategy.md Section 8.2: Write Serialization
// In-process lock per file to serialize concurrent writes
const writeLocks = new Map<string, Promise<void>>();

/**
 * Read JSON data from file
 * Per 04-storage-strategy.md Section 7
 * 
 * @throws Error if file cannot be read or JSON is malformed
 */
export async function readJSON<T>(filePath: string): Promise<T> {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf-8' });
    return JSON.parse(data) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Corrupted JSON file at ${filePath}: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Write JSON data atomically to a file
 * Per 04-storage-strategy.md Section 8 (Atomic Write Pattern)
 * 
 * Implements the full atomic write flow:
 * 1. Read current file into memory
 * 2. Write to temporary file
 * 3. Call fsync() to ensure disk persistence
 * 4. Atomic rename (temp → target)
 * 5. On error: delete temp file, preserve original
 * 
 * @throws Error if write, fsync, or rename fails
 */
export async function atomicWriteJSON<T>(
  filePath: string,
  data: T,
  options?: AtomicWriteOptions
): Promise<void> {
  const encoding = (options?.encoding || 'utf-8') as BufferEncoding;
  const tempFilePath = `${filePath}.tmp`;
  let tempFileHandle: Awaited<ReturnType<typeof open>> | null = null;

  try {
    // Step 1: Serialize data to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Step 2: Write to temporary file
    tempFileHandle = await open(tempFilePath, 'w');
    await tempFileHandle.write(jsonString, 0, encoding);

    // Step 3: Flush and synchronize to ensure disk write
    // Per 04-storage-strategy.md Section 8.1, step 4
    await tempFileHandle.sync();

    // Step 4: Atomic rename (temp → target)
    // Per 04-storage-strategy.md Section 8.1, step 5
    // This is atomic at filesystem level on POSIX systems
    await fs.rename(tempFilePath, filePath);
  } catch (error) {
    // Step 5: On error, delete temp file and preserve original
    // Per 04-storage-strategy.md Section 8.1, step 6
    try {
      if (tempFileHandle) {
        await tempFileHandle.close();
      }
      await fs.unlink(tempFilePath).catch(() => {
        // Ignore if temp file doesn't exist
      });
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  } finally {
    if (tempFileHandle) {
      try {
        await tempFileHandle.close();
      } catch {
        // Ignore close errors
      }
    }
  }
}

/**
 * Execute an operation with write serialization lock
 * Per 04-storage-strategy.md Section 8.2 (Write Serialization)
 * 
 * Ensures only one write operation occurs at a time per file,
 * preventing race conditions under single Node.js process assumption.
 * 
 * @param filePath - The file being written (used as lock key)
 * @param operation - Async function to execute under lock
 * @returns Result of operation
 */
export async function withWriteLock<T>(
  filePath: string,
  operation: () => Promise<T>
): Promise<T> {
  // Get or create a promise chain for this file
  const currentLock = writeLocks.get(filePath) || Promise.resolve();

  // Create a new promise that chains the operation after the current lock
  const newLock = currentLock.then(() => operation());

  // Store the new lock (without the operation result, so it resolves to void)
  writeLocks.set(filePath, newLock.then(() => undefined));

  // Return the operation result
  return newLock;
}
