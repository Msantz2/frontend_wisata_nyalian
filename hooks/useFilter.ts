"use client";

import { useState, useMemo } from "react";
import { filterData } from "@/utils/filterData";

export function useFilter<T>(items: T[]) {
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const results = useMemo(() => {
    return filterData(items, filters);
  }, [items, filters]);

  const updateFilter = (key: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    setFilters,
    updateFilter,
    removeFilter,
    clearFilters,
    results,
  };
}
