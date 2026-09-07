/**
 * API Types - Interfaces matching backend API responses
 * Based on API_AUDIT_REPORT.md
 */

// ============================================================================
// KATEGORI DESTINASI (Destination Categories)
// ============================================================================
export interface KategoriDestinasiResponse {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  deskripsi_kategori: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// DESTINASI (Destinations)
// ============================================================================
export interface DestinasiResponse {
  id_destinasi: number;
  id_kategori: number;
  nama_destinasi: string;
  deskripsi: string;
  lokasi_maps: string;
  jam_operasional: string;
  fasilitas: string;
  slug: string;
  deskripsi_pendek: string;
  alamat: string;
  latitude: string;
  longitude: string;
  harga_tiket: string | number | null;
  featured: boolean;
  jam_buka: string;
  jam_tutup: string;
  harga_tiket_dewasa: number | null;
  harga_tiket_anak: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  desa: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
  url_gambar_cdn: string | null;
  url_thumbnail_cdn: string | null;
  gambar_public_id: string | null;
  gambar_metadata: Record<string, any>;
}

export interface GaleriResponse {
  id_galeri: number;
  id_destinasi: number;
  url_foto_cdn: string;
  caption: string;
  urutan: number;
  alt_text: string | null;
  tipe_media: string;
  created_at: string;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// KATEGORI PAKET (Package Categories)
// ============================================================================
export interface KategoriPaketResponse {
  id_kategori: number;
  nama_kategori: string;
  slug: string;
  deskripsi_kategori: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// PAKET WISATA (Tour Packages)
// ============================================================================
export interface PaketWisataResponse {
  id_paket: number;
  nama_paket: string;
  deskripsi_paket: string;
  harga_per_pax: number;
  itinerary: string;
  kuota_default: number;
  slug: string;
  deskripsi_pendek: string | null;
  durasi: string | null;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  featured: boolean;
  id_kategori: number | null;
  durasi_hari: number | null;
  durasi_jam: number | null;
  kapasitas_min: number;
  kapasitas_max: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
  url_gambar_cdn?: string;
  gambar_public_id?: string;
  gambar_metadata?: Record<string, any>;
  kategori_paket?: {
    id_kategori: number;
    nama_kategori: string;
  };
}

// ============================================================================
// PAKET DESTINASI (Package-Destination Links)
// ============================================================================
export interface PaketDestinasiResponse {
  id_paket_destinasi: number;
  id_paket: number;
  id_destinasi: number;
  urutan: number;
  created_at: string;
  destinasi?: DestinasiResponse;
}

// ============================================================================
// KUOTA (Quota/Availability)
// ============================================================================
export interface KuotaResponse {
  id_kuota: number;
  id_paket: number;
  tanggal: string;
  sisa_kuota: number;
  kuota_awal: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// BERITA (News/Articles)
// ============================================================================
export interface BeritaResponse {
  id_berita: number;
  id_admin: number;
  judul_berita: string;
  isi_konten: string;
  url_thumbnail_cdn: string;
  tanggal_publikasi: string;
  slug: string;
  excerpt: string | null;
  kategori: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  deskripsi_pendek: string | null;
  tags: string[];
  related_destinasi_ids: number[];
  related_paket_ids: number[];
  view_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// ULASAN (Reviews)
// ============================================================================
export interface UlasanResponse {
  id_ulasan: number;
  id_reservasi: number;
  rating_bintang: number;
  komentar: string;
  tanggal_ulasan: string;
  id_destinasi: number | null;
  is_verified: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// FAQ (Frequently Asked Questions)
// ============================================================================
export interface FaqResponse {
  id_faq: number;
  kategori: string;
  pertanyaan: string;
  jawaban: string;
  featured: boolean;
  urutan: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// WISATAWAN (Tourists)
// ============================================================================
export interface WisatawanResponse {
  id_wisatawan: number;
  nama_lengkap: string;
  email: string;
  no_whatsapp: string;
  jenis_kelamin: string | null;
  alamat: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// RESERVASI (Reservations)
// ============================================================================
export interface ReservasiResponse {
  id_reservasi: number;
  kode_booking: string;
  id_wisatawan: number;
  id_paket: number;
  id_admin: number | null;
  tanggal_kunjungan: string;
  jumlah_pax: number;
  total_harga: number;
  tipe_reservasi: 'online' | 'walk-in';
  status_reservasi: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  waktu_dibuat: string;
  catatan_admin: string | null;
  tanggal_batas_pembayaran: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// PEMBAYARAN (Payments)
// ============================================================================
export interface PembayaranResponse {
  id_pembayaran: number;
  id_reservasi: number;
  metode_bayar: string;
  waktu_bayar: string;
  bukti_transfer: string | null;
  status_pembayaran: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// TIKET (Tickets)
// ============================================================================
export interface TiketResponse {
  id_tiket: number;
  id_reservasi: number;
  kode_qr_token: string;
  status_tiket: 'Belum Digunakan' | 'Sudah Digunakan';
  waktu_scan: string | null;
  updated_at: string;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
}

// ============================================================================
// GENERIC LIST RESPONSE WITH PAGINATION
// ============================================================================
export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
