'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormSection } from '@/components/admin/form/FormSection';
import { FormActions } from '@/components/admin/form/FormActions';
import { LoadingState } from '@/components/admin/states/LoadingState';
import { ErrorState } from '@/components/admin/states/ErrorState';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { StatusBadge } from '@/components/admin/display/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Check } from 'lucide-react';
import type { FullArticle, ArticleSeo } from '@/lib/modules/articles/schema';
import { RichTextEditor } from './components/RichTextEditor';
import { ImageUploader } from './components/ImageUploader';
import { SEOEditor } from './components/SEOEditor';
import { useUnsavedChanges } from './hooks/useUnsavedChanges';
import ReactMarkdown from 'react-markdown';

interface ArticleFormProps {
  mode: 'create' | 'edit';
  articleId?: string;
  onSuccess: () => void;
}

/**
 * Article Form Component - Phase 4.6 Stabilization
 * Per 12-articles.md Section 5 (CRUD Lifecycle)
 * Per 13-article-editor.md (Two-column layout, Tiptap, SEO, Preview, Unsaved changes)
 * Per 14-article-image.md (Image upload pipeline)
 * Per 15-article-publishing.md (Publish/unpublish controls)
 * Per 16-article-seo.md (SEO metadata)
 * Per 17-article-validation.md (Validation)
 */
