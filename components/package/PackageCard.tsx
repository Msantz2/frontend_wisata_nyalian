"use client";

import { useRouter } from "next/navigation";
import SafeImage from "@/components/shared/SafeImage";
import { Clock, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TourPackage } from "@/types/package";
import { formatCurrency } from "@/utils/formatCurrency";
import { getPlaceholderImage } from "@/lib/placeholderImage";

interface PackageCardProps {
  package: TourPackage;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const router = useRouter();
  const imageUrl = pkg.thumbnailUrl || pkg.fullImageUrl || getPlaceholderImage(pkg.gallery?.[0]);
  const altText = pkg.name || 'Package image';
  
  return (
    <button
      onClick={() => router.push(`/packages/${pkg.slug}`)}
      className="h-full group flex flex-col bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left w-full"
    >
       <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
         <SafeImage
           src={imageUrl}
           alt={altText}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
           className="object-cover group-hover:scale-110 transition-transform duration-300"
         />
        <div className="absolute top-3 left-3">
          <Badge className="bg-secondary text-white">
            {pkg.category}
          </Badge>
        </div>
        {pkg.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-accent text-white">
              Unggulan
            </Badge>
          </div>
        )}
      </div>
      
       <div className="p-4 flex flex-col flex-1">
         <h3 className="font-heading text-xl font-bold text-[#22c55e] mb-2 group-hover:text-primary transition-colors line-clamp-2">
           {pkg.name}
         </h3>
        
        <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-1">
          {pkg.shortDescription}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-text-muted mb-4 mt-auto">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{pkg.capacity}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <div className="text-xs text-text-muted mb-1">Dari</div>
            <div className="text-lg font-bold text-primary">
              {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
            </div>
          </div>
          
          {pkg.rating !== undefined && pkg.rating !== null && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-accent fill-accent mr-1" />
              <span className="font-semibold text-text-primary">
                {pkg.rating ? pkg.rating.toFixed(1) : 'N/A'}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
