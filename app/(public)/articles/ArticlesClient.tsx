"use client";

import { useState, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import { usePagination } from "@/hooks/usePagination";
import SearchInput from "@/components/shared/SearchInput";
import SortDropdown from "@/components/shared/SortDropdown";
import CategoryFilter from "@/components/article/CategoryFilter";
import FeaturedArticles from "@/components/article/FeaturedArticles";
import ArticleGrid from "@/components/article/ArticleGrid";
import PaginationControls from "@/components/shared/PaginationControls";
import EmptyState from "@/components/shared/EmptyState";
import { sortData } from "@/utils/sortData";
import type { Article } from "@/types/article";

const ITEMS_PER_PAGE = 9;

const sortOptions = [
  { label: "Terbaru", value: "newest" },
  { label: "Tertua", value: "oldest" },
  { label: "Alfabetis", value: "alphabetical" },
];

interface ArticlesClientProps {
  articles: Article[];
}

export default function ArticlesClient({ articles }: ArticlesClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { query: searchTerm, setQuery: setSearchTerm, results: searchedArticles } = useSearch(
    articles,
    ["title", "excerpt", "content", "category", "tags"]
  );

  const categories = useMemo(() => {
    const uniqueCategories = new Set(articles.map((article) => article.category));
    return Array.from(uniqueCategories).sort();
  }, [articles]);

  const featuredArticles = useMemo(() => {
    return articles.filter((article) => article.featured);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let filtered = searchedArticles;

    if (activeCategory !== "all") {
      filtered = filtered.filter((article: Article) => article.category === activeCategory);
    }

    return sortData(filtered as Article[], sortBy);
  }, [searchedArticles, activeCategory, sortBy]);

  const {
    page: currentPage,
    totalPages,
    paginatedItems: paginatedArticles,
    setPage,
  } = usePagination(filteredArticles, ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-12 pt-32 space-y-12">
      <div className="text-center">
         <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-4">
           Artikel & Cerita
         </h1>
         <p className="text-lg text-text-secondary max-w-2xl mx-auto">
           Jelajahi cerita, tips, dan wawasan tentang Desa Nyalian dan budaya Bali
         </p>
       </div>

      {featuredArticles.length > 0 && !searchTerm && activeCategory === "all" && (
        <FeaturedArticles articles={featuredArticles} />
      )}

      <div>
        <SearchInput
           value={searchTerm}
           onChange={setSearchTerm}
           placeholder="Cari artikel..."
           className="max-w-2xl mx-auto"
         />
      </div>

      <div>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={(category) => {
            setActiveCategory(category);
            setPage(1);
          }}
        />
      </div>

      <div className="flex justify-between items-center">
         <p className="text-text-muted">
           {filteredArticles.length} {filteredArticles.length === 1 ? "artikel" : "artikel"} ditemukan
         </p>
        <SortDropdown
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      {paginatedArticles.length === 0 ? (
         <EmptyState message="Tidak ada artikel yang ditemukan. Coba gunakan kata kunci yang berbeda atau telusuri semua kategori." />
      ) : (
        <>
          <ArticleGrid articles={paginatedArticles} />
          
          {totalPages > 1 && (
            <div>
              <PaginationControls
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
