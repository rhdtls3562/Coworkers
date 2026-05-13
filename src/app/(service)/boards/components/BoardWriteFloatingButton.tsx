'use client';

import { useRouter } from 'next/navigation';

import { IcPencil } from '@/assets';
import { FloatingButton } from '@/components/common/button';
import { ROUTES } from '@/constants/ROUTES';
import { buildLoginPath } from '@/utils/authRedirect';
import { hasAuthSession } from '@/utils/authSession';

/**
 * 채용/홍보 게시글 작성용 플로팅 액션 버튼입니다.
 */
export default function BoardWriteFloatingButton() {
  const router = useRouter();
  const writePath = `${ROUTES.BOARDS}?write=true`;

  const handleClick = () => {
    if (!hasAuthSession()) {
      router.push(
        buildLoginPath({
          notice: 'auth-required',
          redirectTo: writePath,
        }),
        {
          scroll: false,
        },
      );
      return;
    }

    router.push(writePath, { scroll: false });
  };

  return (
    <FloatingButton
      type="button"
      aria-label="게시글 작성"
      onClick={handleClick}
      className="bottom-24 right-6 z-40 md:bottom-28 md:right-10"
      buttonClassName="size-14 md:size-16"
    >
      <IcPencil
        width={28}
        height={28}
        className="size-7 brightness-0 invert md:size-8"
        aria-hidden="true"
      />
    </FloatingButton>
  );
}
