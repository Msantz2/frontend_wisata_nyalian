import { SITE_NAME } from "./constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nyalianvillage.com";

export interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    telephone: string;
    email: string;
    contactType: "customer service";
  };
  sameAs: string[];
}

export function createOrganizationSchema(settings: {
  siteName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
}): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: settings.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Bangli",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      email: settings.email,
      contactType: "customer service",
    },
    sameAs: Object.values(settings.socialMedia).filter(Boolean) as string[],
  };
}

export interface TouristAttraction {
  "@context": "https://schema.org";
  "@type": "TouristAttraction";
  name: string;
  description: string;
  image: string[];
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
}

export function createTouristAttractionSchema(destination: {
  name: string;
  description: string;
  images: string[];
  location: {
    address: string;
    village: string;
    province: string;
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  totalReviews?: number;
}): TouristAttraction {
  const schema: TouristAttraction = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    description: destination.description,
    image: destination.images.map((img) => `${SITE_URL}${img}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: destination.location.address,
      addressLocality: destination.location.village,
      addressRegion: destination.location.province,
      addressCountry: "ID",
    },
  };

  if (destination.location.latitude && destination.location.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: destination.location.latitude,
      longitude: destination.location.longitude,
    };
  }

  if (destination.rating && destination.totalReviews) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: destination.rating,
      reviewCount: destination.totalReviews,
    };
  }

  return schema;
}

export interface Article {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
}

export function createArticleSchema(article: {
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  author: string;
}): Article {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${SITE_URL}${article.coverImage}`,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

export interface FAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export function createFAQPageSchema(faqs: Array<{ pertanyaan: string; jawaban: string }>): FAQPage {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.pertanyaan,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.jawaban,
      },
    })),
  };
}

export interface BreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>): BreadcrumbList {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export interface VideoObject {
  "@context": "https://schema.org";
  "@type": "VideoObject";
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  embedUrl: string;
}

export function createVideoObjectSchema(video: {
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  uploadDate?: string;
}): VideoObject {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: `${SITE_URL}${video.thumbnail}`,
    uploadDate: video.uploadDate,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
  };
}
