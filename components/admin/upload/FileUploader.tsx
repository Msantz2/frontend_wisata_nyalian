'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
  preview?: boolean;
  className?: string;
}

function isAccepted(fileType: string, accept: string): boolean {
  const acceptPatterns = accept.split(',').map((p) => p.trim());
  return acceptPatterns.some((pattern) => {
    if (pattern === '*/*') return true;
    if (pattern.endsWith('/*')) {
      const type = pattern.replace('/*', '');
      return fileType.startsWith(type);
    }
    return fileType === pattern;
  });
}

export function FileUploader({
  accept,
  maxSize,
  onFilesSelected,
  onError,
  multiple = false,
  preview = true,
  className,
}: FileUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (accept && !isAccepted(file.type, accept)) {
        onError?.(`File type not accepted: ${file.type}`);
        return;
      }

      if (maxSize && file.size > maxSize) {
        const sizeMb = (file.size / 1024 / 1024).toFixed(2);
        onError?.(`File too large: ${sizeMb}MB`);
        return;
      }

      if (preview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }

    onFilesSelected(fileArray);
  };

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex items-center justify-center w-full">
        <label className="w-full cursor-pointer">
          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload {multiple ? 'files' : 'a file'}
              </p>
            </div>
            <Input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>
      </div>

      {previewUrl && preview && (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt="File preview"
            width={300}
            height={200}
            className="max-w-sm h-auto rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}
