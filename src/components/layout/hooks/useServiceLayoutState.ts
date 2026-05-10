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

export default function useServiceLayoutState(): ServiceLayoutContextValue {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [rightPanelContent, setRightPanelContent] =
    useState<RightPanelContent | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
      },
    });
  }, [closeAnimatedRightPanel, isRightPanelRendered]);

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
      isMobileSidebarVisible,
      isRightPanelVisible,
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