export function ArticleForm({ mode, articleId, onSuccess }: ArticleFormProps) {
  const router = useRouter();

  // State
  const [article, setArticle] = useState<FullArticle | null>(null);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [seo, setSeo] = useState<ArticleSeo | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [readTime, setReadTime] = useState('');

  // Track original values for unsaved changes detection
  const [originalValues, setOriginalValues] = useState<Record<string, unknown>>({});
  const hasChanges = JSON.stringify({
    title,
    slug,
    category,
    excerpt,
    author,
    content,
    coverImage,
    coverImageAlt,
    status,
    seo,
    tags,
    featured,
    readTime,
  }) !== JSON.stringify(originalValues);

  useUnsavedChanges(hasChanges);

  // Load article in edit mode
  useEffect(() => {
    if (mode === 'edit' && articleId) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(`/api/admin/articles/${articleId}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load article');
          }

           const data = await response.json();
           const loadedArticle = data.data;

           setArticle(loadedArticle);
           setTitle(loadedArticle.title);
           setSlug(loadedArticle.slug);
           setCategory(loadedArticle.category);
           setExcerpt(loadedArticle.excerpt);
           setAuthor(loadedArticle.author || '');
           setContent(loadedArticle.content);
           setCoverImage(loadedArticle.coverImage);
           setCoverImageAlt(loadedArticle.coverImageAlt || '');
           setStatus(loadedArticle.status);
           setSeo(loadedArticle.seo);
           setTags(loadedArticle.tags || []);
           setFeatured(loadedArticle.featured || false);
           setReadTime(loadedArticle.readTime || '');

          // Store original for unsaved changes detection
          setOriginalValues({
            title: loadedArticle.title,
            slug: loadedArticle.slug,
            category: loadedArticle.category,
            excerpt: loadedArticle.excerpt,
            author: loadedArticle.author || '',
            content: loadedArticle.content,
            coverImage: loadedArticle.coverImage,
            coverImageAlt: loadedArticle.coverImageAlt || '',
            status: loadedArticle.status,
            seo: loadedArticle.seo,
            tags: loadedArticle.tags || [],
            featured: loadedArticle.featured || false,
            readTime: loadedArticle.readTime || '',
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load article');
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [mode, articleId]);

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slugManuallyEdited) {
      const generated = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Handle image upload (both cover and inline)
  const handleImageUpload = async (file: File, type: 'cover' | 'content'): Promise<string> => {
    // Generate temporary slug if article not yet saved
    const uploadSlug = slug || `temp-${Date.now()}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', uploadSlug);
    formData.append('type', type);
    formData.append('alt', type === 'cover' ? coverImageAlt : '');

    const response = await fetch('/api/admin/articles/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Upload failed');
    }

    const data = await response.json();
    return data.data.url;
  };

  // Save article
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setValidationErrors({});

      const formData = {
        title,
        slug,
        category,
        excerpt: excerpt || '',
        author: author || '',
        content: content || '',
        coverImage: coverImage || '',
        coverImageAlt: coverImageAlt || '',
        status,
        seo: seo || undefined,
        tags: tags || [],
        featured: featured || false,
        readTime: readTime || '',
      };

      const url = mode === 'create' ? '/api/admin/articles' : `/api/admin/articles/${articleId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errors: Record<string, string> = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
          setValidationErrors(errors);
        }
        throw new Error(data.message || 'Failed to save article');
      }

      // Update original values for unsaved detection
      setOriginalValues({
        title,
        slug,
        category,
        excerpt,
        author,
        content,
        coverImage,
        coverImageAlt,
        status,
        seo,
        tags,
        featured,
        readTime,
      });

      // In create mode, redirect to edit mode
      if (mode === 'create') {
        router.push(`/admin/articles/${data.data.id}/edit`);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  // Per 15-article-publishing.md Section 4: Publish article
  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError(null);
      setValidationErrors({});

      const response = await fetch(`/api/admin/articles/${articleId}/publish`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errors: Record<string, string> = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
          setValidationErrors(errors);
        }
        throw new Error(data.message || 'Failed to publish article');
      }

      setStatus('published');
      setArticle(data.data);
      setOriginalValues({
        title,
        slug,
        category,
        excerpt,
        author,
        content,
        coverImage,
        coverImageAlt,
        status: 'published',
        seo,
        tags,
        featured,
        readTime,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish article');
    } finally {
      setPublishing(false);
    }
  };

  // Per 15-article-publishing.md Section 5: Unpublish article
  const handleUnpublish = async () => {
    try {
      setPublishing(true);
      setError(null);
      setValidationErrors({});

      const response = await fetch(`/api/admin/articles/${articleId}/unpublish`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errors: Record<string, string> = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
          setValidationErrors(errors);
        }
        throw new Error(data.message || 'Failed to unpublish article');
      }

      setStatus('draft');
      setArticle(data.data);
      setOriginalValues({
        title,
        slug,
        category,
        excerpt,
        author,
        content,
        coverImage,
        coverImageAlt,
        status: 'draft',
        seo,
        tags,
        featured,
        readTime,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish article');
    } finally {
      setPublishing(false);
    }
  };

  // Loading state for edit mode
  if (mode === 'edit' && loading) {
    return <LoadingState count={8} />;
  }

  // Error state for edit mode
  if (mode === 'edit' && error && !article) {
    return <ErrorState title="Failed to load article" description={error} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Unsaved Changes Indicator - Per Phase 4.6.1 */}
      {hasChanges && (
        <div className="lg:col-span-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <p>You have unsaved changes</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="lg:col-span-3 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title & Slug */}
        <SectionCard title="Basic Information">
          <FormSection>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium">Title *</label>
                <p className="text-xs text-muted-foreground">{title.length} / 150</p>
              </div>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title"
                maxLength={150}
                className={validationErrors.title ? 'border-red-500' : ''}
              />
              {validationErrors.title && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                }}
                placeholder="article-slug"
                className={validationErrors.slug ? 'border-red-500' : ''}
              />
              {validationErrors.slug && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Auto-generated from title. Editable before publishing.
              </p>
            </div>
          </FormSection>
        </SectionCard>

        {/* Excerpt */}
        <SectionCard title="Summary">
          <FormSection>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium">
                  Excerpt {status === 'published' ? '*' : ''}
                </label>
                <p className="text-xs text-muted-foreground">{excerpt.length} / 300</p>
              </div>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary of the article"
                rows={3}
                maxLength={300}
                className={validationErrors.excerpt ? 'border-red-500' : ''}
              />
              {validationErrors.excerpt && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.excerpt}</p>
              )}
              <p className="text-muted-foreground text-xs mt-1">
                Shown in article listings and used as SEO description if not overridden
              </p>
            </div>
          </FormSection>
        </SectionCard>

        {/* Rich Text Content Editor */}
        <SectionCard title="Content">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">
                Content {status === 'published' ? '*' : ''}
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                onImageUpload={handleImageUpload}
              />
              {validationErrors.content && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
              )}
            </div>
          </FormSection>
        </SectionCard>
      </div>

       {/* Side Panel */}
       <div className="space-y-6">
         {/* Status & Publishing Controls */}
         {mode === 'edit' ? (
           article ? (
             <SectionCard title="Status & Publishing">
               <FormSection>
                 <StatusBadge variant={status === 'published' ? 'success' : 'neutral'}>
                   {status.charAt(0).toUpperCase() + status.slice(1)}
                 </StatusBadge>
                 <p className="text-muted-foreground text-sm mt-3">
                   {status === 'draft'
                     ? 'This article is not yet published. Publish it to make it visible on the public site.'
                     : `Published on ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'unknown date'}`}
                 </p>
                  <div className="flex gap-2 mt-4">
                     {status === 'draft' ? (
                       <Button
                         onClick={handlePublish}
                         disabled={publishing || !articleId || !title || !slug || !category || !content || !coverImage || !coverImageAlt || !excerpt}
                         className="w-full"
                         variant="default"
                         title={
                           !articleId ? 'Article not loaded yet'
                           : !title ? 'Title required'
                           : !slug ? 'Slug required'
                           : !category ? 'Category required'
                           : !content ? 'Content required'
                           : !coverImage ? 'Cover image required'
                           : !coverImageAlt ? 'Cover image alt text required for accessibility'
                           : !excerpt ? 'Excerpt required'
                           : 'Publish article'
                         }
                       >
                         <Check className="w-4 h-4 mr-2" />
                         {publishing ? 'Publishing...' : 'Publish'}
                       </Button>
                     ) : (
                       <Button
                         onClick={handleUnpublish}
                         disabled={publishing || !articleId}
                         className="w-full"
                         variant="outline"
                         title={!articleId ? 'Article not loaded yet' : 'Unpublish article'}
                       >
                         Unpublish
                       </Button>
                     )}
                  </div>
               </FormSection>
             </SectionCard>
           ) : (
             <SectionCard title="Status & Publishing">
               <FormSection>
                 <p className="text-muted-foreground text-sm">Loading article...</p>
               </FormSection>
             </SectionCard>
           )
         ) : null}

         {/* Cover Image */}
         <SectionCard title="Cover Image">
           <FormSection>
             <ImageUploader
               slug={slug}
               type="cover"
               currentImageUrl={coverImage}
               currentAltText={coverImageAlt}
               onUpload={(url, alt) => {
                 setCoverImage(url);
                 setCoverImageAlt(alt);
               }}
               onRemove={() => {
                 setCoverImage('');
                 setCoverImageAlt('');
               }}
             />
             {validationErrors.coverImage && (
               <p className="text-red-500 text-sm mt-2">{validationErrors.coverImage}</p>
             )}
           </FormSection>
         </SectionCard>

        {/* Category & Author */}
        <SectionCard title="Details">
          <FormSection>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Culture, Events, Travel"
                className={validationErrors.category ? 'border-red-500' : ''}
              />
              {validationErrors.category && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name (optional)"
              />
            </div>
          </FormSection>
        </SectionCard>

        {/* SEO Metadata */}
        <SEOEditor
          seo={seo}
          onChange={setSeo}
          title={title}
          excerpt={excerpt}
          coverImage={coverImage}
          slug={slug}
        />

        {/* Preview & Save Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setPreviewing(!previewing)}
            disabled={!title || !content}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        {/* Save Actions */}
        <FormActions>
          <Button
            onClick={handleSave}
            disabled={saving || !title || !slug || !category}
            className="w-full"
          >
            {saving ? 'Saving...' : mode === 'create' ? 'Create Article' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            onClick={onSuccess}
            disabled={saving}
            className="w-full"
          >
            Cancel
          </Button>
        </FormActions>
      </div>

      {/* Preview Modal */}
      {previewing && (
        <div className="lg:col-span-3 fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              <Button variant="ghost" onClick={() => setPreviewing(false)}>
                ✕
              </Button>
            </div>
            <div className="prose prose-sm max-w-none">
              {coverImage && (
                <Image
                  src={coverImage}
                  alt={coverImageAlt}
                  width={800}
                  height={450}
                  className="w-full h-auto mb-4"
                />
              )}
              <p className="text-muted-foreground mb-4">{excerpt}</p>
              {/* Per 06-security.md Section 6: Use ReactMarkdown instead of dangerouslySetInnerHTML */}
              {/* Content is sanitized server-side before storage */}
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
