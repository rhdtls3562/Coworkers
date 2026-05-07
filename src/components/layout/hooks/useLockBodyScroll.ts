'use client';

import { useEffect } from 'react';

type UseLockBodyScrollParams = {
  isScrollLocked: boolean;
};

export default function useLockBodyScroll({
  isScrollLocked,
}: UseLockBodyScrollParams) {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = isScrollLocked ? 'hidden' : '';
    document.documentElement.style.overflow = isScrollLocked ? 'hidden' : '';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isScrollLocked]);
}
