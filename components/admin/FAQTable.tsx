'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/admin/display/StatusBadge';
import { ConfirmDialog } from '@/components/admin/dialog/ConfirmDialog';
import type { FAQ } from '@/types/faq';

interface FAQTableProps {
  data: FAQ[];
  isLoading: boolean;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: number) => Promise<void>;
}

export function FAQTable({ data, isLoading, onEdit, onDelete }: FAQTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; pertanyaan: string } | null>(null);
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
        <p className="text-muted-foreground">No FAQs found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Kategori</th>
              <th className="px-4 py-3 text-left font-medium">Pertanyaan</th>
              <th className="px-4 py-3 text-left font-medium">Unggulan</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Urutan</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((faq) => (
              <tr
                key={faq.id_faq}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium">{faq.kategori}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    title={faq.pertanyaan}
                    className="text-muted-foreground"
                  >
                    {truncateText(faq.pertanyaan, 50)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {faq.featured && (
                    <StatusBadge variant="success">Unggulan</StatusBadge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    variant={faq.is_active ? 'success' : 'neutral'}
                  >
                    {faq.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground">{faq.urutan}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(faq)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDeleteConfirm({
                          id: faq.id_faq,
                          pertanyaan: faq.pertanyaan,
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
          title="Delete FAQ"
          description={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
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
