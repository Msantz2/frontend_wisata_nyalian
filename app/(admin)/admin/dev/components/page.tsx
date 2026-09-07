'use client';

import { useState } from 'react';
import { LayoutDashboard, Trash2, Plus } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageDescription,
  Section,
  LoadingState,
  EmptyState,
  ErrorState,
  FormSection,
  FormActions,
  StatusBadge,
  ConfirmDialog,
  DataTable,
  SearchBox,
  FileUploader,
} from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ColumnDef } from '@/components/admin/table/types';

export default function ComponentsDemoPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const demoColumns: ColumnDef[] = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <StatusBadge
          variant={String(value) === 'active' ? 'success' : 'warning'}
        >
          {String(value)}
        </StatusBadge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (value) => {
        if (typeof value === 'string') {
          return new Date(value).toLocaleDateString();
        }
        return String(value);
      },
    },
  ];

  const demoData = [
    {
      id: 1,
      title: 'Sample Article 1',
      status: 'active',
      date: '2024-01-01',
    },
    {
      id: 2,
      title: 'Sample Article 2',
      status: 'inactive',
      date: '2024-01-02',
    },
    {
      id: 3,
      title: 'Sample Article 3',
      status: 'active',
      date: '2024-01-03',
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <PageHeader>
        <PageTitle icon={<LayoutDashboard />}>
          Component Library Demo
        </PageTitle>
        <PageDescription>
          Internal showcase of all Phase 3 shared components. This page is for
          development only and demonstrates each component in isolation and in
          composition.
        </PageDescription>
      </PageHeader>

      <Section title="Feedback Components">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Loading State</h4>
            <LoadingState count={3} />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Empty State</h4>
            <EmptyState
              title="No items found"
              description="Try adding something new to get started"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Error State</h4>
            <ErrorState
              title="Something went wrong"
              description="We encountered an error while loading your data"
            />
          </div>
        </div>
      </Section>

      <Section title="Layout Components">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This entire demo page uses PageHeader, Section, and other layout
            components in composition.
          </p>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-mono">
              &lt;PageHeader&gt;
              <br />
              &nbsp;&nbsp;&lt;PageTitle icon=...&gt;...&lt;/PageTitle&gt;
              <br />
              &nbsp;&nbsp;&lt;PageDescription&gt;...&lt;/PageDescription&gt;
              <br />
              &lt;/PageHeader&gt;
            </p>
          </div>
        </div>
      </Section>

      <Section title="Form Components">
        <form className="space-y-4">
          <FormSection title="Article Information">
            <div className="space-y-3">
              <Input placeholder="Title" />
              <textarea
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Description"
                rows={4}
              />
            </div>
          </FormSection>

          <FormSection title="Settings">
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border rounded-md text-sm">
                <option>Select status...</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </FormSection>

          <FormActions>
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </FormActions>
        </form>
      </Section>

      <Section title="Display Components - Status Badges">
        <div className="flex flex-wrap gap-3">
          <StatusBadge variant="success">Success</StatusBadge>
          <StatusBadge variant="warning">Warning</StatusBadge>
          <StatusBadge variant="danger">Danger</StatusBadge>
          <StatusBadge variant="neutral">Neutral</StatusBadge>
          <StatusBadge variant="info">Info</StatusBadge>
        </div>
      </Section>

      <Section title="Dialog Components - Confirm Dialog">
        <div>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Item
          </Button>
        </div>

        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete item?"
          description="This action cannot be undone. This will permanently delete the item."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => {
            setDeleteDialogOpen(false);
            alert('Item deleted');
          }}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </Section>

      <Section title="Table Foundation - Data Table">
        <DataTable columns={demoColumns} data={demoData} />
      </Section>

      <Section title="Search Foundation - Search Box">
        <div className="space-y-4">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search articles..."
            onClear={() => setSearch('')}
          />
          {search && (
            <p className="text-sm text-muted-foreground">
              Searching for: <strong>{search}</strong>
            </p>
          )}
        </div>
      </Section>

      <Section title="File Uploader Foundation">
        <FileUploader
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          onFilesSelected={(files) => {
            setUploadedFiles(files.map((f) => f.name));
            alert(`${files.length} file(s) selected`);
          }}
          onError={(error) => alert(`Error: ${error}`)}
          preview={true}
        />
        {uploadedFiles.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted">
            <p className="text-sm font-semibold mb-2">Selected files:</p>
             <ul className="text-sm space-y-1">
               {uploadedFiles.map((name, i) => (
                 <li key={`file-${i}-${name}`}>• {name}</li>
               ))}
             </ul>
          </div>
        )}
      </Section>

      <Section title="Complete Form Example">
        <form className="space-y-4">
          <FormSection
            title="Create New Article"
            description="Fill in the details below to create a new article"
          >
            <div className="space-y-3">
              <Input placeholder="Article title" />
              <textarea
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Article content"
                rows={6}
              />
              <select className="w-full px-3 py-2 border rounded-md text-sm">
                <option>Select category...</option>
                <option>News</option>
                <option>Guide</option>
                <option>Tutorial</option>
              </select>
            </div>
          </FormSection>

          <FormSection title="Featured Image">
            <FileUploader
              accept="image/*"
              maxSize={3 * 1024 * 1024}
              onFilesSelected={(files) => alert(`Uploaded: ${files[0]?.name}`)}
              preview={true}
            />
          </FormSection>

          <FormActions>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </FormActions>
        </form>
      </Section>

      <Section>
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Demo page for development only. Not listed in sidebar navigation.
          </p>
        </div>
      </Section>
    </div>
  );
}
