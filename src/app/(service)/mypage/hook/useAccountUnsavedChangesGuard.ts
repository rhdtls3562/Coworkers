'use client';

/**
 * 계정 설정 페이지에서 저장하지 않은 변경사항이 있을 때 이탈 시도를 막는 훅입니다.
 */

import { useEffect, useRef } from 'react';

import { useToast } from '@/components/common/toast';

const ACCOUNT_UNSAVED_TOAST_DURATION = 3000;

function shouldBlockAccountPageNavigation(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('a[href]'));
}

type UseAccountUnsavedChangesGuardParams = {
  hasUnsavedChanges: boolean;
  onDiscardChanges: () => void;
};

export default function useAccountUnsavedChangesGuard({
  hasUnsavedChanges,
  onDiscardChanges,
}: UseAccountUnsavedChangesGuardParams) {
  const { showToast } = useToast();
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
      showToast('저장하지 않은 변경사항이 있어요!', 'error', {
        hideCloseButton: true,
        label: '변경사항 취소하기',
        onClick: onDiscardChanges,
        textClassName: 'text-status-danger',
      });

      toastTimeoutRef.current = window.setTimeout(() => {
        isToastVisibleRef.current = false;
        toastTimeoutRef.current = null;
      }, ACCOUNT_UNSAVED_TOAST_DURATION);
    };

    const blockNavigation = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      showUnsavedChangesToast();
    };

    const handlePointerDownCapture = (event: PointerEvent) => {
      if (!shouldBlockAccountPageNavigation(event.target)) {
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

      if (!shouldBlockAccountPageNavigation(event.target)) {
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
      document.removeEventListener(
        'pointerdown',
        handlePointerDownCapture,
        true,
      );
      document.removeEventListener('click', handleClickCapture, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, onDiscardChanges, showToast]);
}
