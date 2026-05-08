'use client';

import BoardBestCard from '@/app/(service)/boards/components/BoardBestCard';
import BoardBestPagination from '@/app/(service)/boards/components/BoardBestPagination';
import {
  BOARD_BEST_LIST_PARAMS,
  BOARD_DEVICE_TYPE,
  BOARD_DEVICE_TYPE_LIMIT,
} from '@/app/(service)/boards/constants';
import useBoardBestMemo from '@/app/(service)/boards/hooks/useBoardBestMemo';
import { usePagination } from '@/app/(service)/boards/hooks/usePagination';
import type { Post } from '@/app/(service)/boards/types';
import {
  getBoardBestPosts,
  hasPosts,
} from '@/app/(service)/boards/utils/boardUtils';
import { useArticleListQuery } from '@/hooks/useArticle';
import useDeviceType from '@/hooks/useDeviceType';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function BoardBestList() {
  const deviceType = useDeviceType();
  const pageSize =
    BOARD_DEVICE_TYPE_LIMIT[deviceType ?? BOARD_DEVICE_TYPE.MOBILE];
  const { data } = useArticleListQuery({
    params: BOARD_BEST_LIST_PARAMS,
    teamId: TEAM_ID,
  });
  const boardPosts = ((data as { list?: Post[] } | undefined)?.list ??
    []) as Post[];
  const boardBestPosts = getBoardBestPosts(boardPosts);
  const hasBoardPosts = hasPosts(boardPosts);

  const { emptyMessage } = useBoardBestMemo({ boardBestPosts, hasBoardPosts });
  const {
    currentItems: currentPosts,
    currentPage,
    handleNextPage,
    handlePageSelect,
    handlePrevPage,
    totalPages,
  } = usePagination({
    items: boardBestPosts,
    pageSize,
  });

  return (
    <section
      className="max-w-280 px-4 py-6.75 mt-5 bg-background-secondary 
      md:mx-0 md:px-6.5 md:mt-7.5 
      lg:mx-22.25 lg:px-5.75 lg:pt-10.25 lg:pb-5 lg:rounded-[20px]"
    >
      <div>
        <p className="shrink-0 text-text-primary text-lg font-bold leading-5.25 md:text-xl">
          베스트 게시글
        </p>

        {emptyMessage ? (
          <div className="px-2 py-8 text-center md:py-10" role="status">
            <p className="text-text-default text-sm leading-5 md:text-sm">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 mt-5 md:grid-cols-2 xl:grid-cols-3 xl:mt-6.25">
              {currentPosts.map((post) => (
                <BoardBestCard key={post.id} post={post} />
              ))}
            </div>
            {totalPages > 0 ? (
              <BoardBestPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onSelectPage={handlePageSelect}
              />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
