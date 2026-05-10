'use client';

/**
 * 게시글 수정 화면에서 저장하지 않은 변경사항이 있을 때 링크 이탈을 막는 훅입니다.
 */

import { useEffect, useRef } from 'react';

import { useToast } from '@/components/common/toast';

const BOARD_EDIT_UNSAVED_TOAST_DURATION = 3000;

function shouldBlockBoardEditNavigation(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('a[href]'));
}

type UseBoardEditUnsavedChangesGuardParams = {
  hasUnsavedChanges: boolean;
  onDiscardChanges: () => void;
};

export default function useBoardEditUnsavedChangesGuard({
  hasUnsavedChanges,
  onDiscardChanges,
}: UseBoardEditUnsavedChangesGuardParams) {
  const { showToast, removeToast } = useToast();
  const isToastVisibleRef = useRef(false);
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
      return;
    }

    const showUnsavedChangesToast = () => {
      if (isToastVisibleRef.current) {
        return;
      }

      isToastVisibleRef.current = true;
      const toastId = showToast('저장하지 않은 변경사항이 있어요!', 'error', {
        hideCloseButton: true,
        label: '변경사항 취소',
        onClick: onDiscardChanges,
        textClassName: 'text-status-danger',
      });

      toastTimeoutRef.current = window.setTimeout(() => {
        removeToast(toastId);
        isToastVisibleRef.current = false;
        toastTimeoutRef.current = null;
      }, BOARD_EDIT_UNSAVED_TOAST_DURATION);
    };

    const blockNavigation = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      showUnsavedChangesToast();
    };

    const handlePointerDownCapture = (event: PointerEvent) => {
      if (!shouldBlockBoardEditNavigation(event.target)) {
        return;
      }

      isBlockedPointerDownRef.current = true;
      blockNavigation(event);
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (isBlockedPointerDownRef.current) {
        isBlockedPointerDownRef.current = false;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

      if (!shouldBlockBoardEditNavigation(event.target)) {
        return;
      }

      blockNavigation(event);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    document.addEventListener('pointerdown', handlePointerDownCapture, true);
    document.addEventListener('click', handleClickCapture, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = null;
      }
      isToastVisibleRef.current = false;
      document.removeEventListener(
        'pointerdown',
        handlePointerDownCapture,
        true,
      );
      document.removeEventListener('click', handleClickCapture, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, onDiscardChanges, removeToast, showToast]);
}
