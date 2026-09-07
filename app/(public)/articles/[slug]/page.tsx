import { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { createArticleSchema, createBreadcrumbSchema } from "@/lib/structuredData";
import StructuredData from "@/components/seo/StructuredData";
import Link from "next/link";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { getArticles, getArticleBySlug } from "@/lib/articles";
import { getDestinations } from "@/lib/data";
import { getPackages } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ArticleCard from "@/components/article/ArticleCard";
import SocialShare from "@/components/shared/SocialShare";
import RelatedContent from "@/components/article/RelatedContent";
import ArticlePageWrapper from "./ArticlePageWrapper";
import DetailHero from "@/components/shared/DetailHero";
import Image from "next/image";
import { formatDate } from "@/utils/formatDate";
import { calculateReadingTime } from "@/utils/calculateReadingTime";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { ArticleContentRenderer } from "@/components/article/ArticleContentRenderer";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const allArticles = await getArticles();
  // Per 15-article-publishing.md Section 6: Only generate params for published articles
  const publishedArticles = allArticles.filter((article) => article.status === 'published');
  return publishedArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    // Per 15-article-publishing.md Section 6: Draft articles never appear in public
    return buildMetadata({
      title: "Article Not Found",
      description: "The article you are looking for could not be found.",
      path: `/articles/${slug}`,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/articles/${slug}`,
    image: article.coverImage,
    type: "article",
    publishedTime: article.publishedAt,
    author: article.author,
    keywords: [article.category, ...(article.tags || [])],
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    // Per 15-article-publishing.md Section 6: Draft articles never appear in public
    notFound();
  }

  const allArticles = await getArticles();
  // Only show published articles in related content
  const publishedArticles = allArticles.filter((a) => a.status === 'published');
  
  const relatedArticles = publishedArticles
    .filter((a) => {
      if (a.id === article.id) return false;
      const categoryMatch = a.category === article.category;
      const tagMatch = (a.tags || []).some((tag) => (article.tags || []).includes(tag));
      return categoryMatch || tagMatch;
    })
    .slice(0, 3);

  const allDestinations = await getDestinations();
  const allPackages = await getPackages();
  
  const relatedDestinations = article.relatedDestinations
    ? allDestinations.filter((d) => article.relatedDestinations?.includes(d.id))
    : [];

  const relatedPackages = article.relatedPackages
    ? allPackages.filter((p) => article.relatedPackages?.includes(p.id))
    : [];

  const imageUrl = getPlaceholderImage(article.coverImage);
  const readingTime = article.readTime || calculateReadingTime(article.content);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/articles/${article.slug}`;

  const articleSchema = createArticleSchema(article);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
    { name: article.title, path: `/articles/${slug}` },
  ]);

  return (
    <ArticlePageWrapper allDestinations={allDestinations} allPackages={allPackages}>
      <div className="pt-20">
        <StructuredData data={articleSchema} />
        <StructuredData data={breadcrumbSchema} />
        
        <DetailHero
          backgroundImage={imageUrl}
          title={article.title}
          category={article.category}
        />

        <div className="container mx-auto px-4 py-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Articles", href: "/articles" },
              { label: article.title, href: `/articles/${slug}` },
            ]}
          />

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-200 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-text-muted" />
                <span className="text-text-secondary">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-text-muted" />
                <span className="text-text-secondary">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-text-muted" />
                <span className="text-text-secondary">{readingTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {(article.tags || []).map((tag) => (
                <Link key={tag} href={`/articles?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <article className="space-y-6 mb-12">
              <ArticleContentRenderer content={article.content} />
            </article>

            {(relatedDestinations.length > 0 || relatedPackages.length > 0) && (
              <RelatedContent destinations={relatedDestinations} packages={relatedPackages} />
            )}

            {relatedArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <ArticleCard key={related.id} article={related} />
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8 mb-8">
              <SocialShare
                url={shareUrl}
                title={article.title}
                description={article.excerpt}
              />
            </div>

            <div className="text-center">
              <Link href="/articles">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back to Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ArticlePageWrapper>
  );
}
