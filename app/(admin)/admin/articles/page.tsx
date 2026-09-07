'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { DataTable } from '@/components/admin/table/DataTable';
import { StatusBadge } from '@/components/admin/display/StatusBadge';
import { LoadingState } from '@/components/admin/states/LoadingState';
import { ErrorState } from '@/components/admin/states/ErrorState';
import { EmptyState } from '@/components/admin/states/EmptyState';
import { SearchBox } from '@/components/admin/search/SearchBox';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { ArticleListItem } from '@/lib/modules/articles/schema';
import { ConfirmDialog } from '@/components/admin/dialog/ConfirmDialog';

/**
 * Articles List Page
 * Per 12-articles.md Section 4 (List View)
 * Per 20-api-articles.md Section 3 (List Endpoint)
 */
export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Per 20-api-articles.md Section 3: GET /api/admin/articles
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        params.append('limit', '100'); // Fetch all for now (no pagination UI in Phase 4.4)

        const response = await fetch(`/api/admin/articles?${params}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch articles');
        }

        const data = await response.json();
        setArticles(data.data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchArticles, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Delete article
  const handleDelete = async (id: string) => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);

      // Per 20-api-articles.md Section 7: DELETE /api/admin/articles/[id]
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete article');
      }

      // Remove from local state
      setArticles(articles.filter((a) => a.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Column definitions for data table
  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (value: unknown) => <span className="font-medium">{String(value)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: unknown) => {
        const status = value as 'draft' | 'published';
        return (
          <StatusBadge variant={status === 'published' ? 'success' : 'neutral'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusBadge>
        );
      },
    },
    {
      key: 'category',
      header: 'Category',
      render: (value: unknown) => <span>{value ? String(value) : '—'}</span>,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (value: unknown) => <span className="text-muted-foreground">{formatDate(String(value))}</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (value: unknown, row: Record<string, unknown>) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/admin/articles/${String(value)}/edit`)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDeleteConfirm({ id: String(value), title: String(row.title) })}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <PageHeader>
        <div className="flex items-center justify-between mb-6">
          <PageTitle>Articles</PageTitle>
          <Button onClick={() => router.push('/admin/articles/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>
      </PageHeader>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBox
          placeholder="Search articles by title..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      {/* Error State */}
      {error && <ErrorState title="Failed to load articles" description={error} />}

      {/* Loading State */}
      {loading && !error && <LoadingState count={5} />}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <EmptyState
          title="No articles yet"
          description="Create your first article to get started."
        />
      )}

      {/* Data Table */}
      {!loading && !error && articles.length > 0 && (
        <DataTable columns={columns} data={articles} loading={false} />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          open={!!deleteConfirm}
          title="Delete Article"
          description={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
          isLoading={deleting}
          variant="danger"
          confirmText="Delete"
        />
      )}
    </div>
  );
}
