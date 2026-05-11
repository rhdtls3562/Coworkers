'use client';

/**
 * 게시글 작성·수정에서 저장하지 않은 변경사항이 있을 때 이탈·전역 UI 클릭을 막는 훅입니다.
 */

import { useEffect, useRef } from 'react';

import {
  attachBoardFormUnsavedGuard,
  type BoardFormUnsavedIntent,
} from '@/app/(service)/boards/utils/attachBoardFormUnsavedGuard';
import { useToast } from '@/components/common/toast';

type UseBoardFormUnsavedChangesGuardParams = {
  hasUnsavedChanges: boolean;
  intent: BoardFormUnsavedIntent;
  onDiscardChanges: () => void;
};

export default function useBoardFormUnsavedChangesGuard({
  hasUnsavedChanges,
  intent,
  onDiscardChanges,
}: UseBoardFormUnsavedChangesGuardParams) {
  const { showToast, removeToast } = useToast();
  const isToastVisibleRef = useRef(false);
  const isBlockedPointerDownRef = useRef(false);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return;
    }

    return attachBoardFormUnsavedGuard({
      intent,
      isBlockedPointerDownRef,
      isToastVisibleRef,
      onDiscardChanges,
      removeToast,
      showToast,
      toastTimeoutRef,
    });
  }, [hasUnsavedChanges, intent, onDiscardChanges, removeToast, showToast]);
}
