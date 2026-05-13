'use client';

/**
 * 원격 이미지 onError 시 폴백 UI로 전환할지 여부를 관리하는 훅입니다.
 */

import { useCallback, useState } from 'react';

export function useImageLoadFallback() {
  const [isRemoteFailed, setIsRemoteFailed] = useState(false);

  const onRemoteError = useCallback(() => {
    setIsRemoteFailed(true);
  }, []);

  return { isRemoteFailed, onRemoteError };
}
