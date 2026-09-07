'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { FormSection } from '@/components/admin/form/FormSection';
import { FormActions } from '@/components/admin/form/FormActions';
import { LoadingState } from '@/components/admin/states/LoadingState';
import { ErrorState } from '@/components/admin/states/ErrorState';
import { StringArrayInput } from '@/components/admin/form/StringArrayInput';
import { ItineraryBuilder } from '@/components/admin/form/ItineraryBuilder';
import { PackageImageUpload } from '@/components/admin/form/PackageImageUpload';
import { paketService, kategoriPaketService } from '@/lib/api';
import type { PaketWisataResponse, KategoriPaketResponse } from '@/lib/api/types';
import type { ItineraryItem } from '@/lib/modules/packages/schema';
import { DraftPaketSchema, PublishPaketSchema } from '@/lib/modules/packages/schema';
import { timelineFormatToDayBased, dayBasedToTimelineFormat } from '@/lib/modules/packages/itineraryConverter';

interface PackageFormProps {
  mode: 'create' | 'edit';
  packageId?: number;
  onSuccess: () => void;
}

export function PackageForm({ mode, packageId, onSuccess }: PackageFormProps) {
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<KategoriPaketResponse[]>([]);

  // Form fields
  const [namaPaket, setNamaPaket] = useState('');
  const [idKategori, setIdKategori] = useState<string>('');
  const [deskripsiPendek, setDeskripsiPendek] = useState('');
  const [deskripsiPaket, setDeskripsiPaket] = useState('');
  const [hargaPerPax, setHargaPerPax] = useState<string>('');
  const [kuotaDefault, setKuotaDefault] = useState<string>('');
  const [kapasitasMin, setKapasitasMin] = useState<string>('1');
  const [kapasitasMax, setKapasitasMax] = useState<string>('');
  const [durasi, setDurasi] = useState('');
  const [durasiHari, setDurasiHari] = useState<string>('');
  const [durasiJam, setDurasiJam] = useState<string>('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [included, setIncluded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [gambar, setGambar] = useState<File | string | null>(null);
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await kategoriPaketService.list({ is_active: true });
        setCategories(response.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Load package in edit mode
  useEffect(() => {
    if (mode === 'edit' && packageId) {
      const fetchPackage = async () => {
        try {
          setLoading(true);
          const response = await paketService.getById(packageId);
          const pkg = response.data;

          setNamaPaket(pkg.nama_paket);
          setIdKategori(pkg.id_kategori?.toString() || '');
          setDeskripsiPendek(pkg.deskripsi_pendek || '');
          setDeskripsiPaket(pkg.deskripsi_paket || '');
          setHargaPerPax(pkg.harga_per_pax?.toString() || '');
          setKuotaDefault(pkg.kuota_default?.toString() || '');
          setKapasitasMin(pkg.kapasitas_min?.toString() || '1');
          setKapasitasMax(pkg.kapasitas_max?.toString() || '');
          setDurasi(pkg.durasi || '');
           setDurasiHari(pkg.durasi_hari?.toString() || '');
           setDurasiJam(pkg.durasi_jam?.toString() || '');
           setHighlights(Array.isArray(pkg.highlights) ? pkg.highlights : []);
           setIncluded(Array.isArray(pkg.included) ? pkg.included : []);
           setExcluded(Array.isArray(pkg.excluded) ? pkg.excluded : []);
           
           // Parse itinerary - convert timeline format to day-based format for editing
           let parsedItinerary: ItineraryItem[] = [];
           if (pkg.itinerary) {
             console.log('[PackageForm] Raw itinerary from API:', pkg.itinerary);
             parsedItinerary = timelineFormatToDayBased(pkg.itinerary);
             console.log('[PackageForm] Converted itinerary to day-based:', parsedItinerary);
           }
           setItinerary(parsedItinerary);
           
           setGambar(pkg.url_gambar_cdn || null);
           setFeatured(pkg.featured);
           setIsActive(pkg.is_active);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load package');
        } finally {
          setLoading(false);
        }
      };
      fetchPackage();
    }
  }, [mode, packageId]);

  // Save as draft
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setValidationErrors({});

      // Convert day-based itinerary back to timeline format for saving
      const timelineItinerary = dayBasedToTimelineFormat(itinerary);

      // Validate with draft schema
      const formData = {
        nama_paket: namaPaket,
        id_kategori: parseInt(idKategori) || 0,
        harga_per_pax: parseInt(hargaPerPax) || 0,
        kuota_default: parseInt(kuotaDefault) || 0,
        deskripsi_pendek: deskripsiPendek,
        deskripsi_paket: deskripsiPaket,
        durasi,
        durasi_hari: parseInt(durasiHari) || 0,
        durasi_jam: parseInt(durasiJam) || 0,
        kapasitas_min: parseInt(kapasitasMin) || 1,
        kapasitas_max: kapasitasMax ? parseInt(kapasitasMax) : undefined,
        highlights,
        included,
        excluded,
        itinerary: timelineItinerary,
        featured,
        is_active: isActive,
      };

      console.log('[PackageForm] Form data before validation:', formData);

      const validation = DraftPaketSchema.safeParse(formData);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.issues.forEach((err) => {
          errors[err.path.join('.')] = err.message;
        });
        setValidationErrors(errors);
        console.error('[PackageForm] Validation errors:', errors);
        console.error('[PackageForm] Full validation error:', validation.error);
        throw new Error('Validasi gagal. Periksa form Anda.');
      }

      console.log('[PackageForm] Validation passed, preparing payload...');

      // Prepare payload with image
      const payload: any = { ...formData };
      if (gambar instanceof File) {
        payload.gambar = gambar;
      }

      // Call API
      if (mode === 'create') {
        await paketService.create(payload);
        alert('Paket berhasil dibuat!');
        onSuccess();
      } else if (packageId) {
        await paketService.update(packageId, payload);
        alert('Paket berhasil diupdate!');
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  // Delete package
  const handleDelete = async () => {
    if (!packageId) return;
    if (!confirm('Yakin ingin menghapus paket ini?')) return;

    try {
      await paketService.delete(packageId);
      alert('Paket berhasil dihapus!');
      router.push('/admin/packages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete package');
    }
  };

  if (loading) {
    return <LoadingState count={6} />;
  }

  if (mode === 'edit' && error && !namaPaket) {
    return <ErrorState title="Failed to load package" description={error} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Error Alert */}
      {error && (
        <div className="lg:col-span-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Left Column - Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <SectionCard title="Informasi Dasar">
          <FormSection>
            <div>
              <label className="text-sm font-medium">Nama Paket *</label>
              <Input
                value={namaPaket}
                onChange={(e) => setNamaPaket(e.target.value)}
                placeholder="e.g., Bali Adventure 3D2N"
                className={validationErrors.nama_paket ? 'border-red-500' : ''}
              />
              {validationErrors.nama_paket && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.nama_paket}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Slug akan di-generate otomatis dari nama paket
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Kategori *</label>
              <Select
                value={idKategori}
                onValueChange={(val) => setIdKategori(val)}
              >
                <SelectTrigger className={validationErrors.id_kategori ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id_kategori} value={cat.id_kategori.toString()}>
                      {cat.nama_kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.id_kategori && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.id_kategori}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Harga per Pax *</label>
                <Input
                  type="number"
                  value={hargaPerPax}
                  onChange={(e) => setHargaPerPax(e.target.value)}
                  min={0}
                  className={validationErrors.harga_per_pax ? 'border-red-500' : ''}
                />
                {validationErrors.harga_per_pax && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.harga_per_pax}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Kuota Default *</label>
                <Input
                  type="number"
                  value={kuotaDefault}
                  onChange={(e) => setKuotaDefault(e.target.value)}
                  min={0}
                  className={validationErrors.kuota_default ? 'border-red-500' : ''}
                />
                {validationErrors.kuota_default && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.kuota_default}</p>
                )}
              </div>
            </div>
          </FormSection>
        </SectionCard>

        {/* Description */}
        <SectionCard title="Deskripsi">
          <FormSection>
            <div>
              <label className="text-sm font-medium">Deskripsi Pendek</label>
              <Textarea
                value={deskripsiPendek}
                onChange={(e) => setDeskripsiPendek(e.target.value)}
                placeholder="Ringkasan singkat paket (maks 300 karakter)"
                rows={2}
                maxLength={300}
              />
              <p className="text-xs text-muted-foreground">{deskripsiPendek.length} / 300</p>
            </div>

            <div>
              <label className="text-sm font-medium">Deskripsi Lengkap</label>
              <Textarea
                value={deskripsiPaket}
                onChange={(e) => setDeskripsiPaket(e.target.value)}
                placeholder="Deskripsi detail tentang paket wisata ini..."
                rows={6}
              />
            </div>
          </FormSection>
        </SectionCard>

        {/* Duration */}
        <SectionCard title="Durasi">
          <FormSection>
            <div>
              <label className="text-sm font-medium">Durasi (Text)</label>
              <Input
                value={durasi}
                onChange={(e) => setDurasi(e.target.value)}
                placeholder="e.g., 3 Hari 2 Malam"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Durasi Hari</label>
                <Input
                  type="number"
                  value={durasiHari}
                  onChange={(e) => setDurasiHari(e.target.value)}
                  min={0}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Durasi Jam</label>
                <Input
                  type="number"
                  value={durasiJam}
                  onChange={(e) => setDurasiJam(e.target.value)}
                  min={0}
                />
              </div>
            </div>
          </FormSection>
        </SectionCard>

        {/* Highlights */}
        <SectionCard title="Highlights">
          <FormSection>
            <StringArrayInput
              value={highlights}
              onChange={setHighlights}
              label="Highlight Paket"
              placeholder="e.g., Visit Waterfall, Traditional Ceremony"
            />
          </FormSection>
        </SectionCard>

        {/* Included/Excluded */}
        <SectionCard title="Yang Termasuk & Tidak Termasuk">
          <FormSection>
            <StringArrayInput
              value={included}
              onChange={setIncluded}
              label="Yang Termasuk"
              placeholder="e.g., Makan 3x sehari, Guide, Transportasi"
            />

            <StringArrayInput
              value={excluded}
              onChange={setExcluded}
              label="Yang Tidak Termasuk"
              placeholder="e.g., Tiket pesawat, Asuransi perjalanan"
            />
          </FormSection>
        </SectionCard>

        {/* Itinerary */}
        <SectionCard title="Itinerary">
          <FormSection>
            <ItineraryBuilder value={itinerary} onChange={setItinerary} />
          </FormSection>
        </SectionCard>
      </div>

      {/* Right Column - Image & Settings */}
      <div className="space-y-6">
        {/* Image Upload */}
        <SectionCard title="Gambar Paket">
          <FormSection>
            <PackageImageUpload
              value={gambar}
              onChange={setGambar}
              label="Gambar Utama"
            />
          </FormSection>
        </SectionCard>

        {/* Capacity */}
        <SectionCard title="Kapasitas">
          <FormSection>
            <div>
              <label className="text-sm font-medium">Kapasitas Minimum</label>
              <Input
                type="number"
                value={kapasitasMin}
                onChange={(e) => setKapasitasMin(e.target.value)}
                min={1}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kapasitas Maximum (opsional)</label>
              <Input
                type="number"
                value={kapasitasMax}
                onChange={(e) => setKapasitasMax(e.target.value)}
                min={1}
              />
            </div>
          </FormSection>
        </SectionCard>

        {/* Settings */}
        <SectionCard title="Pengaturan">
          <FormSection>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Featured</label>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Aktif</label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </FormSection>
        </SectionCard>

        {/* Actions */}
        <FormActions layout="vertical">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Menyimpan...' : mode === 'create' ? 'Buat Paket' : 'Simpan Perubahan'}
          </Button>
          
          {mode === 'edit' && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
            >
              Hapus Paket
            </Button>
          )}

          <Button variant="outline" onClick={onSuccess} className="w-full">
            Batal
          </Button>
        </FormActions>
      </div>
    </div>
  );
}
