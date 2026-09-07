"use client";

import SearchInput from "@/components/shared/SearchInput";

interface FAQSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FAQSearch({ value, onChange }: FAQSearchProps) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder="Search questions..."
      />
    </div>
  );
}
