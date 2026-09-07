'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { DataTable } from '@/components/admin/table/DataTable';
import type { ColumnDef } from '@/components/admin/table/types';
import { StatusBadge } from '@/components/admin/display/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Star } from 'lucide-react';
import { paketService, kategoriPaketService } from '@/lib/api';
import type { PaketWisataResponse, KategoriPaketResponse } from '@/lib/api/types';
import { formatCurrency } from '@/utils/formatCurrency';

export default function PackagesTable() {
  const router = useRouter();
  const [packages, setPackages] = useState<PaketWisataResponse[]>([]);
  const [categories, setCategories] = useState<KategoriPaketResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packagesRes, categoriesRes] = await Promise.all([
          paketService.list(),
          kategoriPaketService.list(),
        ]);
        setPackages(packagesRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Failed to load packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const matchSearch = pkg.nama_paket.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || pkg.id_kategori?.toString() === categoryFilter;
    const matchStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && pkg.is_active) ||
      (statusFilter === 'inactive' && !pkg.is_active);
    return matchSearch && matchCategory && matchStatus;
  });

  // Delete handler
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Yakin ingin menghapus paket "${nama}"?`)) return;

    try {
      await paketService.delete(id);
      setPackages(packages.filter((pkg) => pkg.id_paket !== id));
      alert('Paket berhasil dihapus!');
    } catch (error) {
      console.error('Failed to delete package:', error);
      alert('Gagal menghapus paket. Silakan coba lagi.');
    }
  };

  // Table columns
  const columns: ColumnDef[] = [
    {
      key: 'gambar',
      header: 'Gambar',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            {pkg.url_gambar_cdn ? (
              <Image
                src={pkg.url_gambar_cdn}
                alt={pkg.nama_paket}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'nama_paket',
      header: 'Nama Paket',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <div>
            <p className="font-medium">{pkg.nama_paket}</p>
            <p className="text-xs text-muted-foreground">{pkg.slug}</p>
            {pkg.featured && (
              <Badge variant="secondary" className="mt-1">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'kategori',
      header: 'Kategori',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <span className="text-sm">
            {pkg.kategori_paket?.nama_kategori || '-'}
          </span>
        );
      },
    },
    {
      key: 'harga',
      header: 'Harga/Pax',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <span className="font-medium">{formatCurrency(pkg.harga_per_pax)}</span>
        );
      },
    },
    {
      key: 'durasi',
      header: 'Durasi',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <span className="text-sm">{pkg.durasi || '-'}</span>
        );
      },
    },
    {
      key: 'kuota',
      header: 'Kuota',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <span className="text-sm">{pkg.kuota_default}</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <StatusBadge variant={pkg.is_active ? 'success' : 'neutral'}>
            {pkg.is_active ? 'Aktif' : 'Nonaktif'}
          </StatusBadge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (_: unknown, row: Record<string, unknown>) => {
        const pkg = row as unknown as PaketWisataResponse;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/admin/packages/${pkg.id_paket}/edit`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(pkg.id_paket, pkg.nama_paket)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari paket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id_kategori} value={cat.id_kategori.toString()}>
                {cat.nama_kategori}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <Link href="/admin/packages/categories">
          <Button variant="outline">Kelola Kategori</Button>
        </Link>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredPackages as unknown as Record<string, unknown>[]}
        loading={loading}
        emptyMessage="Belum ada paket wisata. Klik 'Tambah Paket' untuk membuat yang pertama."
      />

      {/* Summary */}
      <p className="text-sm text-muted-foreground">
        Menampilkan {filteredPackages.length} dari {packages.length} paket
      </p>
    </div>
  );
}
