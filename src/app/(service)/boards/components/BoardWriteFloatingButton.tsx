'use client';

import { useRouter } from 'next/navigation';

import { IcPencil } from '@/assets';
import { FloatingButton } from '@/components/common/button';
import { ROUTES } from '@/constants/ROUTES';
import { buildLoginPath } from '@/utils/authRedirect';
import { hasAuthSession } from '@/utils/authSession';

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
    >
      <IcPencil width={24} height={24} aria-hidden="true" />
    </FloatingButton>
  );
}
