'use client';

/**
 * 계정 설정 폼의 기준값 동기화와 dirty 상태 계산을 담당하는 훅입니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type UseAccountDirtyStateParams = {
  initialImage?: string | null;
  initialName: string;
  isDirty: boolean;
  onDirtyChange: (value: boolean) => void;
  resetName: (name: string) => void;
};

export default function useAccountDirtyState({
  initialImage,
  initialName,
  isDirty,
  onDirtyChange,
  resetName,
}: UseAccountDirtyStateParams) {
  const imageRef = useRef<string | null>(initialImage ?? null);
  const baseNameRef = useRef<string>(initialName ?? '');
  const baseImageRef = useRef<string | null>(initialImage ?? null);
  const [imageResetKey, setImageResetKey] = useState(0);

  useEffect(() => {
    if (isDirty) {
      return;
    }

    baseNameRef.current = initialName ?? '';
    baseImageRef.current = initialImage ?? null;
    imageRef.current = initialImage ?? null;
    resetName(baseNameRef.current);
  }, [initialImage, initialName, isDirty, resetName]);

  const checkIsDirty = useCallback(
    (currentName: string) => {
      const nameChanged = currentName !== baseNameRef.current;
      const imageChanged = imageRef.current !== baseImageRef.current;
      onDirtyChange(nameChanged || imageChanged);
    },
    [onDirtyChange],
  );

  const handleDiscardChanges = useCallback(() => {
    resetName(baseNameRef.current);
    imageRef.current = baseImageRef.current;
    setImageResetKey((prev) => prev + 1);
    onDirtyChange(false);
  }, [onDirtyChange, resetName]);

  return {
    baseImageRef,
    baseNameRef,
    checkIsDirty,
    handleDiscardChanges,
    imageRef,
    imageResetKey,
  } as const;
}
