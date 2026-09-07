/**
 * API Services - Barrel export for all API service modules
 */

export * from './client';
export * from './types';
export { destinasiService } from './destinasi';
export { paketService } from './paket';
export { beritaService } from './berita';
export { faqService } from './faq';
export { ulasanService } from './ulasan';
export { kategoriPaketService } from './kategori-paket';

// Re-export payload types for convenience
export type {
  CreateKategoriPaketPayload,
  UpdateKategoriPaketPayload,
} from './kategori-paket';

export type {
  CreatePaketWisataPayload,
  UpdatePaketWisataPayload,
} from './paket';
