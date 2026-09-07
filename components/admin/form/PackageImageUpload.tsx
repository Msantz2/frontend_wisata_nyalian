'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PackageImageUploadProps {
  value: File | string | null; // File object or URL string
  onChange: (file: File | null) => void;
  label?: string;
  required?: boolean;
}

export function PackageImageUpload({
  value,
  onChange,
  label = 'Gambar Paket',
  required = false,
}: PackageImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Format gambar tidak valid. Gunakan JPG, PNG, WEBP, atau GIF.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('Ukuran gambar maksimal 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {preview ? (
        <div className="relative w-full h-64 border rounded-lg overflow-hidden group">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              onClick={handleClick}
              size="sm"
              variant="secondary"
            >
              <Upload className="w-4 h-4 mr-1" />
              Ganti
            </Button>
            <Button
              type="button"
              onClick={handleRemove}
              size="sm"
              variant="destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full h-64 border-2 border-dashed rounded-lg hover:border-primary hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
        >
          <ImageIcon className="w-12 h-12" />
          <p className="text-sm font-medium">Klik untuk upload gambar</p>
          <p className="text-xs">JPG, PNG, WEBP, atau GIF (Max 5MB)</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        Gambar akan di-optimize otomatis oleh Cloudinary. Tidak perlu thumbnail terpisah.
      </p>
    </div>
  );
}
