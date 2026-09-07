'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoadingState } from '@/components/admin/states/LoadingState';
import { ErrorState } from '@/components/admin/states/ErrorState';
import { DestinasiForm } from '@/components/admin/DestinasiForm';
import { destinasiService } from '@/lib/api/destinasi';
import type { DestinasiResponse } from '@/lib/api/types';
import type { UpdateDestinasiPayload } from '@/lib/api/destinasi';

export default function EditDestinasiPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [destinasi, setDestinasi] = useState<DestinasiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinasi = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await destinasiService.getById(id);

        if (response.success) {
          setDestinasi(response.data);
        } else {
          setError(response.message || 'Failed to load destination');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load destination');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestinasi();
    }
  }, [id]);

  const handleSubmit = async (payload: UpdateDestinasiPayload) => {
    try {
      setSubmitError(null);
      await destinasiService.update(id, payload);
      router.push('/admin/destinasi');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update destination');
    }
  };

  if (loading) {
    return <LoadingState count={8} />;
  }

  if (error && !destinasi) {
    return <ErrorState title="Failed to load destination" description={error} />;
  }

  return (
    <div>
      <PageHeader>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PageTitle>Edit Destination</PageTitle>
        </div>
      </PageHeader>

      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{submitError}</p>
        </div>
      )}

      {destinasi && (
        <DestinasiForm
          initialData={destinasi}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      )}
    </div>
  );
}
