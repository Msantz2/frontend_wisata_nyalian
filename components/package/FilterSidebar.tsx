"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PRICE_RANGE } from "@/lib/constants";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (range: string) => void;
  featuredOnly: boolean;
  onFeaturedOnlyChange: (featured: boolean) => void;
  categories: string[];
}

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  selectedDuration,
  onDurationChange,
  selectedPriceRange,
  onPriceRangeChange,
  featuredOnly,
  onFeaturedOnlyChange,
  categories,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
          Kategori
        </h3>
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="" id="category-all" />
            <Label htmlFor="category-all" className="cursor-pointer">
              Semua Kategori
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value={category} id={`category-${category}`} />
              <Label htmlFor={`category-${category}`} className="cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
          Durasi
        </h3>
        <RadioGroup value={selectedDuration} onValueChange={onDurationChange}>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="" id="duration-all" />
            <Label htmlFor="duration-all" className="cursor-pointer">
              Semua Durasi
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="half-day" id="duration-half" />
            <Label htmlFor="duration-half" className="cursor-pointer">
              Setengah Hari
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="full-day" id="duration-full" />
            <Label htmlFor="duration-full" className="cursor-pointer">
              Seharian Penuh
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="multi-day" id="duration-multi" />
            <Label htmlFor="duration-multi" className="cursor-pointer">
              Multi-Hari
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
          Rentang Harga
        </h3>
        <RadioGroup value={selectedPriceRange} onValueChange={onPriceRangeChange}>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="" id="price-all" />
            <Label htmlFor="price-all" className="cursor-pointer">
              Semua Harga
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="budget" id="price-budget" />
            <Label htmlFor="price-budget" className="cursor-pointer">
              {PRICE_RANGE.BUDGET.label} (hingga Rp {PRICE_RANGE.BUDGET.max.toLocaleString()})
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="standard" id="price-standard" />
            <Label htmlFor="price-standard" className="cursor-pointer">
              {PRICE_RANGE.STANDARD.label} (Rp {PRICE_RANGE.STANDARD.min.toLocaleString()} - Rp {PRICE_RANGE.STANDARD.max.toLocaleString()})
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="premium" id="price-premium" />
            <Label htmlFor="price-premium" className="cursor-pointer">
              {PRICE_RANGE.PREMIUM.label} (Rp {PRICE_RANGE.PREMIUM.min.toLocaleString()}+)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={featuredOnly}
            onCheckedChange={(checked) => onFeaturedOnlyChange(checked as boolean)}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Paket unggulan saja
          </Label>
        </div>
      </div>
    </div>
  );
}
