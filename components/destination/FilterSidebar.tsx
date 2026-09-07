"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedFacilities: string[];
  onFacilitiesChange: (facilities: string[]) => void;
  featuredOnly: boolean;
  onFeaturedOnlyChange: (value: boolean) => void;
  categories: string[];
  facilities: string[];
}

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  selectedFacilities,
  onFacilitiesChange,
  featuredOnly,
  onFeaturedOnlyChange,
  categories,
  facilities,
}: FilterSidebarProps) {
  const handleFacilityToggle = (facility: string) => {
    if (selectedFacilities.includes(facility)) {
      onFacilitiesChange(selectedFacilities.filter((f) => f !== facility));
    } else {
      onFacilitiesChange([...selectedFacilities, facility]);
    }
  };

  return (
    <aside className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
          Kategori
        </h3>
         <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
           <div className="space-y-3">
             <div className="flex items-center space-x-2">
               <RadioGroupItem value="" id="category-all" />
               <Label htmlFor="category-all" className="cursor-pointer">
                 Semua Kategori
               </Label>
             </div>
             {categories.map((category, idx) => (
               <div key={`category-${idx}-${category}`} className="flex items-center space-x-2">
                 <RadioGroupItem value={category} id={`category-${category}`} />
                 <Label
                   htmlFor={`category-${category}`}
                   className="cursor-pointer"
                 >
                   {category}
                 </Label>
               </div>
             ))}
           </div>
         </RadioGroup>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-heading text-lg font-bold text-text-primary mb-4">
          Fasilitas
        </h3>
         <div className="space-y-3 max-h-80 overflow-y-auto">
           {facilities.map((facility, idx) => (
             <div key={`facility-${idx}-${facility}`} className="flex items-center space-x-2">
               <Checkbox
                 id={`facility-${facility}`}
                 checked={selectedFacilities.includes(facility)}
                 onCheckedChange={() => handleFacilityToggle(facility)}
               />
               <Label
                 htmlFor={`facility-${facility}`}
                 className="cursor-pointer text-sm"
               >
                 {facility}
               </Label>
             </div>
           ))}
         </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="featured-only" className="cursor-pointer">
            Hanya Unggulan
          </Label>
          <Switch
            id="featured-only"
            checked={featuredOnly}
            onCheckedChange={onFeaturedOnlyChange}
          />
        </div>
      </div>
    </aside>
  );
}
