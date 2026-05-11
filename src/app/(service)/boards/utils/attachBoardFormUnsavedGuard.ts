/**
 * 게시글 작성·수정 화면에서 미저장 변경이 있을 때 document·window 이벤트를 붙였다 떼는 유틸리티 함수입니다.
 */

import type { MutableRefObject } from 'react';

import shouldBlockBoardFormInteraction from '@/app/(service)/boards/utils/boardFormShouldBlockInteraction';
import type { ToastAction } from '@/components/common/toast/types';

const BOARD_FORM_UNSAVED_TOAST_DURATION = 3000;

export type BoardFormUnsavedIntent = 'create' | 'edit';

const UNSAVED_TOAST_COPY: Record<
  BoardFormUnsavedIntent,
  { discardLabel: string; message: string }
> = {
  create: {
    message: '아직 게시글을 작성하지 않았어요!',
    discardLabel: '작성 취소',
  },
  edit: {
    message: '저장하지 않은 변경사항이 있어요!',
    discardLabel: '변경사항 취소',
  },
};

type ShowToastFn = (
  message: string,
  type: 'error',
  action?: ToastAction,
) => string;

type AttachBoardFormUnsavedGuardParams = {
  intent: BoardFormUnsavedIntent;
  isBlockedPointerDownRef: MutableRefObject<boolean>;
  isToastVisibleRef: MutableRefObject<boolean>;
  onDiscardChanges: () => void;
  removeToast: (id: string) => void;
  showToast: ShowToastFn;
  toastTimeoutRef: MutableRefObject<number | null>;
};

export function attachBoardFormUnsavedGuard({
  intent,
  isBlockedPointerDownRef,
  isToastVisibleRef,
  onDiscardChanges,
  removeToast,
  showToast,
  toastTimeoutRef,
}: AttachBoardFormUnsavedGuardParams): () => void {
  const { discardLabel, message } = UNSAVED_TOAST_COPY[intent];

  const showUnsavedChangesToast = () => {
    if (isToastVisibleRef.current) {
      return;
    }

    isToastVisibleRef.current = true;
    const toastId = showToast(message, 'error', {
      hideCloseButton: true,
      label: discardLabel,
      onClick: onDiscardChanges,
      textClassName: 'text-status-danger',
    });

    toastTimeoutRef.current = window.setTimeout(() => {
      removeToast(toastId);
      isToastVisibleRef.current = false;
      toastTimeoutRef.current = null;
    }, BOARD_FORM_UNSAVED_TOAST_DURATION);
  };

  const blockNavigation = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showUnsavedChangesToast();
  };

  const handlePointerDownCapture = (event: PointerEvent) => {
    if (!shouldBlockBoardFormInteraction(event.target)) {
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

    if (!shouldBlockBoardFormInteraction(event.target)) {
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
    document.removeEventListener('pointerdown', handlePointerDownCapture, true);
    document.removeEventListener('click', handleClickCapture, true);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
