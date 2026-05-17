/** 페이지 전환 시 표시하는 전역 로더 컴포넌트입니다. */

// app/globalLoader.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalLoader() {
  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.display = 'none';
  }, []);

  return (
    <div
      id="global-loader"
      className="flex flex-col items-center justify-center gap-6"
    >
      <span className="loader">
        <span className="loader-inner" />
      </span>
      <p className="font-medium text-text-default text-base">
        잠시만 기다려주세요.
      </p>
    </div>
  );
}
