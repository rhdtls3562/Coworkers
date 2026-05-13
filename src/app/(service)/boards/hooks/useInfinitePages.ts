'use client';

/**
 * TanStack Query 무한 쿼리의 pages 배열을 페이지별 list를 이어 붙인 단일 배열로 만드는 훅입니다.
 */

import { useMemo } from 'react';

type InfinitePage<TItem> = {
  list?: TItem[];
};

type UseInfinitePagesParams = {
  pages?: unknown[];
};

export function useInfinitePages<TItem>({ pages }: UseInfinitePagesParams) {
  return useMemo(() => {
    if (!pages) {
      return [];
    }

    const pageLists = pages.map((page) => {
      const list = (page as InfinitePage<TItem>).list;

      return Array.isArray(list) ? list : [];
    });

    return pageLists.flat();
  }, [pages]);
}
