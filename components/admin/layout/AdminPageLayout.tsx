import type { PageLayoutProps } from '@/types/admin/common';

export function AdminPageLayout({
  title,
  description,
  icon,
  children,
}: PageLayoutProps) {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
