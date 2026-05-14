'use client';

/**
 * 날짜 스트립의 좌우 스크롤 가능 여부를 감지해 페이드 표시 상태를 계산합니다.
 */

import { useEffect, useState } from 'react';

import type { UseTaskListWeekStripFadeReturn } from '@/app/(service)/[teamid]/tasklist/types';

const SCROLL_EDGE_THRESHOLD = 2;

export default function useTaskListWeekStripFade(
  scrollElementRef: React.RefObject<HTMLUListElement | null>,
): UseTaskListWeekStripFadeReturn {
  const [fadeState, setFadeState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  useEffect(() => {
    const scrollElement = scrollElementRef.current;

    if (!scrollElement) {
      setFadeState({
        canScrollLeft: false,
        canScrollRight: false,
      });
      return;
    }

    const updateFadeState = () => {
      const { clientWidth, scrollLeft, scrollWidth } = scrollElement;
      const maxScrollLeft = scrollWidth - clientWidth;

      setFadeState({
        canScrollLeft: scrollLeft > SCROLL_EDGE_THRESHOLD,
        canScrollRight: maxScrollLeft - scrollLeft > SCROLL_EDGE_THRESHOLD,
      });
    };

    updateFadeState();

    const resizeObserver = new ResizeObserver(updateFadeState);
    resizeObserver.observe(scrollElement);

    scrollElement.addEventListener('scroll', updateFadeState, {
      passive: true,
    });
    window.addEventListener('resize', updateFadeState);

    return () => {
      resizeObserver.disconnect();
      scrollElement.removeEventListener('scroll', updateFadeState);
      window.removeEventListener('resize', updateFadeState);
    };
  }, [scrollElementRef]);

  return { fadeState };
}
