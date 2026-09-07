import { MetadataRoute } from "next";
import { getDestinations, getPackages, getArticles } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nyalianvillage.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, packages, articles] = await Promise.all([
    getDestinations(),
    getPackages(),
    getArticles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/plan-your-visit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((destination) => ({
    url: `${SITE_URL}/destinations/${destination.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: destination.featured ? 0.8 : 0.7,
  }));

  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${SITE_URL}/packages/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: pkg.featured ? 0.8 : 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "yearly" as const,
    priority: article.featured ? 0.7 : 0.6,
  }));

  return [...staticRoutes, ...destinationRoutes, ...packageRoutes, ...articleRoutes];
}
