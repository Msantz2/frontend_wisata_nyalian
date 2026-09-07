export interface Destination {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  location: {
    village: string;
    district: string;
    regency: string;
    province: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  images: string[];
  videos: string[];
  facilities: string[];
  operatingHours: { open: string; close: string };
  ticketPrice: { adult: number | string; child: number | string };
  rating: number;
  totalReviews: number;
  featured: boolean;
  thumbnailUrl?: string | null;
  fullImageUrl?: string | null;
  imageMetadata?: Record<string, any>;
  highlights?: string[];
  apiId?: number;
  quickInfo?: {
    difficultyLevel?: string;
    estimatedDuration?: string;
    suitableFor?: string[];
    bestTimeToVisit?: string;
    contactNumber?: string;
  };
  facilitiesAvailable?: {
    parking?: boolean;
    toilet?: boolean;
    changingRoom?: boolean;
    prayerArea?: boolean;
    coffeeShop?: boolean;
    guideAvailable?: boolean;
    souvenirShop?: boolean;
  };
  relatedPackages?: string[];
}
