import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import ArticleCard from "@/components/article/ArticleCard";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types/article";

interface ArticlePreviewProps {
  articles: Article[];
}

export default function ArticlePreview({ articles }: ArticlePreviewProps) {
  const featuredArticles = articles.filter(article => article.featured);
  
  let displayArticles: Article[];
  if (featuredArticles.length > 0) {
    displayArticles = featuredArticles.slice(0, 3);
  } else {
    displayArticles = [...articles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3);
  }

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <SectionContainer background="section">
      <SectionTitle
        title="Artikel Terbaru"
        subtitle="Jelajahi cerita, tips, dan wawasan tentang Desa Nyalian"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {displayArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      <div className="text-center">
        <Link href="/articles">
          <Button size="lg" className="font-semibold">
            Lihat Semua Artikel
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </SectionContainer>
  );
}
