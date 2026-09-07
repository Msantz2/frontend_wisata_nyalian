"use client";

import { useState, useMemo, useCallback } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / pageSize);
  }, [items.length, pageSize]);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, page, pageSize]);

  const setPageSafe = useCallback((newPage: number | ((prev: number) => number)) => {
    setPage((prevPage) => {
      const nextPage = typeof newPage === "function" ? newPage(prevPage) : newPage;
      const calculatedTotalPages = Math.ceil(items.length / pageSize);
      return nextPage > calculatedTotalPages && calculatedTotalPages > 0 ? 1 : nextPage;
    });
  }, [items.length, pageSize]);

  return {
    page,
    setPage: setPageSafe,
    totalPages,
    paginatedItems,
  };
}
