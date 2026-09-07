"use client";

import { useRouter } from "next/navigation";
import { MapPin, Clock } from "lucide-react";
import SafeImage from "@/components/shared/SafeImage";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import type { Destination } from "@/types/destination";
import type { TourPackage } from "@/types/package";

interface RelatedContentProps {
  destinations: Destination[];
  packages: TourPackage[];
}

export default function RelatedContent({ destinations, packages }: RelatedContentProps) {
  const router = useRouter();

  if (destinations.length === 0 && packages.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
        Related Experiences
      </h2>

      {destinations.length > 0 && (
        <div className="mb-8">
          <h3 className="font-heading text-xl font-semibold text-text-primary mb-4">
            Destinations Mentioned
          </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {destinations.map((destination) => (
               <button
                 key={destination.id}
                 onClick={() => router.push(`/destinations/${destination.id}`)}
                 className="group block text-left bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full"
               >
                <div className="relative h-40 w-full">
                  <SafeImage
                    src={getPlaceholderImage(destination.images[0])}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                   <h4 className="font-semibold text-[#22c55e] group-hover:text-primary transition-colors line-clamp-1 mb-2">
                     {destination.name}
                   </h4>
                  <p className="text-xs text-text-muted flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {destination.location.village}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {packages.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold text-text-primary mb-4">
            Related Tour Packages
          </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {packages.map((pkg) => (
               <button
                 key={pkg.id}
                 onClick={() => router.push(`/packages/${pkg.slug}`)}
                 className="group block text-left bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full"
               >
                <div className="relative h-40 w-full">
                  <SafeImage
                    src={getPlaceholderImage(pkg.gallery?.[0])}
                    alt={pkg.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                   <h4 className="font-semibold text-[#22c55e] group-hover:text-primary transition-colors line-clamp-1 mb-2">
                     {pkg.name}
                   </h4>
                  <p className="text-xs text-text-muted flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {pkg.duration}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
