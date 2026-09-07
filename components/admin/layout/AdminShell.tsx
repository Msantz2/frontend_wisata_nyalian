'use client';

import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="md:ml-64">
        <AdminHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
