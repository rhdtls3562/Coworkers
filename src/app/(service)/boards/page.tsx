/**
 * 채용 / 홍보 페이지를 구성하는 파일입니다.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import BoardBestList from '@/app/(service)/boards/components/BoardBestList';
import BoardCreateForm from '@/app/(service)/boards/components/BoardCreateForm';
import BoardHeader from '@/app/(service)/boards/components/BoardHeader';
import BoardList from '@/app/(service)/boards/components/BoardList';
import BoardWriteFloatingButton from '@/app/(service)/boards/components/BoardWriteFloatingButton';
import { BOARD_URL_QUERY_FLAG_ENABLED } from '@/app/(service)/boards/constants';
import {
  isSearchMode,
  parseBoardListSortFromQueryParam,
} from '@/app/(service)/boards/utils/boardListUtils';
import { ROUTES } from '@/constants/ROUTES';
import { buildLoginPath } from '@/utils/authRedirect';

export default async function BoardsPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; sort?: string; write?: string }>;
}) {
  const parsedParams = await searchParams;
  const keyword = parsedParams.keyword;
  const listSort = parseBoardListSortFromQueryParam(parsedParams.sort);
  const isSearchModeValue = isSearchMode(keyword);
  const isWriteMode = parsedParams.write === BOARD_URL_QUERY_FLAG_ENABLED;

  if (isWriteMode) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      redirect(
        buildLoginPath({
          notice: 'auth-required',
          redirectTo: `${ROUTES.BOARDS}?write=${BOARD_URL_QUERY_FLAG_ENABLED}`,
        }),
      );
    }
  }

  return (
    <>
      {isWriteMode ? (
        <BoardCreateForm />
      ) : (
        <>
          <div className="bg-background-primary min-h-full w-full">
            <BoardHeader listSort={listSort} />

            {!isSearchModeValue && <BoardBestList />}

            <BoardList
              isSearchMode={isSearchModeValue}
              keyword={keyword}
              listSort={listSort}
            />

            <BoardWriteFloatingButton />
          </div>
        </>
      )}
    </>
  );
}
