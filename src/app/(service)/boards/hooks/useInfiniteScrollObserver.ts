'use client';

import { useEffect, useRef } from 'react';

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
  rootMargin = '200px',
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
