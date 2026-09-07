'use client';

interface PageTitleProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function PageTitle({ children, icon }: PageTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-2">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <h1 className="text-3xl font-bold tracking-tight">{children}</h1>
    </div>
  );
}
