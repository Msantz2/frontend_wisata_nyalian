/**
 * Zod validation schemas for Tour Packages module
 * Implements validation rules for admin CRUD operations
 */

import { z } from 'zod';

/**
 * KATEGORI PAKET SCHEMA
 */
export const CreateKategoriPaketSchema = z.object({
  nama_kategori: z
    .string()
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(100, 'Nama kategori maksimal 100 karakter')
    .trim(),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung')
    .trim(),
  deskripsi_kategori: z
    .string()
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().default(true),
});

export const UpdateKategoriPaketSchema = CreateKategoriPaketSchema.partial();

/**
 * PAKET WISATA SCHEMA - DRAFT
 * Permissive validation for saving as draft
 */
export const DraftPaketSchema = z.object({
  nama_paket: z
    .string()
    .min(3, 'Nama paket minimal 3 karakter')
    .max(100, 'Nama paket maksimal 100 karakter')
    .trim(),
  id_kategori: z
    .number()
    .int()
    .positive('Kategori tidak valid'),
  harga_per_pax: z
    .number()
    .nonnegative('Harga tidak boleh negatif'),
  kuota_default: z
    .number()
    .int()
    .nonnegative('Kuota tidak boleh negatif'),
  
  deskripsi_paket: z.string().optional().or(z.literal('')),
  deskripsi_pendek: z.string().max(300, 'Deskripsi pendek maksimal 300 karakter').optional().or(z.literal('')),
  durasi: z.string().optional().or(z.literal('')),
  durasi_hari: z.number().int().nonnegative().optional().or(z.literal(0)),
  durasi_jam: z.number().int().nonnegative().optional().or(z.literal(0)),
  kapasitas_min: z.number().int().positive().default(1),
  kapasitas_max: z.number().int().positive().optional(),
  
  highlights: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  itinerary: z.string().default(''),
  
  featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

/**
 * PAKET WISATA SCHEMA - PUBLISH
 * Strict validation for publishing (ensure completeness)
 */
export const PublishPaketSchema = DraftPaketSchema.extend({
  deskripsi_paket: z
    .string()
    .min(50, 'Deskripsi lengkap minimal 50 karakter untuk publikasi')
    .trim(),
  deskripsi_pendek: z
    .string()
    .min(20, 'Deskripsi pendek minimal 20 karakter untuk publikasi')
    .max(300, 'Deskripsi pendek maksimal 300 karakter')
    .trim(),
  durasi: z
    .string()
    .min(1, 'Durasi wajib diisi untuk publikasi')
    .trim(),
  highlights: z
    .array(z.string())
    .min(1, 'Minimal 1 highlight untuk publikasi'),
  included: z
    .array(z.string())
    .min(1, 'Minimal 1 item yang termasuk untuk publikasi'),
});

/**
 * CREATE/UPDATE SCHEMA
 * Union type - allows draft or publish validation
 */
export const CreatePaketSchema = z.union([
  DraftPaketSchema,
  PublishPaketSchema,
]);

export const UpdatePaketSchema = DraftPaketSchema.partial();

/**
 * ITINERARY ITEM SCHEMA
 * Structure for single day in itinerary
 */
export const ItineraryItemSchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(3, 'Judul hari minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  activities: z.array(z.string()).default([]),
  meals: z.array(z.string()).optional(), // e.g., ['breakfast', 'lunch', 'dinner']
  accommodation: z.string().optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateKategoriPaket = z.infer<typeof CreateKategoriPaketSchema>;
export type UpdateKategoriPaket = z.infer<typeof UpdateKategoriPaketSchema>;
export type DraftPaket = z.infer<typeof DraftPaketSchema>;
export type PublishPaket = z.infer<typeof PublishPaketSchema>;
export type CreatePaket = z.infer<typeof CreatePaketSchema>;
export type UpdatePaket = z.infer<typeof UpdatePaketSchema>;
export type ItineraryItem = z.infer<typeof ItineraryItemSchema>;
