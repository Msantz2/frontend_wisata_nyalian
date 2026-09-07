import type { LucideIcon } from 'lucide-react';

export interface ModuleSummary {
  total: number;
  published: number;
  draft: number;
}

export interface ModuleDescriptor {
  key: string;
  label: string;
  listRoute: string;
  createRoute: string;
  icon: LucideIcon;
  getSummary(): Promise<ModuleSummary>;
}

export interface ModuleRegistry {
  register(descriptor: ModuleDescriptor): void;
  getModules(): ModuleDescriptor[];
  getModule(key: string): ModuleDescriptor | undefined;
}
