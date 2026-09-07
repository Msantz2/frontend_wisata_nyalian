"use client";

import { Badge } from "@/components/ui/badge";

interface FAQCategoryProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FAQCategory({
  categories,
  activeCategory,
  onCategoryChange,
}: FAQCategoryProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-8 -mx-4 px-4" role="group" aria-label="Filter FAQs by category">
      <Badge
        as="button"
        variant={activeCategory === "all" ? "default" : "outline"}
        className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90 hover:text-white min-h-[36px]"
        onClick={() => onCategoryChange("all")}
        aria-pressed={activeCategory === "all"}
      >
        All Categories
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          as="button"
          variant={activeCategory === category ? "default" : "outline"}
          className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90 hover:text-white min-h-[36px]"
          onClick={() => onCategoryChange(category)}
          aria-pressed={activeCategory === category}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
