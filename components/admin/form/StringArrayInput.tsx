'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface StringArrayInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxItems?: number;
}

export function StringArrayInput({
  value,
  onChange,
  label,
  placeholder = 'Masukkan item...',
  required = false,
  maxItems,
}: StringArrayInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (maxItems && value.length >= maxItems) return;
    
    onChange([...value, trimmed]);
    setInputValue('');
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={maxItems ? value.length >= maxItems : false}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim() || (maxItems ? value.length >= maxItems : false)}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Tambah
        </Button>
      </div>

      {/* List */}
      {value.length > 0 && (
        <div className="space-y-2 mt-3">
          {value.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted rounded-md"
            >
              <span className="text-xs font-medium text-muted-foreground w-6">
                {index + 1}.
              </span>
              <span className="flex-1 text-sm">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-muted-foreground">
        {value.length} item{value.length !== 1 ? 's' : ''}
        {maxItems && ` (maksimal ${maxItems})`}
      </p>
    </div>
  );
}
