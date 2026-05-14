'use client';

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
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
