'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoadingState } from '@/components/admin/states/LoadingState';
import { ErrorState } from '@/components/admin/states/ErrorState';
import { FAQForm } from '@/components/admin/FAQForm';
import { faqService } from '@/lib/api/faq';
import type { FAQ, UpdateFAQPayload } from '@/types/faq';

export default function EditFAQPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await faqService.getById(id);

        if (response.success) {
          setFaq(response.data);
        } else {
          setError(response.message || 'Failed to load FAQ');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load FAQ');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFAQ();
    }
  }, [id]);

  const handleSubmit = async (payload: UpdateFAQPayload) => {
    try {
      setSubmitError(null);
      await faqService.update(id, payload);
      router.push('/admin/faq');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to update FAQ');
    }
  };

  if (loading) {
    return <LoadingState count={8} />;
  }

  if (error && !faq) {
    return <ErrorState title="Failed to load FAQ" description={error} />;
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
          <PageTitle>Edit FAQ</PageTitle>
        </div>
      </PageHeader>

      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{submitError}</p>
        </div>
      )}

      {faq && (
        <FAQForm
          initialData={faq}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      )}
    </div>
  );
}
