import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { createVideoObjectSchema } from "@/lib/structuredData";
import StructuredData from "@/components/seo/StructuredData";
import Hero from "@/components/home/Hero";
import HighlightSection from "@/components/home/HighlightSection";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import GalleryPreview from "@/components/home/GalleryPreview";
import VideoPreview from "@/components/home/VideoPreview";
import ReviewPreview from "@/components/home/ReviewPreview";
import ArticlePreview from "@/components/home/ArticlePreview";
import FAQPreview from "@/components/home/FAQPreview";
import CTASection from "@/components/home/CTASection";
import DestinationModal from "@/components/destination/DestinationModal";
import PackageModal from "@/components/package/PackageModal";
import {
  getSettings,
  getVillageProfile,
  getFeaturedDestinations,
  getFeaturedPackages,
  getVideos,
  getReviews,
  getArticles,
  getFAQs,
  getDestinations,
  getPackages,
} from "@/lib/data";

export function generateMetadata(): Metadata {
  const settings = getSettings();
  return buildMetadata({
    title: "Home",
    description: settings.description,
    path: "/",
    keywords: ["Bali tourism", "Nyalian Village", "Klungkung", "royal heritage", "Arja theatre", "melukat", "spiritual tourism", "rice terraces", "cultural tourism", "village tourism", "authentic Bali"],
  });
}

export default async function Home() {
  const settings = getSettings();
  const village = getVillageProfile();
  const [featuredDestinations, featuredPackages, videos, reviews, articles, faqs, allDestinations, allPackages] = await Promise.all([
    getFeaturedDestinations(),
    getFeaturedPackages(),
    Promise.resolve(getVideos()),
    getReviews(),
    getArticles(),
    getFAQs(),
    getDestinations(),
    getPackages(),
  ]);

  const videoSchemas = videos.slice(0, 3).map((video) => createVideoObjectSchema(video));

  return (
    <>
      {videoSchemas.map((schema, index) => (
        <StructuredData key={`video-schema-${index}`} data={schema} />
      ))}
      <Hero />
      <HighlightSection village={village} />
      <FeaturedDestinations destinations={featuredDestinations} />
      <FeaturedPackages packages={featuredPackages} />
      <GalleryPreview />
      <VideoPreview videos={videos} />
      <ReviewPreview reviews={reviews} />
      <ArticlePreview articles={articles} />
      <FAQPreview faqs={faqs} />
      <CTASection whatsappNumber={settings.whatsapp} />
      <DestinationModal allDestinations={allDestinations} />
      <PackageModal allPackages={allPackages} allDestinations={allDestinations} />
    </>
  );
}
