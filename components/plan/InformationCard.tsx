"use client";

import { LucideIcon } from "lucide-react";

interface InformationCardProps {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

export default function InformationCard({
  icon: Icon,
  title,
  content,
}: InformationCardProps) {
  return (
    <div className="h-full bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 h-full">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
            {title}
          </h3>
          <div className="text-text-secondary leading-relaxed space-y-2">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
