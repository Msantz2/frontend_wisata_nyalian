import { getArticles } from '@/lib/articles';
import type { ModuleSummary } from '@/types/admin/module';

export const articlesService = {
  async getSummary(): Promise<ModuleSummary> {
    const articles = await getArticles();
    const total = articles.length;
    const published = articles.filter(
      (article) =>
        article.publishedAt &&
        new Date(article.publishedAt) <= new Date()
    ).length;
    const draft = total - published;

    return {
      total,
      published,
      draft,
    };
  },
};
