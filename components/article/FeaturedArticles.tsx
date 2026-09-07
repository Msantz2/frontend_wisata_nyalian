import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types/article";
import { formatDate } from "@/utils/formatDate";
import { getPlaceholderImage } from "@/lib/placeholderImage";

interface FeaturedArticlesProps {
  articles: Article[];
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  const displayArticles = articles.slice(0, 3);

  return (
    <div className="mb-12">
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
        Featured Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map((article) => {
          const imageUrl = getPlaceholderImage(article.coverImage);
          
          return (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group block bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
               <div className="relative h-64 w-full overflow-hidden">
                 <Image
                   src={imageUrl}
                   alt={article.title}
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                   className="object-cover group-hover:scale-110 transition-transform duration-300"
                 />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-white text-sm">
                    {article.category}
                  </Badge>
                </div>
              </div>
              
               <div className="p-6">
                 <h3 className="font-heading text-2xl font-bold text-[#22c55e] mb-3 group-hover:text-primary transition-colors line-clamp-2">
                   {article.title}
                 </h3>
                
                <p className="text-text-secondary mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-text-muted">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
