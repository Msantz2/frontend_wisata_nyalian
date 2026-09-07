'use client';

import { LayoutDashboard, AlertCircle } from 'lucide-react';
import {
  PageHeader,
  PageTitle,
  PageDescription,
  Section,
  EmptyState,
} from '@/components/admin';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { ModuleSummary } from '@/types/admin/module';

interface SummaryCardData {
  key: string;
  label: string;
  listRoute: string;
  createRoute: string;
  iconName: string;
  summary: ModuleSummary;
}

interface DashboardContentProps {
  summaryCards: SummaryCardData[];
}

// Dynamic icon mapping
const iconMap: Record<string, React.ReactNode> = {
  FileText: <span className="h-8 w-8 text-muted-foreground">📄</span>,
  MapPin: <span className="h-8 w-8 text-muted-foreground">📍</span>,
  Package: <span className="h-8 w-8 text-muted-foreground">📦</span>,
  HelpCircle: <span className="h-8 w-8 text-muted-foreground">❓</span>,
};

export function DashboardContent({ summaryCards }: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <PageHeader>
        <PageTitle icon={<LayoutDashboard />}>Dashboard</PageTitle>
        <PageDescription>
          Welcome to the admin dashboard. Get an overview of your content and
          access common tasks from here.
        </PageDescription>
      </PageHeader>

      <Section title="Summary Cards">
        {summaryCards.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {summaryCards.map((card) => (
              <div key={card.key} className="rounded-lg border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{card.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage {card.label.toLowerCase()}
                    </p>
                  </div>
                  {iconMap[card.iconName]}
                </div>
                <div className="grid gap-3 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-semibold">{card.summary.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Published
                    </span>
                    <span className="font-semibold">{card.summary.published}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Draft</span>
                    <span className="font-semibold">{card.summary.draft}</span>
                  </div>
                </div>
                <Link href={card.listRoute} className="mt-4 inline-block">
                  <Button variant="outline" size="sm">
                    View {card.label}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No modules registered"
            description="Content modules will appear here as they are added."
          />
        )}
      </Section>

      <Section title="Quick Actions">
        {summaryCards.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {summaryCards.map((card) => (
              <Link key={card.key} href={card.createRoute}>
                <Button>New {card.label}</Button>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No actions available"
            description="Quick actions will appear here once modules are registered."
          />
        )}
      </Section>

      <Section title="Recent Activity">
        <EmptyState
          title="No recent activity"
          description="Activity will appear here as you create and update content."
          icon={<AlertCircle className="h-12 w-12" />}
        />
      </Section>
    </div>
  );
}
