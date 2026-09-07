"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { usePagination } from "@/hooks/usePagination";
import { sortData } from "@/utils/sortData";
import { PAGINATION, PRICE_RANGE } from "@/lib/constants";
import type { TourPackage } from "@/types/package";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import SearchInput from "@/components/shared/SearchInput";
import SortDropdown from "@/components/shared/SortDropdown";
import FilterSidebar from "@/components/package/FilterSidebar";
import FilterDrawer from "@/components/shared/FilterDrawer";
import PackageGrid from "@/components/package/PackageGrid";
import PaginationControls from "@/components/shared/PaginationControls";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

const sortOptions = [
  { label: "Unggulan", value: "featured" },
  { label: "Harga Terendah", value: "price-asc" },
  { label: "Harga Tertinggi", value: "price-desc" },
  { label: "Alfabetis", value: "alphabetical-asc" },
];

interface PackagesClientProps {
  packages: TourPackage[];
}

export default function PackagesClient({ packages }: PackagesClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const categories = useMemo(() => {
    const cats = packages.map((p) => p.category);
    return Array.from(new Set(cats)).sort();
  }, [packages]);

  const { query, setQuery, results: searchResults } = useSearch(
    packages,
    ["name", "shortDescription", "category", "highlights"]
  );

  const filteredResults = useMemo(() => {
    let result = searchResults;

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedDuration) {
      result = result.filter((p) => {
        const duration = p.duration.toLowerCase();
        if (selectedDuration === "half-day") {
          return duration.includes("4 hours") || duration.includes("half");
        }
        if (selectedDuration === "full-day") {
          return duration.includes("8 hours") || duration.includes("full day");
        }
        if (selectedDuration === "multi-day") {
          return duration.includes("2 day") || duration.includes("multi");
        }
        return true;
      });
    }

    if (selectedPriceRange) {
      result = result.filter((p) => {
        if (typeof p.price !== 'number') return true; // Skip filtering for non-numeric prices
        const range = PRICE_RANGE[selectedPriceRange.toUpperCase() as keyof typeof PRICE_RANGE];
        return p.price >= range.min && p.price < range.max;
      });
    }

    if (featuredOnly) {
      result = result.filter((p) => p.featured);
    }

    return result;
  }, [searchResults, selectedCategory, selectedDuration, selectedPriceRange, featuredOnly]);

  const sortedResults = useMemo(() => {
    return sortData(filteredResults, sortBy);
  }, [filteredResults, sortBy]);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
  } = usePagination(sortedResults, PAGINATION.PACKAGES_PER_PAGE);

  const hasActiveFilters = query || selectedCategory || selectedDuration || selectedPriceRange || featuredOnly;

  const handleClearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedDuration("");
    setSelectedPriceRange("");
    setFeaturedOnly(false);
    setSortBy("featured");
  };

  return (
    <>
      <SectionContainer className="py-12">
      <SectionTitle
        title="Paket Tur"
        subtitle="Pengalaman yang dikurasi menggabungkan yang terbaik dari Desa Nyalian"
        align="center"
      />

      <div className="mb-8">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari paket tur..."
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={setSelectedPriceRange}
            featuredOnly={featuredOnly}
            onFeaturedOnlyChange={setFeaturedOnly}
            categories={categories}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-text-secondary">
              {sortedResults.length} {sortedResults.length === 1 ? "paket" : "paket"} ditemukan
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>

              <SortDropdown
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>

          {paginatedItems.length > 0 ? (
            <>
              <PackageGrid packages={paginatedItems} />
              <div className="mt-8">
                <PaginationControls
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          ) : (
            <div className="py-12">
              <EmptyState message="Tidak ada paket yang cocok dengan kriteria Anda" />
              {hasActiveFilters && (
                <div className="flex justify-center mt-6">
                  <Button onClick={handleClearFilters} variant="outline">
                    Hapus Filter
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Paket"
        onClear={handleClearFilters}
      >
        <FilterSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
          selectedPriceRange={selectedPriceRange}
          onPriceRangeChange={setSelectedPriceRange}
          featuredOnly={featuredOnly}
          onFeaturedOnlyChange={setFeaturedOnly}
          categories={categories}
        />
      </FilterDrawer>
      </SectionContainer>
    </>
  );
}
