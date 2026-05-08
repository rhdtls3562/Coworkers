'use client';

import { useEffect, useRef } from 'react';

import { BOARD_LIST_LOAD_MORE_ROOT_MARGIN } from '@/app/(service)/boards/constants';

type UseInfiniteScrollObserverParams = {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  rootMargin?: string;
};

export function useInfiniteScrollObserver({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  rootMargin = BOARD_LIST_LOAD_MORE_ROOT_MARGIN,
}: UseInfiniteScrollObserverParams) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = sentinelRef.current;

    if (!target || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin]);

  return sentinelRef;
}
