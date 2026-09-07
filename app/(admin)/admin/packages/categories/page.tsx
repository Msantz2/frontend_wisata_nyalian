'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { PageDescription } from '@/components/admin/layout/PageDescription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/admin/table/DataTable';
import type { ColumnDef } from '@/components/admin/table/types';
import { StatusBadge } from '@/components/admin/display/StatusBadge';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { FormSection } from '@/components/admin/form/FormSection';
import Link from 'next/link';
import { kategoriPaketService } from '@/lib/api';
import type { KategoriPaketResponse } from '@/lib/api/types';
import { CreateKategoriPaketSchema } from '@/lib/modules/packages/schema';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<KategoriPaketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [namaKategori, setNamaKategori] = useState('');
  const [slug, setSlug] = useState('');
  const [deskripsiKategori, setDeskripsiKategori] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await kategoriPaketService.list();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setNamaKategori('');
    setSlug('');
    setDeskripsiKategori('');
    setIsActive(true);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  // Edit category
  const handleEdit = (category: KategoriPaketResponse) => {
    setNamaKategori(category.nama_kategori);
    setSlug(category.slug);
    setDeskripsiKategori(category.deskripsi_kategori || '');
    setIsActive(category.is_active);
    setEditingId(category.id_kategori);
    setShowForm(true);
  };

  // Save category
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Generate slug from nama_kategori if empty
      const generatedSlug = slug.trim() || namaKategori
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

      // Validate
      const validation = CreateKategoriPaketSchema.safeParse({
        nama_kategori: namaKategori,
        slug: generatedSlug,
        deskripsi_kategori: deskripsiKategori,
        is_active: isActive,
      });

      if (!validation.success) {
        setError(validation.error.issues[0].message);
        return;
      }

      const payload = validation.data;

      if (editingId) {
        await kategoriPaketService.update(editingId, payload);
        alert('Kategori berhasil diupdate!');
      } else {
        await kategoriPaketService.create(payload);
        alert('Kategori berhasil dibuat!');
      }

      await fetchCategories();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan kategori');
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${nama}"?`)) return;

    try {
      await kategoriPaketService.delete(id);
      setCategories(categories.filter((cat) => cat.id_kategori !== id));
      alert('Kategori berhasil dihapus!');
    } catch (err) {
      alert('Gagal menghapus kategori. Mungkin masih ada paket yang menggunakan kategori ini.');
    }
  };

  // Table columns
  const columns: ColumnDef[] = [
    {
      key: 'nama_kategori',
      header: 'Nama Kategori',
      render: (_: unknown, row: Record<string, unknown>) => {
        const cat = row as unknown as KategoriPaketResponse;
        return (
          <div>
            <p className="font-medium">{cat.nama_kategori}</p>
            <p className="text-xs text-muted-foreground">{cat.slug}</p>
          </div>
        );
      },
    },
    {
      key: 'deskripsi',
      header: 'Deskripsi',
      render: (_: unknown, row: Record<string, unknown>) => {
        const cat = row as unknown as KategoriPaketResponse;
        return (
          <p className="text-sm line-clamp-2">{cat.deskripsi_kategori || '-'}</p>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (_: unknown, row: Record<string, unknown>) => {
        const cat = row as unknown as KategoriPaketResponse;
        return (
          <StatusBadge variant={cat.is_active ? 'success' : 'neutral'}>
            {cat.is_active ? 'Aktif' : 'Nonaktif'}
          </StatusBadge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (_: unknown, row: Record<string, unknown>) => {
        const cat = row as unknown as KategoriPaketResponse;
        return (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(cat.id_kategori, cat.nama_kategori)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader>
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/packages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <PageTitle>Kategori Paket Wisata</PageTitle>
            <PageDescription>Kelola kategori untuk paket wisata</PageDescription>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="mt-6 space-y-6">
        {/* Form */}
        {showForm && (
          <SectionCard title={editingId ? 'Edit Kategori' : 'Kategori Baru'}>
             <FormSection>
               {error && (
                 <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm">
                   {error}
                 </div>
               )}

               <div>
                 <label className="text-sm font-medium">Nama Kategori *</label>
                 <Input
                   value={namaKategori}
                   onChange={(e) => setNamaKategori(e.target.value)}
                   placeholder="e.g., Adventure Tours"
                 />
               </div>

               <div>
                 <label className="text-sm font-medium">Slug *</label>
                 <Input
                   value={slug}
                   onChange={(e) => setSlug(e.target.value)}
                   placeholder="e.g., adventure-tours (auto-generated jika kosong)"
                 />
                 <p className="text-xs text-muted-foreground mt-1">
                   Jika kosong, akan di-generate otomatis dari nama kategori
                 </p>
               </div>

               <div>
                 <label className="text-sm font-medium">Deskripsi</label>
                 <Textarea
                   value={deskripsiKategori}
                   onChange={(e) => setDeskripsiKategori(e.target.value)}
                   placeholder="Deskripsi kategori..."
                   rows={3}
                 />
               </div>

               <div className="flex items-center justify-between">
                 <label className="text-sm font-medium">Aktif</label>
                 <Switch checked={isActive} onCheckedChange={setIsActive} />
               </div>

               <div className="flex gap-2">
                 <Button onClick={handleSave} disabled={saving || !namaKategori.trim()}>
                   {saving ? 'Menyimpan...' : 'Simpan'}
                 </Button>
                 <Button variant="outline" onClick={resetForm}>
                   Batal
                 </Button>
               </div>
             </FormSection>
          </SectionCard>
        )}

        {/* Table */}
        <DataTable
          columns={columns}
          data={categories as unknown as Record<string, unknown>[]}
          loading={loading}
          emptyMessage="Belum ada kategori. Klik 'Tambah Kategori' untuk membuat yang pertama."
        />
      </div>
    </div>
  );
}
