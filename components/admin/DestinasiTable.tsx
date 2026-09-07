'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/admin/display/StatusBadge';
import { ConfirmDialog } from '@/components/admin/dialog/ConfirmDialog';
import type { DestinasiResponse } from '@/lib/api/types';

interface DestinasiTableProps {
  data: DestinasiResponse[];
  isLoading: boolean;
  onEdit: (destinasi: DestinasiResponse) => void;
  onDelete: (id: number) => Promise<void>;
}

export function DestinasiTable({ data, isLoading, onEdit, onDelete }: DestinasiTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; nama_destinasi: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);
      await onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No destinations found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Nama Destinasi</th>
              <th className="px-4 py-3 text-left font-medium">Kategori</th>
              <th className="px-4 py-3 text-left font-medium">Lokasi</th>
              <th className="px-4 py-3 text-left font-medium">Harga Dewasa</th>
              <th className="px-4 py-3 text-left font-medium">Unggulan</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((destinasi) => (
              <tr
                key={destinasi.id_destinasi}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3">
                   <div>
                     <p className="font-medium">{destinasi.nama_destinasi}</p>
                     {destinasi.url_thumbnail_cdn && (
                       <Image
                         src={destinasi.url_thumbnail_cdn}
                         alt={`${destinasi.nama_destinasi} thumbnail`}
                         width={40}
                         height={40}
                         className="rounded mt-1 object-cover"
                       />
                     )}
                   </div>
                 </td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground text-xs bg-gray-100 px-2 py-1 rounded">
                    {destinasi.id_kategori}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span title={destinasi.kecamatan || ''} className="text-muted-foreground text-sm">
                    {truncateText(destinasi.kecamatan || 'N/A', 15)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">
                    {destinasi.harga_tiket_dewasa ? `Rp ${destinasi.harga_tiket_dewasa.toLocaleString('id-ID')}` : '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {destinasi.featured && (
                    <StatusBadge variant="success">Unggulan</StatusBadge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    variant={destinasi.is_active ? 'success' : 'neutral'}
                  >
                    {destinasi.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(destinasi)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDeleteConfirm({
                          id: destinasi.id_destinasi,
                          nama_destinasi: destinasi.nama_destinasi,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <ConfirmDialog
          open={!!deleteConfirm}
          title="Delete Destination"
          description={`Are you sure you want to delete "${deleteConfirm.nama_destinasi}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={deleting}
          variant="danger"
          confirmText="Delete"
        />
      )}
    </>
  );
}
