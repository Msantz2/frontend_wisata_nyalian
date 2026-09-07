"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useFilter } from "@/hooks/useFilter";
import { usePagination } from "@/hooks/usePagination";
import { sortData } from "@/utils/sortData";
import { PAGINATION } from "@/lib/constants";
import type { Destination } from "@/types/destination";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import SearchInput from "@/components/shared/SearchInput";
import SortDropdown from "@/components/shared/SortDropdown";
import FilterSidebar from "@/components/destination/FilterSidebar";
import FilterDrawer from "@/components/shared/FilterDrawer";
import DestinationGrid from "@/components/destination/DestinationGrid";
import PaginationControls from "@/components/shared/PaginationControls";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

const sortOptions = [
  { label: "Unggulan", value: "featured" },
  { label: "Nama A-Z", value: "name-asc" },
  { label: "Nama Z-A", value: "name-desc" },
  { label: "Rating Tertinggi", value: "rating-desc" },
];

interface DestinationsClientProps {
  destinations: Destination[];
}

export default function DestinationsClient({ destinations }: DestinationsClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const categories = useMemo(() => {
    const cats = destinations.map((d) => d.category);
    return Array.from(new Set(cats)).sort();
  }, [destinations]);

  const facilities = useMemo(() => {
    const facs = destinations.flatMap((d) => d.facilities);
    return Array.from(new Set(facs)).sort();
  }, [destinations]);

  const { query, setQuery, results: searchResults } = useSearch(
    destinations,
    ["name", "shortDescription", "category", "location.village", "location.address"]
  );

  const { results: filteredResults } = useFilter(searchResults);

  const manualFiltered = useMemo(() => {
    let result = filteredResults;

    if (selectedCategory) {
      result = result.filter((d) => d.category === selectedCategory);
    }

    if (selectedFacilities.length > 0) {
      result = result.filter((d) =>
        selectedFacilities.every((f) => d.facilities.includes(f))
      );
    }

    if (featuredOnly) {
      result = result.filter((d) => d.featured);
    }

    return result;
  }, [filteredResults, selectedCategory, selectedFacilities, featuredOnly]);

  const sortedResults = useMemo(() => {
    return sortData(manualFiltered, sortBy);
  }, [manualFiltered, sortBy]);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
  } = usePagination(sortedResults, PAGINATION.DESTINATIONS_PER_PAGE);

  const hasActiveFilters = query || selectedCategory || selectedFacilities.length > 0 || featuredOnly;

  const handleClearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedFacilities([]);
    setFeaturedOnly(false);
    setSortBy("featured");
  };

  return (
    <>
      <SectionContainer className="py-12">
        <SectionTitle
          title="Jelajahi Destinasi"
          subtitle="Temukan keindahan alam dan warisan budaya Desa Nyalian"
          align="center"
        />

      <div className="mb-8">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari destinasi..."
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedFacilities={selectedFacilities}
            onFacilitiesChange={setSelectedFacilities}
            featuredOnly={featuredOnly}
            onFeaturedOnlyChange={setFeaturedOnly}
            categories={categories}
            facilities={facilities}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <p className="text-text-secondary">
              {sortedResults.length} {sortedResults.length === 1 ? "destinasi" : "destinasi"} ditemukan
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
              <DestinationGrid destinations={paginatedItems} />
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
              <EmptyState message="Tidak ada destinasi yang cocok dengan kriteria pencarian Anda" />
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
        title="Filter Destinasi"
        onClear={handleClearFilters}
      >
        <FilterSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedFacilities={selectedFacilities}
          onFacilitiesChange={setSelectedFacilities}
          featuredOnly={featuredOnly}
          onFeaturedOnlyChange={setFeaturedOnly}
          categories={categories}
          facilities={facilities}
        />
      </FilterDrawer>
      </SectionContainer>
    </>
  );
}
