export interface ContentBlock {
  type: 'text' | 'heading' | 'image' | 'quote' | 'video';
  content: string;
  level?: number;
  caption?: string;
  alt?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    ogImage?: string | null;
    canonicalUrl?: string | null;
    noIndex?: boolean;
  };
  tags: string[];
  featured: boolean;
  readTime?: string;
  relatedDestinations?: string[];
  relatedPackages?: string[];
  contentBlocks?: ContentBlock[];
}
