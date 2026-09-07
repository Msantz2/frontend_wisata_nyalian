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
import { FAQTable } from '@/components/admin/FAQTable';
import { faqService } from '@/lib/api/faq';
import type { FAQ } from '@/types/faq';

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = searchQuery ? { kategori: searchQuery } : {};
        const response = await faqService.list(params);

        if (response.success) {
          setFaqs(response.data);
        } else {
          setError(response.message || 'Failed to fetch FAQs');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchFAQs, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    try {
      await faqService.delete(id);
      setFaqs(faqs.filter((faq) => faq.id_faq !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete FAQ');
    }
  };

  const handleEdit = (faq: FAQ) => {
    router.push(`/admin/faq/${faq.id_faq}/edit`);
  };

  return (
    <div>
      <PageHeader>
        <div className="flex items-center justify-between mb-6">
          <PageTitle>FAQ</PageTitle>
          <Button onClick={() => router.push('/admin/faq/create')}>
            <Plus className="w-4 h-4 mr-2" />
            New FAQ
          </Button>
        </div>
      </PageHeader>

      <div className="mb-6">
        <SearchBox
          placeholder="Search FAQs by category..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {error && (
        <div className="space-y-4">
          <ErrorState 
            title="Failed to load FAQs" 
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

      {!loading && !error && faqs.length === 0 && (
        <EmptyState
          title="No FAQs yet"
          description="Create your first FAQ to get started."
        />
      )}

      {!loading && !error && faqs.length > 0 && (
        <FAQTable
          data={faqs}
          isLoading={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
