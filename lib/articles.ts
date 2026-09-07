import * as articlesService from "@/lib/modules/articles/service";
import type { Article } from "@/types/article";
import type { FullArticle } from "@/lib/modules/articles/schema";

/**
 * Convert FullArticle (service layer) to Article (frontend type)
 */
function convertToArticle(fullArticle: FullArticle): Article {
  return {
     id: fullArticle.id,
     slug: fullArticle.slug,
     title: fullArticle.title,
     excerpt: fullArticle.excerpt,
     content: fullArticle.content,
     coverImage: fullArticle.coverImage,
     category: fullArticle.category,
     author: fullArticle.author || 'Admin',
     publishedAt: fullArticle.publishedAt || fullArticle.createdAt,
     status: fullArticle.status,
     createdAt: fullArticle.createdAt,
     updatedAt: fullArticle.updatedAt,
     tags: fullArticle.tags || [],
     featured: fullArticle.featured || false,
     relatedDestinations: fullArticle.relatedDestinations || [],
     relatedPackages: fullArticle.relatedPackages || [],
  };
}

export async function getArticles(): Promise<Article[]> {
  const articles = await articlesService.getArticles();
  return articles.map(convertToArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const article = await articlesService.getArticleBySlug(slug);
    return convertToArticle(article);
  } catch (error) {
    return undefined;
  }
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  try {
    const article = await articlesService.getArticleById(id);
    return convertToArticle(article);
  } catch (error) {
    return undefined;
  }
}
