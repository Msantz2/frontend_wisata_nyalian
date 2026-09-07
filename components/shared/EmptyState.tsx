import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
}

export default function EmptyState({ icon: Icon = Inbox, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="status" aria-live="polite">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4" aria-hidden="true">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-text-secondary text-lg">{message}</p>
    </div>
  );
}
