import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | boolean;
  disabled?: boolean;
}

export interface NavigationSection {
  section?: string;
  items: NavigationItem[];
}
