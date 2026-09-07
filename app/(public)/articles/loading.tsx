import ArticleGridSkeleton from "@/components/article/ArticleGridSkeleton";

export default function ArticlesLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
        <div className="h-6 w-2/3 bg-gray-200 rounded mx-auto animate-pulse" />
      </div>
      
      <ArticleGridSkeleton />
    </div>
  );
}
