import type { BreadcrumbItem } from '@/types/admin/layout';

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  if (!segments.includes('admin')) {
    return [];
  }
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
  ];
  
  const adminIndex = segments.indexOf('admin');
  
  for (let i = adminIndex + 1; i < segments.length; i++) {
    const segment = segments[i];
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const href = '/admin/' + segments.slice(adminIndex + 1, i + 1).join('/');
    
    breadcrumbs.push({ label, href });
  }
  
  return breadcrumbs;
}
