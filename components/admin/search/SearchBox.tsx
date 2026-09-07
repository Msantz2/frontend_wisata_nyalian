'use client';

import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className,
}: SearchBoxProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
