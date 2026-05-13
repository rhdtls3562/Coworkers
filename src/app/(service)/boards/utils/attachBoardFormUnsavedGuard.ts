/**
 * 게시글 작성·수정 화면에서 미저장 변경이 있을 때 document·window 이벤트를 붙였다 떼는 유틸리티 함수입니다.
 */

import shouldBlockBoardFormInteraction from '@/app/(service)/boards/utils/boardFormShouldBlockInteraction';
import {
  BOARD_FORM_UNSAVED_TOAST_COPY,
  BOARD_FORM_UNSAVED_TOAST_DURATION,
  type BoardFormUnsavedIntent,
} from '@/app/(service)/boards/utils/boardFormUnsavedGuardConstants';
import type { ToastAction } from '@/components/common/toast/types';
import { ROUTES } from '@/constants/ROUTES';

type ShowToastFn = (
  message: string,
  type: 'error',
  action?: ToastAction,
) => string;

type AttachBoardFormUnsavedGuardParams = {
  intent: BoardFormUnsavedIntent;
  isBlockedPointerDownRef: React.MutableRefObject<boolean>;
  isToastVisibleRef: React.MutableRefObject<boolean>;
  onDiscardChanges: () => void;
  removeToast: (id: string) => void;
  showToast: ShowToastFn;
  toastTimeoutRef: React.MutableRefObject<number | null>;
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
  const { discardLabel, message } = BOARD_FORM_UNSAVED_TOAST_COPY[intent];

  const moveToBoardsMain = () => {
    onDiscardChanges();
    window.location.assign(ROUTES.BOARDS);
  };

  const isDiscardToastButton = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return target.textContent?.trim() === discardLabel;
  };

  const tryHandleDiscardButtonInteraction = (event: Event) => {
    if (!isDiscardToastButton(event.target)) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    moveToBoardsMain();
    return true;
  };

  const showUnsavedChangesToast = () => {
    if (isToastVisibleRef.current) {
      return;
    }

    isToastVisibleRef.current = true;

    const toastId = showToast(message, 'error', {
      hideCloseButton: true,
      label: discardLabel,
      onClick: moveToBoardsMain,
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
    if (tryHandleDiscardButtonInteraction(event)) {
      return;
    }

    if (!shouldBlockBoardFormInteraction(event.target)) {
      return;
    }

    isBlockedPointerDownRef.current = true;
    blockNavigation(event);
  };

  const handleClickCapture = (event: MouseEvent) => {
    if (tryHandleDiscardButtonInteraction(event)) {
      return;
    }

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
