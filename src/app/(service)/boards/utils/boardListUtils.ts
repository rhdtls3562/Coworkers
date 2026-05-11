/**
 * 게시글 목록 유틸리티 함수
 */

import { BOARD_BEST_LIST_PARAMS } from '@/app/(service)/boards/constants';
import type { Post } from '@/app/(service)/boards/types';

export const hasPosts = (sortedPosts: Post[]) => {
  return sortedPosts.length > 0;
};

export const isSearchMode = (keyword?: string) => {
  return !!keyword;
};

export const filterPostsByKeyword = (posts: Post[], keyword: string) => {
  return isSearchMode(keyword)
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(keyword.toLowerCase()),
      )
    : posts;
};

export function getBoardBestPosts(posts: Post[]) {
  const withLikes = posts.filter((post) => post.likeCount > 0);

  if (withLikes.length === 0) {
    return [];
  }

  return [...withLikes]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, BOARD_BEST_LIST_PARAMS.pageSize);
}

export function sortBoardMainListPostsByRecent(posts: Post[]) {
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
