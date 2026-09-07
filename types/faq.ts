export interface FAQ {
  id_faq: number;
  kategori: string;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
  updated_by: number | null;
  deleted_by: number | null;
}

export interface CreateFAQPayload {
  kategori: string;
  pertanyaan: string;
  jawaban: string;
  urutan?: number;
  featured?: boolean;
  is_active?: boolean;
}

export interface UpdateFAQPayload {
  kategori?: string;
  pertanyaan?: string;
  jawaban?: string;
  urutan?: number;
  featured?: boolean;
  is_active?: boolean;
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQ;
}

export interface FAQListResponse {
  success: boolean;
  message: string;
  data: FAQ[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
