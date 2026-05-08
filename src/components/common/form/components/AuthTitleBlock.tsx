/**
 * 로그인/회원가입 카드 상단 로고와 제목을 렌더링하는 공통 블록입니다.
 */

import Link from 'next/link';

import FullLogo from '@/components/common/logo/FullLogo';
import { ROUTES } from '@/constants/ROUTES';

type AuthTitleBlockProps = {
  title: string;
};

export default function AuthTitleBlock({ title }: AuthTitleBlockProps) {
  return (
    <>
      <h1 className="mb-8 flex justify-center md:mb-10">
        <Link href={ROUTES.HOME} aria-label="Coworkers 홈으로 이동">
          <FullLogo
            size="auth"
            className="origin-center scale-90 md:scale-100"
          />
        </Link>
      </h1>

      <h2 className="mb-6 text-center text-base font-semibold text-text-primary md:mb-8 md:text-lg">
        {title}
      </h2>
    </>
  );
}
