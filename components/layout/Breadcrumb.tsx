import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`breadcrumb-${index}-${item.label}`} className="flex items-center gap-2">
              {!isFirst && <ChevronRight className="w-4 h-4 text-slate-400" />}
              
              {isFirst ? (
                <Link
                  href={item.href || "/"}
                  className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Home className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ) : isLast ? (
                <span className="text-slate-900 font-semibold">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href!}
                  className="text-slate-600 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
