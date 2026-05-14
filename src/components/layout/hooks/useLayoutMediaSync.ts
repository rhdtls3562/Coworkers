'use client';

/**
 * 뷰포트 크기에 따라 사이드바 기본 펼침 상태를 동기화하는 훅입니다.
 */

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { SIDEBAR_DESKTOP_MEDIA_QUERY } from '@/components/layout/sidebar/constants';

type UseLayoutMediaSyncParams = {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
};

export default function useLayoutMediaSync({
  isSidebarExpanded,
  setIsSidebarExpanded,
}: UseLayoutMediaSyncParams) {
  const desktopSidebarExpandedRef = useRef(true);
  const isDesktopRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isDesktopRef.current) {
      return;
    }

    desktopSidebarExpandedRef.current = isSidebarExpanded;
  }, [isSidebarExpanded]);

  useLayoutEffect(() => {
    const sidebarMediaQuery = window.matchMedia(SIDEBAR_DESKTOP_MEDIA_QUERY);

    const syncInitialSidebarState = () => {
      const isDesktop = sidebarMediaQuery.matches;

      isDesktopRef.current = isDesktop;
      desktopSidebarExpandedRef.current = isDesktop;
      setIsSidebarExpanded(isDesktop);
    };

    const handleSidebarMediaChange = () => {
      const nextIsDesktop = sidebarMediaQuery.matches;
      const previousIsDesktop = isDesktopRef.current;

      if (previousIsDesktop === nextIsDesktop) {
        return;
      }

      if (nextIsDesktop) {
        setIsSidebarExpanded(desktopSidebarExpandedRef.current);
      } else {
        setIsSidebarExpanded(false);
      }

      isDesktopRef.current = nextIsDesktop;
    };

    syncInitialSidebarState();

    sidebarMediaQuery.addEventListener('change', handleSidebarMediaChange);

    return () => {
      sidebarMediaQuery.removeEventListener('change', handleSidebarMediaChange);
    };
  }, [setIsSidebarExpanded]);
}
