'use client';

import { useState } from 'react';
import { SectionCard } from '@/components/admin/shared/SectionCard';
import { FormSection } from '@/components/admin/form/FormSection';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ArticleSeo } from '@/lib/modules/articles/schema';

interface SEOEditorProps {
  seo?: ArticleSeo;
  onChange: (seo: ArticleSeo) => void;
  title: string;
  excerpt: string;
  coverImage?: string;
  slug: string;
}

/**
 * SEO Editor Component
 * Per 16-article-seo.md and 13-article-editor.md Section 3
 * Collapsible section with optional SEO fields
 * Reuses existing Zod validation (ArticleSeoSchema)
 */
export function SEOEditor({
  seo,
  onChange,
  title,
  excerpt,
  coverImage,
  slug,
}: SEOEditorProps) {
  const [expanded, setExpanded] = useState(false);

  const currentSeo: ArticleSeo = seo || { noIndex: false };

  const handleChange = (updates: Partial<ArticleSeo>) => {
    onChange({ ...currentSeo, ...updates });
  };

  // Per 16-article-seo.md Section 3: Fallback values
  const displayCanonicalUrl = currentSeo.canonicalUrl || `/articles/${slug}`;

  return (
    <SectionCard>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between hover:bg-muted/50 p-3 -m-3 rounded"
      >
        <h3 className="font-semibold">SEO Metadata</h3>
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {expanded && (
        <FormSection className="pt-0 border-t mt-3">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Meta Title</label>
            <Input
              value={currentSeo.metaTitle || ''}
              onChange={(e) => handleChange({ metaTitle: e.target.value || null })}
              placeholder={title}
              maxLength={200}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Optional. Falls back to article title if empty.
              </p>
              <p className="text-xs text-muted-foreground">
                {(currentSeo.metaTitle || '').length} / 200
              </p>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              💡 Recommended: ~60 characters for search engine display
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Meta Description</label>
            <Textarea
              value={currentSeo.metaDescription || ''}
              onChange={(e) => handleChange({ metaDescription: e.target.value || null })}
              placeholder={excerpt}
              maxLength={500}
              rows={2}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Optional. Falls back to article excerpt if empty.
              </p>
              <p className="text-xs text-muted-foreground">
                {(currentSeo.metaDescription || '').length} / 500
              </p>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              💡 Recommended: 155–160 characters for search engine display
            </p>
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-sm font-medium mb-2">OG Image (Social Share)</label>
            <Input
              value={currentSeo.ogImage || ''}
              onChange={(e) => handleChange({ ogImage: e.target.value || null })}
              placeholder={coverImage || '(falls back to cover image)'}
              disabled
            />
            <p className="text-xs text-muted-foreground mt-1">
              Automatically set to cover image. Custom override via Media Library in Phase 4.6+
            </p>
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Canonical URL</label>
            <Input
              type="url"
              value={currentSeo.canonicalUrl || ''}
              onChange={(e) => handleChange({ canonicalUrl: e.target.value || null })}
              placeholder={displayCanonicalUrl}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional. Use if content is syndicated from or duplicated elsewhere.
            </p>
          </div>

          {/* No Index */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
            <div>
              <label className="text-sm font-medium block">Prevent Indexing</label>
              <p className="text-xs text-muted-foreground">
                Tell search engines not to index this article
              </p>
            </div>
            <Switch
              checked={currentSeo.noIndex || false}
              onCheckedChange={(checked) => handleChange({ noIndex: checked })}
            />
          </div>
        </FormSection>
      )}
    </SectionCard>
  );
}
