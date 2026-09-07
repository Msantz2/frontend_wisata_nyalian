export interface ItineraryItem {
  time: string;
  activity: string;
  accommodation?: string;
}

export interface TourPackage {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  gallery: string[];
  price: number | string;
  duration: string;
  capacity: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  destinations: string[];
  rating?: number;
  featured: boolean;
  totalReviews?: number;
  thumbnailUrl?: string | null;
  fullImageUrl?: string | null;
  imageMetadata?: Record<string, any>;
  quickInfo?: {
    groupCapacity?: string;
    languages?: string[];
    transportation?: boolean;
    availability?: string;
    physicalLevel?: string;
    suitableFor?: string[];
  };
  terms?: string[];
  relatedPackages?: string[];
}
