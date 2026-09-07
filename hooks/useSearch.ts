"use client";

import { useState, useMemo } from "react";
import { searchData } from "@/utils/searchData";

export function useSearch<T>(
  items: T[],
  fields: (keyof T | string)[]
) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return searchData(items, query, fields);
  }, [items, query, fields]);

  return {
    query,
    setQuery,
    results,
  };
}
