import { BOARD_BEST_LIST_PARAMS } from '@/app/(service)/boards/constants';
import type { Post } from '@/app/(service)/boards/types';

export const getTotalPages = (posts: Post[], pageSize: number) => {
  return posts.length > 0 ? Math.ceil(posts.length / pageSize) : 0;
};

export const getCurrentPosts = (
  posts: Post[],
  pageSize: number,
  currentPage: number,
) => {
  return posts.length > 0
    ? posts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];
};

export const hasPosts = (sortedPosts: Post[]) => {
  return sortedPosts.length > 0;
};

export const getLikeCount = (likeCount: number) => {
  return likeCount > 999 ? '999+' : likeCount.toString();
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

export const formatDateToYmd = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

/**
 * 베스트 영역용 게시글을 계산합니다.
 * 좋아요가 1개 이상인 글만 대상으로 좋아요순 상위를 반환합니다.
 */
export function getBoardBestPosts(posts: Post[]) {
  const withLikes = posts.filter((post) => post.likeCount > 0);

  if (withLikes.length === 0) {
    return [];
  }

  return [...withLikes]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, BOARD_BEST_LIST_PARAMS.pageSize);
}

/** 전체 목록: 최신순(날짜 내림차순) */
export function sortBoardMainListPostsByRecent(posts: Post[]) {
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
