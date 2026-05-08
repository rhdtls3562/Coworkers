'use client';

import { useMemo, useState } from 'react';

type UsePaginationParams<TItem> = {
  initialPage?: number;
  items: TItem[];
  pageSize: number;
};

export function usePagination<TItem>({
  initialPage = 1,
  items,
  pageSize,
}: UsePaginationParams<TItem>) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => {
    if (items.length === 0 || pageSize <= 0) {
      return 0;
    }

    return Math.ceil(items.length / pageSize);
  }, [items, pageSize]);

  // 데이터 변경에도 항상 유효한 페이지 범위를 유지.
  const safeCurrentPage = useMemo(() => {
    if (totalPages <= 0) {
      return 1;
    }

    return Math.min(Math.max(currentPage, 1), totalPages);
  }, [currentPage, totalPages]);

  const currentItems = useMemo(() => {
    if (items.length === 0 || totalPages === 0) {
      return [];
    }

    const start = (safeCurrentPage - 1) * pageSize;

    return items.slice(start, start + pageSize);
  }, [items, pageSize, safeCurrentPage, totalPages]);

  const handlePrevPage = () => {
    if (totalPages <= 0) {
      return;
    }

    const prevPage = safeCurrentPage <= 1 ? totalPages : safeCurrentPage - 1;
    setCurrentPage(prevPage);
  };

  const handleNextPage = () => {
    if (totalPages <= 0) {
      return;
    }

    const nextPage = safeCurrentPage >= totalPages ? 1 : safeCurrentPage + 1;
    setCurrentPage(nextPage);
  };

  const handlePageSelect = (page: number) => {
    if (totalPages <= 0) {
      return;
    }

    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  return {
    currentItems,
    currentPage: safeCurrentPage,
    handleNextPage,
    handlePageSelect,
    handlePrevPage,
    totalPages,
  };
}
