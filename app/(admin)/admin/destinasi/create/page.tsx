'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DestinasiForm } from '@/components/admin/DestinasiForm';
import { destinasiService } from '@/lib/api/destinasi';
import type { CreateDestinasiPayload } from '@/lib/api/destinasi';
import type { DestinasiResponse } from '@/lib/api/types';

export default function CreateDestinasiPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: CreateDestinasiPayload): Promise<DestinasiResponse | void> => {
    try {
      setError(null);
      const response = await destinasiService.create(payload);
      // Return the created destinasi data so form can use id_destinasi for gallery upload
      if (response.success && response.data) {
        return response.data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create destination';
      setError(errorMessage);
      throw err;
    }
  };

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
          <PageTitle>New Destination</PageTitle>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <DestinasiForm 
        onSubmit={handleSubmit}
        onSuccess={() => router.push('/admin/destinasi')}
      />
    </div>
  );
}
