'use client';

import { useEffect, useRef } from 'react';

import { RIGHT_PANEL_UNSAVED_TOAST_DURATION } from '@/components/common/rightPanel/constants';
import { registerRightPanelUnsavedGuard } from '@/components/common/rightPanel/utils/rightPanelUnsavedRegistry';
import shouldBlockUnsavedInteraction from '@/components/common/rightPanel/utils/shouldBlockUnsavedInteraction';
import { useToast } from '@/components/common/toast';

type UseUnsavedChangesToastGuardParams = {
  hasUnsavedChanges: boolean;
  onDiscardChanges: () => void;
};

export default function useUnsavedChangesToastGuard({
  hasUnsavedChanges,
  onDiscardChanges,
}: UseUnsavedChangesToastGuardParams) {
  const { showToast } = useToast();
  const isUnsavedToastVisibleRef = useRef(false);
  const isBlockedPointerDownRef = useRef(false);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      registerRightPanelUnsavedGuard(null);
      return;
    }

    const showUnsavedChangesToast = () => {
      if (isUnsavedToastVisibleRef.current) {
        return;
      }

      isUnsavedToastVisibleRef.current = true;
      showToast('저장하지 않은 변경사항이 있어요!', 'error', {
        hideCloseButton: true,
        label: '변경사항 취소',
        onClick: onDiscardChanges,
        textClassName: 'text-status-danger',
      });

      toastTimeoutRef.current = window.setTimeout(() => {
        isUnsavedToastVisibleRef.current = false;
        toastTimeoutRef.current = null;
      }, RIGHT_PANEL_UNSAVED_TOAST_DURATION);
    };

    registerRightPanelUnsavedGuard(showUnsavedChangesToast);

    const blockInteraction = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      showUnsavedChangesToast();
    };

    const handlePointerDownCapture = (event: PointerEvent) => {
      if (!shouldBlockUnsavedInteraction(event.target)) {
        return;
      }

      isBlockedPointerDownRef.current = true;
      blockInteraction(event);
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (isBlockedPointerDownRef.current) {
        isBlockedPointerDownRef.current = false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

      if (!shouldBlockUnsavedInteraction(event.target)) {
        return;
      }

      blockInteraction(event);
    };

    document.addEventListener('pointerdown', handlePointerDownCapture, true);
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      registerRightPanelUnsavedGuard(null);
      document.removeEventListener(
        'pointerdown',
        handlePointerDownCapture,
        true,
      );
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, [hasUnsavedChanges, onDiscardChanges, showToast]);
}
