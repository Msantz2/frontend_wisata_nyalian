'use client';

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export function FormActions({
  children,
  className,
  layout = 'horizontal',
}: FormActionsProps) {
  const layoutClass =
    layout === 'vertical'
      ? 'flex flex-col gap-3'
      : 'flex flex-col sm:flex-row gap-3';

  return (
    <div className={`${layoutClass} ${className || ''}`}>
      {children}
    </div>
  );
}
