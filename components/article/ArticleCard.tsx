import Link from "next/link";
import SafeImage from "@/components/shared/SafeImage";
import { Calendar, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types/article";
import { formatDate } from "@/utils/formatDate";
import { getPlaceholderImage } from "@/lib/placeholderImage";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = getPlaceholderImage(article.coverImage);
  
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="h-full group flex flex-col bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
       <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
         <SafeImage
           src={imageUrl}
           alt={article.title}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
           className="object-cover group-hover:scale-110 transition-transform duration-300"
         />
        <div className="absolute top-3 left-3">
          <Badge className="bg-accent text-white">
            {article.category}
          </Badge>
        </div>
      </div>
      
       <div className="p-4 flex flex-col flex-1">
         <h3 className="font-heading text-xl font-bold text-[#22c55e] mb-2 group-hover:text-primary transition-colors line-clamp-2">
           {article.title}
         </h3>
        
        <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-text-muted mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{article.author}</span>
            </div>
            {article.readTime && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{article.readTime}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
