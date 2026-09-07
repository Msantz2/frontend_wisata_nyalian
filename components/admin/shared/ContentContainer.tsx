import { cn } from '@/lib/utils';

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentContainer({
  children,
  className,
}: ContentContainerProps) {
  return (
    <div className={cn('w-full max-w-6xl mx-auto', className)}>
      {children}
    </div>
  );
}
