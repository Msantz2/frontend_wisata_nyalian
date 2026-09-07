'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  slug: string;
  type: 'cover' | 'content';
  currentImageUrl?: string;
  currentAltText?: string;
  onUpload: (url: string, alt: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

/**
 * Image Uploader Component - Phase 4.6.1 Improvements
 * Per 14-article-image.md and 13-article-editor.md Section 9
 * Per Phase 4.6.1: Hide manual path entry, show only upload/preview/remove
 * 
 * Reusable for both cover image and inline editor images
 * Uses same upload pipeline (Sharp processing, WebP conversion, 5MB limit)
 * Image paths are internal state only (hidden from users)
 */
export function ImageUploader({
  slug,
  type,
  currentImageUrl,
  currentAltText,
  onUpload,
  onRemove,
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [tempAltText, setTempAltText] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setUploading(true);

      // Client-side validation before upload
      const maxSizeBytes = 5 * 1024 * 1024; // 5 MB per 14-article-image.md §2.1
      if (file.size > maxSizeBytes) {
        throw new Error(`File size exceeds 5 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      }

      // Validate file type by extension (server will validate by magic number)
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}. Supported: JPEG, PNG, WebP`);
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

       // Upload via API per 20-api-articles.md Section 9
       // Generate temporary slug if article not yet saved
       const uploadSlug = slug || `temp-${Date.now()}`;
       
       const formData = new FormData();
       formData.append('file', file);
       formData.append('slug', uploadSlug);
       formData.append('type', type);
       formData.append('alt', tempAltText);

       const response = await fetch('/api/admin/articles/upload-image', {
         method: 'POST',
         body: formData,
       });

       if (!response.ok) {
         // Try to parse as JSON first, fall back to text for debugging
         let errorMessage = 'Upload failed';
         const contentType = response.headers.get('content-type');
         
         if (contentType?.includes('application/json')) {
           try {
             const errorData = await response.json();
             errorMessage = errorData.message || 'Upload failed';
           } catch {
             errorMessage = `Server error: ${response.status}`;
           }
         } else {
           errorMessage = `Server error: ${response.status} (${response.statusText})`;
         }
         
         throw new Error(errorMessage);
       }

       const data = await response.json();

      // Callback with uploaded URL and alt text
      // Per Phase 4.6.1: Image path is internal state, not shown to user
      onUpload(data.data.url, tempAltText);
      setTempAltText('');
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2 text-red-800 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Upload Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Current Image Preview */}
      {currentImageUrl ? (
        <div className="space-y-3">
          {/* Preview Image - Per Phase 4.6.1: Show only preview, hide path */}
          <div className="relative bg-muted rounded p-3 aspect-video flex items-center justify-center overflow-hidden">
            <Image
              src={currentImageUrl}
              alt="Preview"
              width={400}
              height={225}
              className="max-w-full max-h-full object-cover"
            />
          </div>

           {/* Alt Text Input - Per 14-article-image.md §7 and §8: Optional but recommended */}
           <div>
             <label className="block text-sm font-medium mb-2">
               Image Alt Text {type === 'cover' && '(recommended for SEO)'}
             </label>
             <Input
               value={currentAltText || ''}
               onChange={(e) => {
                 const newAlt = e.target.value;
                 onUpload(currentImageUrl, newAlt);
               }}
               placeholder="Describe the image for accessibility"
               disabled={uploading}
               maxLength={200}
             />
             <div className="flex justify-between mt-1">
               <p className="text-xs text-muted-foreground">
                 Shown if image fails to load. Important for screen readers.
               </p>
               <p className="text-xs text-muted-foreground">
                 {(currentAltText || '').length} / 200
               </p>
             </div>
           </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <label className="flex-1">
              <Button className="w-full" disabled={uploading || disabled} asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Replace Image'}
                </span>
              </Button>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                disabled={uploading || disabled}
                className="hidden"
                aria-label="Upload replacement image"
              />
            </label>
            {onRemove && (
              <Button
                variant="outline"
                onClick={onRemove}
                disabled={uploading || disabled}
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : preview ? (
        /* New preview during upload */
        <div className="space-y-3">
          <div className="relative bg-muted rounded p-3 aspect-video flex items-center justify-center overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={225}
              className="max-w-full max-h-full object-cover"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image Alt Text {type === 'cover' && '(recommended for SEO)'}
            </label>
            <Input
              value={tempAltText}
              onChange={(e) => setTempAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
              disabled={uploading}
              maxLength={200}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                Shown if image fails to load. Important for screen readers.
              </p>
              <p className="text-xs text-muted-foreground">
                {tempAltText.length} / 200
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <label className="flex-1">
              <Button className="w-full" disabled={uploading || disabled} asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Replace Image'}
                </span>
              </Button>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                disabled={uploading || disabled}
                className="hidden"
                aria-label="Upload replacement image"
              />
            </label>
            {onRemove && (
              <Button
                variant="outline"
                onClick={onRemove}
                disabled={uploading || disabled}
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* No Image Yet */
        <label>
          <Button
            className="w-full"
            variant="outline"
            disabled={uploading || disabled}
            asChild
          >
            <span>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </span>
          </Button>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading || disabled}
            className="hidden"
            aria-label="Upload image"
          />
        </label>
      )}

      {/* Help Text - Per Phase 4.6.1: Hide path info, show only format/size limits */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
        <p className="font-medium mb-1">Supported formats</p>
        <ul className="text-xs space-y-0.5">
          <li>• JPG, PNG, or WebP</li>
          <li>• Maximum 5 MB</li>
          <li>• Images are automatically optimized and converted to WebP</li>
          {type === 'cover' && <li>• Recommended: at least 1200×675 pixels</li>}
        </ul>
      </div>
    </div>
  );
}
