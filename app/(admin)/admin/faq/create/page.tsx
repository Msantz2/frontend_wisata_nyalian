'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FAQForm } from '@/components/admin/FAQForm';
import { faqService } from '@/lib/api/faq';
import type { CreateFAQPayload } from '@/types/faq';

export default function CreateFAQPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: CreateFAQPayload) => {
    try {
      setError(null);
      await faqService.create(payload);
      router.push('/admin/faq');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create FAQ');
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
          <PageTitle>New FAQ</PageTitle>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <FAQForm onSubmit={handleSubmit} />
    </div>
  );
}
