'use client';

import { useState } from 'react';
import { FormSection } from '@/components/admin/form/FormSection';
import { FormActions } from '@/components/admin/form/FormActions';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FAQ, CreateFAQPayload, UpdateFAQPayload } from '@/types/faq';

interface FAQFormProps {
  initialData?: FAQ;
  onSubmit: (data: CreateFAQPayload & UpdateFAQPayload) => Promise<void>;
  isLoading?: boolean;
}

export function FAQForm({ initialData, onSubmit, isLoading = false }: FAQFormProps) {
  const [kategori, setKategori] = useState(initialData?.kategori || '');
  const [pertanyaan, setPertanyaan] = useState(initialData?.pertanyaan || '');
  const [jawaban, setJawaban] = useState(initialData?.jawaban || '');
  const [urutan, setUrutan] = useState(initialData?.urutan || 0);
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!kategori.trim()) {
      newErrors.kategori = 'Kategori is required';
    } else if (kategori.trim().length < 2) {
      newErrors.kategori = 'Kategori must be at least 2 characters';
    } else if (kategori.length > 100) {
      newErrors.kategori = 'Kategori must not exceed 100 characters';
    }

    if (!pertanyaan.trim()) {
      newErrors.pertanyaan = 'Pertanyaan is required';
    } else if (pertanyaan.trim().length < 5) {
      newErrors.pertanyaan = 'Pertanyaan must be at least 5 characters';
    }

    if (!jawaban.trim()) {
      newErrors.jawaban = 'Jawaban is required';
    } else if (jawaban.trim().length < 10) {
      newErrors.jawaban = 'Jawaban must be at least 10 characters';
    }

    if (urutan < 0) {
      newErrors.urutan = 'Urutan must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        kategori: kategori.trim(),
        pertanyaan: pertanyaan.trim(),
        jawaban: jawaban.trim(),
        urutan,
        featured,
        is_active: isActive,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <SectionCard title="FAQ Information">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Kategori *</label>
              <Input
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="e.g., Harga, Fasilitas, Booking"
                className={errors.kategori ? 'border-red-500' : ''}
                maxLength={100}
              />
              {errors.kategori && (
                <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pertanyaan *</label>
              <Textarea
                value={pertanyaan}
                onChange={(e) => setPertanyaan(e.target.value)}
                placeholder="Masukkan pertanyaan..."
                rows={3}
                className={errors.pertanyaan ? 'border-red-500' : ''}
              />
              {errors.pertanyaan && (
                <p className="text-red-500 text-sm mt-1">{errors.pertanyaan}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Jawaban *</label>
              <Textarea
                value={jawaban}
                onChange={(e) => setJawaban(e.target.value)}
                placeholder="Masukkan jawaban..."
                rows={5}
                className={errors.jawaban ? 'border-red-500' : ''}
              />
              {errors.jawaban && (
                <p className="text-red-500 text-sm mt-1">{errors.jawaban}</p>
              )}
            </div>
          </FormSection>
        </SectionCard>

        <SectionCard title="Settings">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Urutan (Order)</label>
              <Input
                type="number"
                value={urutan}
                onChange={(e) => setUrutan(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                min={0}
                className={errors.urutan ? 'border-red-500' : ''}
              />
              {errors.urutan && (
                <p className="text-red-500 text-sm mt-1">{errors.urutan}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">Determines display order (lower numbers appear first)</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Tampilkan di FAQ unggulan</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Aktif</span>
              </label>
            </div>
          </FormSection>
        </SectionCard>

        <FormActions>
          <Button
            type="submit"
            disabled={submitting || isLoading}
            className="w-full"
          >
            {submitting || isLoading ? 'Saving...' : 'Save FAQ'}
          </Button>
        </FormActions>
      </div>
    </form>
  );
}
