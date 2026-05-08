'use client';

import { useState } from 'react';

import BoardBestCard from '@/app/(service)/boards/components/BoardBestCard';
import BoardBestPagination from '@/app/(service)/boards/components/BoardBestPagination';
import {
  BOARD_DEVICE_TYPE,
  BOARD_DEVICE_TYPE_LIMIT,
} from '@/app/(service)/boards/constants';
import useBoardBestMemo from '@/app/(service)/boards/hooks/useBoardBestMemo';
import type { BoardBestListProps } from '@/app/(service)/boards/types';
import {
  getCurrentPosts,
  getTotalPages,
} from '@/app/(service)/boards/utils/boardUtils';
import useDeviceType from '@/hooks/useDeviceType';

export default function BoardBestList({
  boardBestPosts,
  hasBoardPosts,
}: BoardBestListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const deviceType = useDeviceType();
  const pageSize =
    BOARD_DEVICE_TYPE_LIMIT[deviceType ?? BOARD_DEVICE_TYPE.MOBILE];

  const { emptyMessage } = useBoardBestMemo({ boardBestPosts, hasBoardPosts });

  const totalPages = getTotalPages(boardBestPosts, pageSize);
  const currentPosts = getCurrentPosts(boardBestPosts, pageSize, currentPage);

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
                setCurrentPage={setCurrentPage}
              />
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
