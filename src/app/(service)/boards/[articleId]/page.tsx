/**
 * 게시글 상세 페이지를 구성하는 파일입니다.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import BoardDetailComments from '@/app/(service)/boards/[articleId]/components/BoardDetailComments';
import BoardDetailContent from '@/app/(service)/boards/[articleId]/components/BoardDetailContent';
import BoardDetailEditForm from '@/app/(service)/boards/[articleId]/components/BoardDetailEditForm';
import BoardDetailHeader from '@/app/(service)/boards/[articleId]/components/BoardDetailHeader';
import BoardDetailPageFallback from '@/app/(service)/boards/[articleId]/components/BoardDetailPageFallback';
import {
  BOARD_DETAIL_EDIT_MODE_QUERY_VALUE,
  BOARD_DETAIL_FALLBACK_BOARD_LOAD_FAILED,
  BOARD_DETAIL_FALLBACK_EDIT_NOT_OWNER,
  BOARD_DETAIL_FALLBACK_USER_PROFILE_LOAD_FAILED,
} from '@/app/(service)/boards/[articleId]/constants';
import type { BoardDetailParams } from '@/app/(service)/boards/[articleId]/types';
import { getBoardDetailPageData } from '@/app/(service)/boards/[articleId]/utils/getBoardDetailPageData';
import { ROUTES } from '@/constants/ROUTES';
import { buildLoginPath } from '@/utils/authRedirect';

export default async function BoardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<BoardDetailParams>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { articleId } = await params;
  const { edit } = await searchParams;

  const isEditMode = edit === BOARD_DETAIL_EDIT_MODE_QUERY_VALUE;

  if (isEditMode) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access-token')?.value;

    if (!accessToken) {
      redirect(
        buildLoginPath({
          notice: 'auth-required',
          redirectTo: `${ROUTES.BOARD_DETAIL(articleId)}?edit=${BOARD_DETAIL_EDIT_MODE_QUERY_VALUE}`,
        }),
      );
    }
  }

  const { boardDetail, errorMessage, userProfile } =
    await getBoardDetailPageData({
      articleId,
    });

  if (errorMessage) {
    return <BoardDetailPageFallback message={errorMessage} />;
  }

  if (!boardDetail) {
    return (
      <BoardDetailPageFallback
        message={BOARD_DETAIL_FALLBACK_BOARD_LOAD_FAILED}
      />
    );
  }

  if (isEditMode) {
    if (userProfile === null) {
      return (
        <BoardDetailPageFallback
          message={BOARD_DETAIL_FALLBACK_USER_PROFILE_LOAD_FAILED}
        />
      );
    }

    if (userProfile.id !== boardDetail.writer.id) {
      return (
        <BoardDetailPageFallback
          message={BOARD_DETAIL_FALLBACK_EDIT_NOT_OWNER}
        />
      );
    }
  }

  return (
    <div className="w-full h-full min-h-dvh flex justify-center items-center px-4 py-8 md:px-6.5 md:py-18 lg:py-17">
      <div className="max-w-225 w-full items-center bg-background-primary rounded-[20px]">
        <div className="px-5.5 py-9.75 md:px-10 md:py-13.5 lg:px-15">
          {isEditMode ? (
            <BoardDetailEditForm
              key={boardDetail.id}
              boardDetail={boardDetail}
            />
          ) : (
            <div>
              <BoardDetailHeader
                boardDetail={boardDetail}
                userProfile={userProfile}
              />
              <BoardDetailContent boardDetail={boardDetail} />

              <BoardDetailComments
                commentCount={boardDetail.commentCount}
                userProfile={userProfile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
