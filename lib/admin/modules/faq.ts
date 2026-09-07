import { faqService } from '@/lib/api/faq';
import type { ModuleSummary } from '@/types/admin/module';

export const faqModuleService = {
  async getSummary(): Promise<ModuleSummary> {
    try {
      const response = await faqService.list({ limit: 1000, is_active: true });
      if (response.success && response.data) {
        const total = response.meta.total;
        const active = response.data.filter((faq) => faq.is_active).length;

        return {
          total,
          published: active,
          draft: total - active,
        };
      }
    } catch (error) {
      console.error('Failed to fetch FAQ summary:', error);
    }

    return {
      total: 0,
      published: 0,
      draft: 0,
    };
  },
};
