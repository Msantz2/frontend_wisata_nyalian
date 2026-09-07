import { Destination } from "@/types/destination";
import { TourPackage } from "@/types/package";
import { Article } from "@/types/article";
import { Review } from "@/types/review";
import { FAQ } from "@/types/faq";
import { Video } from "@/types/video";
import { NavigationItem } from "@/types/navigation";
import { SiteSettings } from "@/types/settings";
import { VillageProfile } from "@/types/village";

import navigationData from "@/data/navigation.json";
import settingsData from "@/data/settings.json";
import villageData from "@/data/village.json";

import {
  getDestinationsServer,
  getFeaturedDestinationsServer,
  getDestinationBySlugServer,
} from "@/lib/services/destinasi";
import {
  getPackagesServer,
  getFeaturedPackagesServer,
  getPackageBySlugServer,
} from "@/lib/services/paket";
import {
  getArticles as getArticlesFromFile,
  getArticleBySlug as getArticleBySlugFromFile,
} from "@/lib/articles";
import {
  getReviewsServer,
} from "@/lib/services/ulasan";
import {
  getFAQsServer,
  getFAQsByCategoryServer,
} from "@/lib/services/faq";
import videosData from "@/data/videos.json";

// ============================================================================
// DESTINATIONS - API-driven
// ============================================================================
export async function getDestinations(): Promise<Destination[]> {
  return getDestinationsServer();
}

export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  return getDestinationBySlugServer(slug);
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  return getFeaturedDestinationsServer();
}

// ============================================================================
// PACKAGES - API-driven
// ============================================================================
export async function getPackages(): Promise<TourPackage[]> {
  return getPackagesServer();
}

export async function getPackageBySlug(slug: string): Promise<TourPackage | undefined> {
  return getPackageBySlugServer(slug);
}

export async function getFeaturedPackages(): Promise<TourPackage[]> {
  return getFeaturedPackagesServer();
}

// ============================================================================
// ARTICLES - File-based (content/articles.json)
// ============================================================================
export async function getArticles(): Promise<Article[]> {
  return getArticlesFromFile();
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return getArticleBySlugFromFile(slug);
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const allArticles = await getArticlesFromFile();
  return allArticles.filter(article => article.featured && article.status === 'published');
}

// ============================================================================
// REVIEWS - API-driven
// ============================================================================
export async function getReviews(): Promise<Review[]> {
  return getReviewsServer();
}

// ============================================================================
// FAQs - API-driven
// ============================================================================
export async function getFAQs(): Promise<FAQ[]> {
  return getFAQsServer();
}

export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  return getFAQsByCategoryServer(category);
}

export function getVideos(): Video[] {
  return videosData as Video[];
}

export function getNavigation(): NavigationItem[] {
  return (navigationData as NavigationItem[]).sort((a, b) => a.order - b.order);
}

export function getSettings(): SiteSettings {
  return settingsData as SiteSettings;
}

export function getVillageProfile(): VillageProfile {
  return villageData as VillageProfile;
}
