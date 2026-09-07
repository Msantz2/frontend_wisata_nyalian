'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { LoadingState } from '@/components/admin/states/LoadingState';
import { ErrorState } from '@/components/admin/states/ErrorState';
import { EmptyState } from '@/components/admin/states/EmptyState';
import { SearchBox } from '@/components/admin/search/SearchBox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DestinasiTable } from '@/components/admin/DestinasiTable';
import { destinasiService } from '@/lib/api/destinasi';
import type { DestinasiResponse } from '@/lib/api/types';

export default function DestinasiPage() {
  const router = useRouter();
  const [destinasi, setDestinasi] = useState<DestinasiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = searchQuery ? { search: searchQuery } : {};
        const response = await destinasiService.list(params);

        if (response.success) {
          setDestinasi(response.data);
        } else {
          setError(response.message || 'Failed to fetch destinations');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDestinasi, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      await destinasiService.delete(id);
      setDestinasi(destinasi.filter((d) => d.id_destinasi !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete destination');
    }
  };

  const handleEdit = (dest: DestinasiResponse) => {
    router.push(`/admin/destinasi/${dest.id_destinasi}/edit`);
  };

  return (
    <div>
      <PageHeader>
        <div className="flex items-center justify-between mb-6">
          <PageTitle>Destinasi</PageTitle>
          <Button onClick={() => router.push('/admin/destinasi/create')}>
            <Plus className="w-4 h-4 mr-2" />
            New Destination
          </Button>
        </div>
      </PageHeader>

      <div className="mb-6">
        <SearchBox
          placeholder="Search destinations by name..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {error && (
        <div className="space-y-4">
          <ErrorState 
            title="Failed to load destinations" 
            description={error} 
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
            <p className="font-medium mb-2">Troubleshooting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure the backend API server is running at <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:5000/api/v1</code></li>
              <li>Check your network connection</li>
              <li>Check browser console (F12) for detailed error messages</li>
              <li>Verify you are logged in to the admin dashboard</li>
            </ul>
          </div>
        </div>
      )}

      {loading && !error && <LoadingState count={5} />}

      {!loading && !error && destinasi.length === 0 && (
        <EmptyState
          title="No destinations yet"
          description="Create your first destination to get started."
        />
      )}

      {!loading && !error && destinasi.length > 0 && (
        <DestinasiTable
          data={destinasi}
          isLoading={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
