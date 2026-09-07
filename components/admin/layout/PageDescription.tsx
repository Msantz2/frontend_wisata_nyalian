'use client';

interface PageDescriptionProps {
  children: React.ReactNode;
}

export function PageDescription({ children }: PageDescriptionProps) {
  return <p className="text-muted-foreground text-base">{children}</p>;
}
