import { FileText, HelpCircle } from 'lucide-react';
import { moduleRegistry } from './registry';
import { articlesService } from './articles';
import { faqModuleService } from './faq';

export function initializeModules() {
  if (moduleRegistry.isInitialized()) {
    return;
  }

  moduleRegistry.register({
    key: 'articles',
    label: 'Articles',
    listRoute: '/admin/articles',
    createRoute: '/admin/articles/new',
    icon: FileText,
    getSummary: () => articlesService.getSummary(),
  });

  moduleRegistry.register({
    key: 'faq',
    label: 'FAQ',
    listRoute: '/admin/faq',
    createRoute: '/admin/faq/create',
    icon: HelpCircle,
    getSummary: () => faqModuleService.getSummary(),
  });

  moduleRegistry.markInitialized();
}

export { moduleRegistry };
