/**
 * 게시글 상세 페이지를 구성하는 파일입니다.
 */

import BoardDetailComments from '@/app/(service)/boards/[articleId]/components/BoardDetailComments';
import BoardDetailContent from '@/app/(service)/boards/[articleId]/components/BoardDetailContent';
import BoardDetailEditForm from '@/app/(service)/boards/[articleId]/components/BoardDetailEditForm';
import BoardDetailHeader from '@/app/(service)/boards/[articleId]/components/BoardDetailHeader';
import { getBoardDetailPageData } from '@/app/(service)/boards/[articleId]/hooks/getBoardDetailPageData';
import type {
  BoardDetailParams,
  CommentListResponse,
} from '@/app/(service)/boards/[articleId]/types';

function renderFallback(message: string) {
  return (
    <div className="w-full h-full min-h-dvh flex justify-center items-center px-4 py-8 md:px-6.5 md:py-18 lg:py-17">
      <div className="max-w-225 w-full rounded-[20px] bg-background-primary px-5.5 py-9.75 text-center md:px-10 md:py-13.5 lg:px-15">
        <p className="text-sm text-text-default md:text-base">{message}</p>
      </div>
    </div>
  );
}

export default async function BoardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<BoardDetailParams>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { articleId } = await params;
  const { edit } = await searchParams;

  const isEditMode = edit === 'true';
  const { boardDetail, errorMessage, userProfile } =
    await getBoardDetailPageData({
      articleId,
    });

  const commentList: CommentListResponse = {
    nextCursor: null,
    list: [],
  };

  if (errorMessage) {
    return renderFallback(errorMessage);
  }

  if (!boardDetail) {
    return renderFallback('게시글 데이터를 불러오지 못했습니다.');
  }

  return (
    <div className="w-full h-full min-h-dvh flex justify-center items-center px-4 py-8 md:px-6.5 md:py-18 lg:py-17">
      <div className="max-w-225 w-full max-h-236 h-full items-center bg-background-primary rounded-[20px]">
        <div className="px-5.5 py-9.75 md:px-10 md:py-13.5 lg:px-15">
          {isEditMode ? (
            <BoardDetailEditForm boardDetail={boardDetail} />
          ) : (
            <div>
              <BoardDetailHeader
                boardDetail={boardDetail}
                userProfile={userProfile}
              />
              <BoardDetailContent boardDetail={boardDetail} />

              <BoardDetailComments
                commentList={commentList}
                userProfile={userProfile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
