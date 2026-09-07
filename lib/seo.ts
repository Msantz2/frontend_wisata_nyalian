import { Metadata } from "next";
import { SITE_NAME } from "./constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nyalianvillage.com";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function truncateDescription(text: string | null | undefined, maxLength: number = 160): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trimEnd() + "...";
}

interface BuildMetadataOptions {
  title: string;
  description?: string | null;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  author?: string;
}

export function buildMetadata({
  title,
  description = "",
  path,
  image,
  type = "website",
  keywords,
  publishedTime,
  author,
}: BuildMetadataOptions): Metadata {
  const url = buildCanonicalUrl(path);
  const ogImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  const truncatedDesc = truncateDescription(description, 160);

  const metadata: Metadata = {
    title,
    description: truncatedDesc,
    keywords: keywords?.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: truncatedDesc,
      url,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: truncatedDesc,
      images: [ogImage],
    },
  };

  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      authors: author ? [author] : undefined,
    };
  }

  return metadata;
}
