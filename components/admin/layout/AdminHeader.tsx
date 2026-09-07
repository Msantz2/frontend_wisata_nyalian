'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateBreadcrumbs } from '@/lib/admin/breadcrumbs';
import { useAdminLayout } from './AdminLayoutProvider';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/admin/auth';

export function AdminHeader() {
  const pathname = usePathname();
  const { setMobileDrawerOpen, mobileDrawerOpen } = useAdminLayout();
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  const handleMobileMenuToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className={cn(
        'flex h-16 items-center justify-between px-4 md:px-6',
        'md:ml-64',
      )}>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMobileMenuToggle}
          className="md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Breadcrumbs */}
        <div className="flex-1 ml-4 md:ml-0">
          <nav aria-label="Breadcrumb" className="text-sm">
             <ol className="flex items-center space-x-2">
               {breadcrumbs.map((crumb, index) => (
                 <li key={`admin-breadcrumb-${index}-${crumb.label}`} className="flex items-center">
                   {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                   {crumb.href ? (
                     <Link
                       href={crumb.href}
                       className="text-muted-foreground hover:text-foreground transition-colors"
                     >
                       {crumb.label}
                     </Link>
                   ) : (
                     <span className="text-foreground font-medium">{crumb.label}</span>
                   )}
                 </li>
               ))}
             </ol>
          </nav>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
