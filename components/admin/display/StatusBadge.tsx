'use client';

import type { StatusVariant } from './types';

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  variant,
  children,
  className,
}: StatusBadgeProps) {
  const variantStyles: Record<StatusVariant, string> = {
    success:
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  };

  const baseStyles =
    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className || ''}`}>
      {children}
    </span>
  );
}
