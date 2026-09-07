"use client";

import { useRouter } from "next/navigation";
import SafeImage from "@/components/shared/SafeImage";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Destination } from "@/types/destination";
import { getPlaceholderImage } from "@/lib/placeholderImage";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const router = useRouter();
  const imageUrl = destination.thumbnailUrl || destination.fullImageUrl || getPlaceholderImage(destination.images[0]);
  const altText = destination.imageMetadata?.alt_text || `${destination.name} thumbnail`;
  
  return (
    <button
      onClick={() => router.push(`/destinations/${destination.slug}`)}
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
           <Badge className="bg-primary text-white">
             {destination.category}
           </Badge>
         </div>
       </div>
      
       <div className="p-4 flex flex-col flex-1">
         <h3 className="font-heading text-xl font-bold text-[#22c55e] mb-2 group-hover:text-primary transition-colors line-clamp-2">
           {destination.name}
         </h3>
        
        <div className="flex items-center text-text-muted text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{destination.location.village}</span>
        </div>
        
        <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-1">
          {destination.shortDescription}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-accent fill-accent mr-1" />
            <span className="font-semibold text-text-primary">
              {destination.rating.toFixed(1)}
            </span>
            <span className="text-text-muted text-sm ml-1">
              ({destination.totalReviews})
            </span>
          </div>
          
          <span className="text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </button>
  );
}
