import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ArticlesClient from "./ArticlesClient";
import { getArticles } from "@/lib/articles";
import type { Article } from "@/types/article";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Artikel & Cerita",
    description: "Jelajahi cerita, tips, dan wawasan tentang Desa Nyalian dan budaya Bali. Temukan panduan perjalanan, tradisi budaya, dan pengalaman lokal.",
    path: "/articles",
    keywords: ["panduan perjalanan Bali", "cerita Nyalian", "budaya Bali", "tips perjalanan", "pengalaman lokal", "tradisi budaya"],
  });
}

export default async function ArticlesPage() {
  const allArticles = await getArticles();
  
  // Per 15-article-publishing.md Section 6:
  // Draft articles are never included in any public data-fetching path
  const publishedArticles = allArticles.filter(
    (article: Article) => article.status === 'published'
  );
  
  return <ArticlesClient articles={publishedArticles} />;
}
