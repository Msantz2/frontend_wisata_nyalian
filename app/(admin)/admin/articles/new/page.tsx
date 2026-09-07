'use client';

import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { ArticleForm } from '../ArticleForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

/**
 * New Article Page
 * Per 12-articles.md Section 5.1 (Create)
 * Per 13-article-editor.md
 */
export default function NewArticlePage() {
  const router = useRouter();

  return (
    <div>
      {/* Page Header with Back Button */}
      <PageHeader>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PageTitle>New Article</PageTitle>
        </div>
      </PageHeader>

      {/* Article Form */}
      <ArticleForm mode="create" onSuccess={() => router.push('/admin/articles')} />
    </div>
  );
}
