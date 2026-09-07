import type { ModuleDescriptor, ModuleRegistry } from '@/types/admin/module';

class AdminModuleRegistry implements ModuleRegistry {
  private modules: Map<string, ModuleDescriptor> = new Map();
  private initialized: boolean = false;

  register(descriptor: ModuleDescriptor): void {
    if (this.modules.has(descriptor.key)) {
      throw new Error(`Module with key "${descriptor.key}" is already registered`);
    }
    this.modules.set(descriptor.key, descriptor);
  }

  markInitialized(): void {
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  reset(): void {
    this.modules.clear();
    this.initialized = false;
  }

  getModules(): ModuleDescriptor[] {
    return Array.from(this.modules.values());
  }

  getModule(key: string): ModuleDescriptor | undefined {
    return this.modules.get(key);
  }
}

export const moduleRegistry = new AdminModuleRegistry();
