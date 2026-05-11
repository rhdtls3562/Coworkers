'use client';

import BoardListCard from '@/app/(service)/boards/components/BoardListCard';
import {
  BOARD_LIST_LOAD_MORE_ELEMENT_ID,
  BOARD_LIST_LOAD_MORE_ROOT_MARGIN,
  BOARD_MAIN_LIST_PARAMS,
  BOARD_SORT_OPTIONS,
} from '@/app/(service)/boards/constants';
import { useInfinitePages } from '@/app/(service)/boards/hooks/useInfinitePages';
import { useInfiniteScrollObserver } from '@/app/(service)/boards/hooks/useInfiniteScrollObserver';
import useSortedBoardPostsMemo from '@/app/(service)/boards/hooks/useSortedBoardPostsMemo';
import type { BoardListProps, Post } from '@/app/(service)/boards/types';
import { hasPosts } from '@/app/(service)/boards/utils/boardListUtils';
import SelectDropdown from '@/components/common/dropdown/components/SelectDropdown';
import { useArticleInfiniteListQuery } from '@/hooks/useArticle';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

export default function BoardList({ isSearchMode, keyword }: BoardListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useArticleInfiniteListQuery({
      params: {
        ...BOARD_MAIN_LIST_PARAMS,
        keyword,
      },
      teamId: TEAM_ID,
    });

  const boardPosts = useInfinitePages<Post>({ pages: data?.pages });

  const sentinelRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    rootMargin: BOARD_LIST_LOAD_MORE_ROOT_MARGIN,
  });
  const { sortedPosts, sort, setSort } = useSortedBoardPostsMemo({
    boardPosts,
  });
  const hasPostsValue = hasPosts(sortedPosts);

  return (
    <section className="max-w-324.5 px-4 mt-7.25 pb-12.25 md:mt-7 md:px-6.5 lg:px-22.25 lg:mt-11.25">
      <div className="flex items-center justify-between">
        <p className="text-text-primary text-lg font-bold block leading-5.25 md:text-xl">
          {isSearchMode ? `"${keyword}" 검색 결과입니다.` : '전체'}
        </p>
        <SelectDropdown
          items={BOARD_SORT_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          value={sort}
          onChange={(value) => setSort(value as typeof sort)}
          className="w-23.5 md:w-30"
        />
      </div>

      {!hasPostsValue ? (
        <div
          className="mt-5 items-center px-6 py-12 text-center md:mt-6 md:py-16"
          role="status"
        >
          <span className="text-text-default text-sm font-regular md:text-sm">
            {isSearchMode
              ? `"${keyword}"에 대한 검색 결과가 없어요.`
              : '아직 게시글이 없어요.'}
          </span>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {sortedPosts.map((post) => (
            <BoardListCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {hasPostsValue ? (
        <div
          ref={sentinelRef}
          id={BOARD_LIST_LOAD_MORE_ELEMENT_ID}
          aria-hidden
          className="pointer-events-none mt-4 h-2 w-full shrink-0 md:mt-5"
        />
      ) : null}
    </section>
  );
}
