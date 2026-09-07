'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function ErrorState({
  title,
  description,
  action,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg bg-destructive/10 border border-destructive/20">
      <div className="mb-4 text-destructive">
        <AlertCircle className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold text-destructive mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-destructive/80 mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
