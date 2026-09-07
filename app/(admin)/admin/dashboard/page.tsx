import { DashboardContent } from './content';
import { initializeModules, moduleRegistry } from '@/lib/admin/modules';

export const metadata = {
  title: 'Dashboard | Admin',
};

export default async function DashboardPage() {
  // Initialize all registered modules
  initializeModules();

  // Fetch summary data for all modules
  const modules = moduleRegistry.getModules();
  const summaryCards = await Promise.all(
    modules.map(async (module) => ({
      key: module.key,
      label: module.label,
      listRoute: module.listRoute,
      createRoute: module.createRoute,
      iconName: module.icon.name || 'FileText',
      summary: await module.getSummary(),
    }))
  );

  return <DashboardContent summaryCards={summaryCards} />;
}
