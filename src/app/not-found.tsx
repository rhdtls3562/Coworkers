/** 404 Not Found 페이지 컴포넌트입니다. */

// app/not-found.tsx
import Image from 'next/image';
import Link from 'next/link';

import { imgNoTeam } from '@/assets/index';

export default function NotFound() {
  return (
    <div className="w-full h-full flex min-h-screen bg-background-secondary flex-col justify-center items-center gap-8 px-6">
      <Image
        src={imgNoTeam}
        width={404}
        height={264}
        alt=""
        className="w-46 md:w-80 xl:w-101"
      />
      <p className="font-medium text-text-default text-xl md:text-2xl">
        페이지를 찾을 수 없어요.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center bg-brand-primary text-text-inverse hover:bg-interaction-hover font-semibold text-base leading-4.75 max-w-115 w-fit h-12 py-3.5 rounded-xl px-10"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
