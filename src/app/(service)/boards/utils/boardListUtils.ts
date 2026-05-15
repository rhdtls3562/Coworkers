/**
 * 게시글 목록 유틸리티 함수 모음
 */

import {
  BOARD_BEST_LIST_PARAMS,
  BOARD_SORT_QUERY_KEY,
  BOARD_SORT_VALUE,
} from '@/app/(service)/boards/constants';
import type { BoardListSortValue, Post } from '@/app/(service)/boards/types';

export const hasPosts = (sortedPosts: Post[]) => {
  return sortedPosts.length > 0;
};

export const isSearchMode = (keyword?: string) => {
  return !!keyword;
};

export function parseBoardListSortFromQueryParam(
  raw: string | undefined,
): BoardListSortValue {
  if (raw === BOARD_SORT_VALUE.LIKES) {
    return BOARD_SORT_VALUE.LIKES;
  }

  return BOARD_SORT_VALUE.LATEST;
}

export function buildBoardListQueryString(options: {
  keyword?: string;
  sort: BoardListSortValue;
}): string {
  const params = new URLSearchParams();
  const trimmedKeyword = options.keyword?.trim();

  if (trimmedKeyword) {
    params.set('keyword', trimmedKeyword);
  }

  if (options.sort === BOARD_SORT_VALUE.LIKES) {
    params.set(BOARD_SORT_QUERY_KEY, BOARD_SORT_VALUE.LIKES);
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

export function getBoardBestPosts(posts: Post[]) {
  const withLikes = posts.filter((post) => post.likeCount > 0);

  if (withLikes.length === 0) {
    return [];
  }

  return [...withLikes]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, BOARD_BEST_LIST_PARAMS.pageSize);
}
