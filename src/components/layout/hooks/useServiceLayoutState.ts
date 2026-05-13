/**
 * 서비스 레이아웃의 사이드바, 모바일 오버레이, 오른쪽 패널 상태를 관리하는 훅입니다.
 */

'use client';

import { useCallback, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import type { RightPanelContent } from '@/components/common/rightPanel';
import { getRightPanelUnsavedGuard } from '@/components/common/rightPanel/utils/rightPanelUnsavedRegistry';
import useAnimatedVisibility from '@/components/layout/hooks/useAnimatedVisibility';
import useCloseLayoutOverlayOnPathChange from '@/components/layout/hooks/useCloseLayoutOverlayOnPathChange';
import useLayoutMediaSync from '@/components/layout/hooks/useLayoutMediaSync';
import useLockBodyScroll from '@/components/layout/hooks/useLockBodyScroll';
import type { ServiceLayoutContextValue } from '@/components/layout/types';

const OVERLAY_ANIMATION_DURATION = 300;
const MOBILE_LAYOUT_MAX_WIDTH = 768;

export default function useServiceLayoutState(): ServiceLayoutContextValue {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [rightPanelContent, setRightPanelContent] =
    useState<RightPanelContent | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileRightPanelScrollRef = useRef<{
    pathname: string;
    scrollY: number;
  } | null>(null);
  const {
    close: closeMobileSidebar,
    isRendered: isMobileSidebarRendered,
    isVisible: isMobileSidebarVisible,
    open: openMobileSidebar,
  } = useAnimatedVisibility({
    duration: OVERLAY_ANIMATION_DURATION,
  });
  const {
    close: closeAnimatedRightPanel,
    isRendered: isRightPanelRendered,
    isVisible: isRightPanelVisible,
    open: openRightPanelAnimated,
  } = useAnimatedVisibility({
    duration: OVERLAY_ANIMATION_DURATION,
  });

  const isMobileLayoutViewport = useCallback(() => {
    return window.innerWidth < MOBILE_LAYOUT_MAX_WIDTH;
  }, []);

  const restoreMobileRightPanelScroll = useCallback(() => {
    const savedScroll = mobileRightPanelScrollRef.current;

    mobileRightPanelScrollRef.current = null;

    if (!savedScroll || !isMobileLayoutViewport()) {
      return;
    }

    if (window.location.pathname !== savedScroll.pathname) {
      return;
    }

    window.scrollTo({ top: savedScroll.scrollY, behavior: 'auto' });
  }, [isMobileLayoutViewport]);

  const closeRightPanel = useCallback(() => {
    const unsavedGuard = getRightPanelUnsavedGuard();

    if (unsavedGuard) {
      unsavedGuard();
      return;
    }

    if (!isRightPanelRendered) {
      setRightPanelContent(null);
      return;
    }

    closeAnimatedRightPanel({
      onAfterClose: () => {
        setRightPanelContent(null);
        restoreMobileRightPanelScroll();
      },
    });
  }, [
    closeAnimatedRightPanel,
    isRightPanelRendered,
    restoreMobileRightPanelScroll,
  ]);

  const handleSidebarInteraction = useCallback(() => {
    if (isRightPanelRendered) {
      closeRightPanel();
    }

    if (!isMobileSidebarVisible) {
      return;
    }

    closeMobileSidebar();
  }, [
    closeMobileSidebar,
    closeRightPanel,
    isMobileSidebarVisible,
    isRightPanelRendered,
  ]);

  const toggleSidebar = useCallback(() => {
    if (isRightPanelRendered) {
      closeRightPanel();
    }

    setIsSidebarExpanded((prev) => !prev);
  }, [closeRightPanel, isRightPanelRendered]);

  const toggleMobileSidebar = useCallback(() => {
    if (isMobileSidebarVisible) {
      closeMobileSidebar({
        onAfterClose: () => {
          menuButtonRef.current?.focus();
        },
      });
      return;
    }

    if (isRightPanelRendered) {
      closeRightPanel();
    }

    openMobileSidebar();
  }, [
    closeMobileSidebar,
    closeRightPanel,
    isMobileSidebarVisible,
    isRightPanelRendered,
    openMobileSidebar,
  ]);

  const openRightPanel = useCallback(
    (content: RightPanelContent) => {
      setRightPanelContent(content);
      setIsSidebarExpanded(false);

      if (isMobileLayoutViewport()) {
        if (
          !isRightPanelVisible &&
          mobileRightPanelScrollRef.current === null
        ) {
          mobileRightPanelScrollRef.current = {
            pathname,
            scrollY: window.scrollY,
          };
        }

        window.scrollTo({ top: 0, behavior: 'auto' });
      }

      if (isMobileSidebarVisible) {
        closeMobileSidebar();
      }

      if (isRightPanelVisible) {
        return;
      }

      openRightPanelAnimated();
    },
    [
      closeMobileSidebar,
      isMobileLayoutViewport,
      isMobileSidebarVisible,
      isRightPanelVisible,
      pathname,
      openRightPanelAnimated,
    ],
  );

  useLayoutMediaSync({
    isSidebarExpanded,
    setIsSidebarExpanded,
  });

  useCloseLayoutOverlayOnPathChange({
    closeMobileSidebar,
    closeRightPanel,
    isMobileSidebarVisible,
    isRightPanelRendered,
    pathname,
  });

  useLockBodyScroll({
    isScrollLocked: isMobileSidebarRendered || isRightPanelVisible,
  });

  return {
    closeRightPanel,
    handleSidebarInteraction,
    isMobileSidebarRendered,
    isMobileSidebarVisible,
    isRightPanelRendered,
    isRightPanelVisible,
    isSidebarExpanded,
    menuButtonRef,
    openRightPanel,
    rightPanelContent,
    toggleMobileSidebar,
    toggleSidebar,
  };
}
