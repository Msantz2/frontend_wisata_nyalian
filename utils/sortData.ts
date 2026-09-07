export function sortData<T>(items: T[], sortBy: string): T[] {
  const sorted = [...items];

  switch (sortBy) {
    case "featured":
      return sorted.sort((a, b) => {
        const aFeatured = (a as Record<string, unknown>).featured as boolean;
        const bFeatured = (b as Record<string, unknown>).featured as boolean;
        if (aFeatured === bFeatured) return 0;
        return aFeatured ? -1 : 1;
      });

    case "name-asc":
    case "alphabetical-asc":
      return sorted.sort((a, b) => {
        const aName = String((a as Record<string, unknown>).name || (a as Record<string, unknown>).title || "");
        const bName = String((b as Record<string, unknown>).name || (b as Record<string, unknown>).title || "");
        return aName.localeCompare(bName);
      });

    case "name-desc":
    case "alphabetical-desc":
      return sorted.sort((a, b) => {
        const aName = String((a as Record<string, unknown>).name || (a as Record<string, unknown>).title || "");
        const bName = String((b as Record<string, unknown>).name || (b as Record<string, unknown>).title || "");
        return bName.localeCompare(aName);
      });

    case "rating-desc":
      return sorted.sort((a, b) => {
        const aRating = (a as Record<string, unknown>).rating as number || 0;
        const bRating = (b as Record<string, unknown>).rating as number || 0;
        return bRating - aRating;
      });

    case "price-asc":
      return sorted.sort((a, b) => {
        const aPrice = (a as Record<string, unknown>).price as number || 0;
        const bPrice = (b as Record<string, unknown>).price as number || 0;
        return aPrice - bPrice;
      });

    case "price-desc":
      return sorted.sort((a, b) => {
        const aPrice = (a as Record<string, unknown>).price as number || 0;
        const bPrice = (b as Record<string, unknown>).price as number || 0;
        return bPrice - aPrice;
      });

    case "date-desc":
    case "newest":
      return sorted.sort((a, b) => {
        const aDate = (a as Record<string, unknown>).publishedAt as string || "";
        const bDate = (b as Record<string, unknown>).publishedAt as string || "";
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });

    case "date-asc":
    case "oldest":
      return sorted.sort((a, b) => {
        const aDate = (a as Record<string, unknown>).publishedAt as string || "";
        const bDate = (b as Record<string, unknown>).publishedAt as string || "";
        return new Date(aDate).getTime() - new Date(bDate).getTime();
      });

    default:
      return sorted;
  }
}
