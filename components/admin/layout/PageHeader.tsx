'use client';

interface PageHeaderProps {
  children: React.ReactNode;
}

export function PageHeader({ children }: PageHeaderProps) {
  return <header className="mb-8">{children}</header>;
}
