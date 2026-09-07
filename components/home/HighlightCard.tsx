import { LucideIcon } from "lucide-react";

interface HighlightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function HighlightCard({
  icon: Icon,
  title,
  description,
}: HighlightCardProps) {
  return (
    <div className="h-full flex flex-col items-center text-center p-6 rounded-lg bg-background hover:bg-background-light hover:shadow-lg hover:-translate-y-1 transition-all duration-300 motion-reduce:hover:translate-y-0 motion-reduce:transition-colors group">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300" aria-hidden="true">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-heading text-xl font-bold text-text-primary mb-3">
        {title}
      </h3>
      <p className="text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}
