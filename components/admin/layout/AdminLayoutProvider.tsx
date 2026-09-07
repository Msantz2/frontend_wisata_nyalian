'use client';

import React, { createContext, useState, useContext } from 'react';
import type { AdminLayoutContextType } from '@/types/admin/layout';

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const value: AdminLayoutContextType = {
    sidebarOpen,
    setSidebarOpen,
    mobileDrawerOpen,
    setMobileDrawerOpen,
  };
  
  return (
    <AdminLayoutContext.Provider value={value}>
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (context === undefined) {
    throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  }
  return context;
}
