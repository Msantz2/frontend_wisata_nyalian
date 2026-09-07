'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FormSection } from '@/components/admin/form/FormSection';
import { FormActions } from '@/components/admin/form/FormActions';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { DestinasiResponse } from '@/lib/api/types';
import type { CreateDestinasiPayload, UpdateDestinasiPayload } from '@/lib/api/destinasi';
import { destinasiService } from '@/lib/api/destinasi';
import { galeriService } from '@/lib/api/galeri';
import { X } from 'lucide-react';

interface DestinasiFormProps {
  initialData?: DestinasiResponse;
  onSubmit: (data: CreateDestinasiPayload & UpdateDestinasiPayload) => Promise<DestinasiResponse | void>;
  isLoading?: boolean;
  onSuccess?: () => void;
}

interface Kategori {
  id_kategori: number;
  nama_kategori: string;
}

export function DestinasiForm({ initialData, onSubmit, isLoading = false, onSuccess }: DestinasiFormProps) {
  const [namaDestinasi, setNamaDestinasi] = useState(initialData?.nama_destinasi || '');
  const [idKategori, setIdKategori] = useState(initialData?.id_kategori || 0);
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || '');
  const [deskripsiPendek, setDeskripsiPendek] = useState(initialData?.deskripsi_pendek || '');
  const [alamat, setAlamat] = useState(initialData?.alamat || '');
  const [lokasiMaps, setLokasiMaps] = useState(initialData?.lokasi_maps || '');
  const [jamOperasional, setJamOperasional] = useState(initialData?.jam_operasional || '');
  const [jamBuka, setJamBuka] = useState(initialData?.jam_buka || '');
  const [jamTutup, setJamTutup] = useState(initialData?.jam_tutup || '');
  const [fasilitas, setFasilitas] = useState(initialData?.fasilitas || '');
  const [latitude, setLatitude] = useState(initialData?.latitude || '');
  const [longitude, setLongitude] = useState(initialData?.longitude || '');
  const [hargaTiketDewasa, setHargaTiketDewasa] = useState(initialData?.harga_tiket_dewasa || 0);
  const [hargaTiketAnak, setHargaTiketAnak] = useState(initialData?.harga_tiket_anak || 0);
  const [hargaTiket, setHargaTiket] = useState(String(initialData?.harga_tiket || ''));
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [desa, setDesa] = useState(initialData?.desa || 'Nyalian');
  const [provinsi, setProvinsi] = useState(initialData?.provinsi || 'Bali');
  const [kabupaten, setKabupaten] = useState(initialData?.kabupaten || 'Klungkung');
  const [kecamatan, setKecamatan] = useState(initialData?.kecamatan || 'Banjarangkan');
  const [gambar, setGambar] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.url_gambar_cdn || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await destinasiService.getCategories();
        if (response.success) {
          setCategories(response.data as unknown as Kategori[]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!namaDestinasi.trim()) {
      newErrors.namaDestinasi = 'Nama Destinasi is required';
    } else if (namaDestinasi.trim().length < 3) {
      newErrors.namaDestinasi = 'Nama Destinasi must be at least 3 characters';
    } else if (namaDestinasi.length > 100) {
      newErrors.namaDestinasi = 'Nama Destinasi must not exceed 100 characters';
    }

    if (!idKategori || idKategori === 0) {
      newErrors.idKategori = 'Category is required';
    }

    if (latitude && isNaN(Number(latitude))) {
      newErrors.latitude = 'Latitude must be a valid number';
    }

    if (longitude && isNaN(Number(longitude))) {
      newErrors.longitude = 'Longitude must be a valid number';
    }

    if (hargaTiketDewasa && isNaN(Number(hargaTiketDewasa))) {
      newErrors.hargaTiketDewasa = 'Harga Tiket Dewasa must be a valid number';
    }

    if (hargaTiketAnak && isNaN(Number(hargaTiketAnak))) {
      newErrors.hargaTiketAnak = 'Harga Tiket Anak must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setGambar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addGalleryFiles(files);
  };

  const handleGalleryDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter(file => file.type.startsWith('image/'));
    addGalleryFiles(files);
  };

  const addGalleryFiles = (files: File[]) => {
    const newFiles = [...galleryFiles, ...files].slice(0, 50);
    setGalleryFiles(newFiles);

    const previews: string[] = [];
    let loadedCount = 0;

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        loadedCount++;
        if (loadedCount === newFiles.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  const uploadGalleryPhotos = async (idDestinasi: number) => {
    if (galleryFiles.length === 0) {
      return;
    }

    setUploadingGallery(true);
    try {
      // Add small delay to ensure destinasi update is processed
      await new Promise(resolve => setTimeout(resolve, 500));

      const formData = new FormData();
      formData.append('id_destinasi', String(idDestinasi));
      
      galleryFiles.forEach((file) => {
        formData.append('fotos', file);
      });

      // Extract token from cookies
      let token = null;
      if (typeof window !== 'undefined') {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';');
        for (const cookie of cookies) {
          const trimmed = cookie.trim();
          if (trimmed.startsWith('auth_token=')) {
            token = decodeURIComponent(trimmed.substring(11));
            break;
          }
        }
      }

      console.log('[Gallery] Token:', token ? 'Found' : 'Not found');
      console.log('[Gallery] Uploading to:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/galeri/bulk`);
      console.log('[Gallery] ID Destinasi:', idDestinasi);
      console.log('[Gallery] Files count:', galleryFiles.length);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/galeri/bulk`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        console.log('Gallery photos uploaded successfully', responseData);
        setGalleryFiles([]);
        setGalleryPreviews([]);
      } else {
        console.error('Failed to upload gallery photos:', response.status, responseData);
      }
    } catch (error) {
      console.error('Error uploading gallery photos:', error);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const payload: CreateDestinasiPayload = {
        id_kategori: Number(idKategori),
        nama_destinasi: namaDestinasi.trim(),
        deskripsi: deskripsi.trim() || undefined,
        deskripsi_pendek: deskripsiPendek.trim() || undefined,
        alamat: alamat.trim() || undefined,
        lokasi_maps: lokasiMaps.trim() || undefined,
        jam_operasional: jamOperasional.trim() || undefined,
        jam_buka: jamBuka || undefined,
        jam_tutup: jamTutup || undefined,
        fasilitas: fasilitas.trim() || undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        harga_tiket_dewasa: hargaTiketDewasa ? Number(hargaTiketDewasa) : undefined,
        harga_tiket_anak: hargaTiketAnak ? Number(hargaTiketAnak) : undefined,
        harga_tiket: hargaTiket.trim() || undefined,
        featured,
        is_active: isActive,
        desa,
        provinsi,
        kabupaten,
        kecamatan,
        ...(gambar && { gambar }),
      };

      const result = await onSubmit(payload);

      // Upload gallery photos AFTER destinasi update is successful
      // This works for both create (new destinasi) and edit (existing destinasi)
      if (galleryFiles.length > 0) {
        // For edit: use existing initialData.id_destinasi
        // For create: use id_destinasi from result (response from API)
        let idDestinasiToUse = initialData?.id_destinasi;
        
        if (!idDestinasiToUse && result && typeof result === 'object' && 'id_destinasi' in result) {
          idDestinasiToUse = (result as DestinasiResponse).id_destinasi;
        }

        if (idDestinasiToUse) {
          await uploadGalleryPhotos(idDestinasiToUse);
        }
      }

      // Call success callback after all operations complete
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <SectionCard title="Basic Information">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Destinasi *</label>
              <Input
                value={namaDestinasi}
                onChange={(e) => setNamaDestinasi(e.target.value)}
                placeholder="e.g., Pantai Pasir Putih"
                className={errors.namaDestinasi ? 'border-red-500' : ''}
                maxLength={100}
              />
              {errors.namaDestinasi && (
                <p className="text-red-500 text-sm mt-1">{errors.namaDestinasi}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kategori *</label>
              <select
                value={idKategori}
                onChange={(e) => setIdKategori(Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.idKategori ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loadingCategories}
              >
                <option value={0}>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id_kategori} value={cat.id_kategori}>
                    {cat.nama_kategori}
                  </option>
                ))}
              </select>
              {errors.idKategori && (
                <p className="text-red-500 text-sm mt-1">{errors.idKategori}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Tampilkan sebagai Unggulan</span>
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

        <SectionCard title="Description">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Deskripsi Pendek</label>
              <Textarea
                value={deskripsiPendek}
                onChange={(e) => setDeskripsiPendek(e.target.value)}
                placeholder="Short description..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deskripsi Lengkap</label>
              <Textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Full description..."
                rows={5}
              />
            </div>
          </FormSection>
        </SectionCard>

        <SectionCard title="Location">
          <FormSection>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Desa</label>
                <Input
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  placeholder="Desa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Provinsi</label>
                <Input
                  value={provinsi}
                  onChange={(e) => setProvinsi(e.target.value)}
                  placeholder="Provinsi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kabupaten</label>
                <Input
                  value={kabupaten}
                  onChange={(e) => setKabupaten(e.target.value)}
                  placeholder="Kabupaten"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kecamatan</label>
                <Input
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  placeholder="Kecamatan"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Alamat</label>
              <Textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Full address..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Google Maps URL</label>
              <Input
                value={lokasiMaps}
                onChange={(e) => setLokasiMaps(e.target.value)}
                placeholder="https://maps.google.com/..."
                type="url"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Latitude</label>
                <Input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-8.1234"
                  type="number"
                  step="0.0001"
                  className={errors.latitude ? 'border-red-500' : ''}
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Longitude</label>
                <Input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="115.1234"
                  type="number"
                  step="0.0001"
                  className={errors.longitude ? 'border-red-500' : ''}
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
                )}
              </div>
            </div>
          </FormSection>
        </SectionCard>

        <SectionCard title="Operating Hours">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Jam Operasional</label>
              <Input
                value={jamOperasional}
                onChange={(e) => setJamOperasional(e.target.value)}
                placeholder="e.g., 08:00 - 17:00"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jam Buka</label>
                <Input
                  value={jamBuka}
                  onChange={(e) => setJamBuka(e.target.value)}
                  type="time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Jam Tutup</label>
                <Input
                  value={jamTutup}
                  onChange={(e) => setJamTutup(e.target.value)}
                  type="time"
                />
              </div>
            </div>
          </FormSection>
        </SectionCard>

        <SectionCard title="Pricing">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Harga Tiket Dewasa</label>
              <Input
                value={hargaTiketDewasa}
                onChange={(e) => setHargaTiketDewasa(Number(e.target.value))}
                placeholder="0"
                type="number"
                min={0}
                className={errors.hargaTiketDewasa ? 'border-red-500' : ''}
              />
              {errors.hargaTiketDewasa && (
                <p className="text-red-500 text-sm mt-1">{errors.hargaTiketDewasa}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Harga Tiket Anak</label>
              <Input
                value={hargaTiketAnak}
                onChange={(e) => setHargaTiketAnak(Number(e.target.value))}
                placeholder="0"
                type="number"
                min={0}
                className={errors.hargaTiketAnak ? 'border-red-500' : ''}
              />
              {errors.hargaTiketAnak && (
                <p className="text-red-500 text-sm mt-1">{errors.hargaTiketAnak}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Harga Tiket (Alternative)</label>
              <Input
                value={hargaTiket}
                onChange={(e) => setHargaTiket(e.target.value)}
                placeholder="e.g., Rp 50.000 - Rp 100.000"
              />
            </div>
          </FormSection>
        </SectionCard>

        <SectionCard title="Facilities">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Fasilitas</label>
              <Textarea
                value={fasilitas}
                onChange={(e) => setFasilitas(e.target.value)}
                placeholder="Comma-separated facilities: Toilet, Parkir, Warung Makan, Mushola"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">Enter facilities separated by commas</p>
            </div>
          </FormSection>
        </SectionCard>

         <SectionCard title="Image">
            <FormSection>
              {imagePreview && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Current Image</p>
                  <Image
                    src={imagePreview}
                    alt="Destination preview"
                    width={300}
                    height={200}
                    className="max-w-sm rounded-lg border object-cover"
                  />
                </div>
              )}

             <div
               onDragOver={(e) => e.preventDefault()}
               onDrop={handleDragDrop}
               className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
             >
               <input
                 type="file"
                 id="image-upload"
                 accept="image/*"
                 onChange={handleImageChange}
                 className="hidden"
               />
               <label htmlFor="image-upload" className="cursor-pointer">
                 <div className="text-sm text-muted-foreground">
                   <p className="font-medium mb-1">Drag and drop your image here</p>
                   <p>or click to select a file</p>
                 </div>
               </label>
             </div>
           </FormSection>
         </SectionCard>

         <SectionCard title="Gallery Photos">
              <FormSection>
                <div>
                  <label className="block text-sm font-medium mb-3">Tambah Foto Galeri</label>
                  <p className="text-xs text-muted-foreground mb-3">Upload multiple photos sekaligus (max 50 files)</p>
                 
                 <div
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={handleGalleryDragDrop}
                   className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors mb-4"
                 >
                   <input
                     type="file"
                     id="gallery-upload"
                     accept="image/*"
                     multiple
                     onChange={handleGalleryFileSelect}
                     className="hidden"
                   />
                   <label htmlFor="gallery-upload" className="cursor-pointer">
                     <div className="text-sm text-muted-foreground">
                       <p className="font-medium mb-1">Drag and drop gallery photos here</p>
                       <p>or click to select multiple files</p>
                     </div>
                   </label>
                 </div>

                 {galleryPreviews.length > 0 && (
                   <div>
                     <p className="text-sm font-medium mb-3">Selected Photos ({galleryPreviews.length})</p>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                       {galleryPreviews.map((preview, index) => (
                         <div key={index} className="relative group">
                           <Image
                             src={preview}
                             alt={`Gallery preview ${index + 1}`}
                             width={150}
                             height={150}
                             className="w-full h-40 object-cover rounded-lg border"
                           />
                           <button
                             type="button"
                             onClick={() => removeGalleryFile(index)}
                             className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X className="w-4 h-4" />
                           </button>
                           <p className="text-xs text-muted-foreground mt-1 text-center">Foto {index + 1}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
                </div>
              </FormSection>
            </SectionCard>

         <FormActions>
           <Button
             type="submit"
             disabled={submitting || isLoading || uploadingGallery}
             className="w-full"
           >
             {submitting || isLoading ? 'Saving...' : uploadingGallery ? 'Uploading gallery...' : `${initialData ? 'Update' : 'Create'} Destination`}
           </Button>
         </FormActions>
      </div>
    </form>
  );
}
