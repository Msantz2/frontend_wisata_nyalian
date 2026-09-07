import type { ActionBarProps } from '@/types/admin/common';

export function ActionBar({ children }: ActionBarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {children}
    </div>
  );
}
