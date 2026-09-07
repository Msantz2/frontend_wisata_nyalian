'use client';

import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { ArticleForm } from '../../ArticleForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

/**
 * Edit Article Page
 * Per 12-articles.md Section 5.3 (Update)
 * Per 13-article-editor.md
 */
export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
          <PageTitle>Edit Article</PageTitle>
        </div>
      </PageHeader>

      {/* Article Form in Edit Mode */}
      <ArticleForm mode="edit" articleId={id} onSuccess={() => router.push('/admin/articles')} />
    </div>
  );
}
