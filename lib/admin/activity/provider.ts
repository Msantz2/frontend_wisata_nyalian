export interface ActivityEntry {
  id: string;
  timestamp: Date;
  action: 'create' | 'update' | 'publish' | 'delete';
  entityType: string;
  entityId: string;
  entityTitle: string;
}

export interface ActivityProvider {
  getRecentActivity(limit?: number): Promise<ActivityEntry[]>;
}

class DefaultActivityProvider implements ActivityProvider {
  async getRecentActivity(): Promise<ActivityEntry[]> {
    // Phase 3 placeholder: returns empty result
    // Future phases will integrate with the logging mechanism defined in 06-security.md
    return [];
  }
}

export const activityProvider: ActivityProvider = new DefaultActivityProvider();
