/**
 * 채용 / 홍보 페이지를 구성하는 파일입니다.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import BoardBestList from '@/app/(service)/boards/components/BoardBestList';
import BoardHeader from '@/app/(service)/boards/components/BoardHeader';
import BoardList from '@/app/(service)/boards/components/BoardList';
import BoardWriteFloatingButton from '@/app/(service)/boards/components/BoardWriteFloatingButton';
import PostCreateForm from '@/app/(service)/boards/components/PostCreateForm';
import { isSearchMode } from '@/app/(service)/boards/utils/boardUtils';
import { ROUTES } from '@/constants/ROUTES';
import { buildLoginPath } from '@/utils/authRedirect';

export default async function BoardsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; write?: string }>;
}) {
  const parsedParams = await searchParams;
  const keyword = parsedParams.search;
  const isSearchModeValue = isSearchMode(keyword);
  const isWriteMode = parsedParams.write === 'true';

  if (isWriteMode) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      redirect(
        buildLoginPath({
          notice: 'auth-required',
          redirectTo: `${ROUTES.BOARDS}?write=true`,
        }),
      );
    }
  }

  return (
    <>
      {isWriteMode ? (
        <PostCreateForm />
      ) : (
        <>
          <div className="bg-white min-h-full w-full">
            <BoardHeader />

            {!isSearchModeValue && <BoardBestList />}

            <BoardList isSearchMode={isSearchModeValue} keyword={keyword} />

            <BoardWriteFloatingButton />
          </div>
        </>
      )}
    </>
  );
}
