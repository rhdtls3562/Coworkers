'use client';

import { useCallback, useState } from 'react';

export function useImageLoadFallback() {
  const [isRemoteFailed, setIsRemoteFailed] = useState(false);

  const onRemoteError = useCallback(() => {
    setIsRemoteFailed(true);
  }, []);

  return { isRemoteFailed, onRemoteError };
}
