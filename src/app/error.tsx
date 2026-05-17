/** 앱 전역 에러 바운더리 컴포넌트입니다. */

// app/error.tsx
'use client';

import { useEffect } from 'react';

import { ErrorProps } from '@/app/types';
import { IcError } from '@/assets/index';

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <div className="w-full h-full flex min-h-screen bg-background-secondary flex-col justify-center items-center gap-8 px-6 md:gap-12">
        <IcError
          width={111}
          height={110}
          aria-hidden="true"
          className="h-25 md:h-35 md:w-39"
        />
        <div className="flex flex-col gap-3 md:gap-4">
          <p className="font-semibold text-text-secondary text-xl md:text-2xl">
            일시적인 오류가 발생했어요.
          </p>
          <p className="text-center font-medium text-text-default text-base">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center bg-brand-primary text-text-inverse hover:bg-interaction-hover font-semibold text-base leading-4.75 max-w-115 w-fit h-12 py-3.5 rounded-xl px-10"
        >
          다시 시도
        </button>
      </div>
    </>
  );
}
