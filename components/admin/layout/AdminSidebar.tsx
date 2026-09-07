'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { adminNavigationItems } from '@/lib/admin/navigation';
import { useAdminLayout } from './AdminLayoutProvider';

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, mobileDrawerOpen, setMobileDrawerOpen } = useAdminLayout();
  
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };
  
  const sidebarContent = (
    <nav className="space-y-2 px-4 py-6">
      {adminNavigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => {
              if (mobileDrawerOpen) {
                setMobileDrawerOpen(false);
              }
            }}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              item.disabled && 'pointer-events-none opacity-50',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                {typeof item.badge === 'number' ? item.badge : ''}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:fixed md:inset-y-0 md:flex md:flex-col md:border-r md:bg-muted/40',
          'md:w-64 md:transition-transform md:duration-300',
          sidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full',
        )}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h1 className="text-lg font-bold">Admin</h1>
        </div>
        {sidebarContent}
      </aside>
      
      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
          role="presentation"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r bg-muted/40 md:hidden',
          'transition-transform duration-300',
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Mobile admin navigation"
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h1 className="text-lg font-bold">Admin</h1>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1 hover:bg-accent rounded-lg"
            aria-label="Close navigation"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
