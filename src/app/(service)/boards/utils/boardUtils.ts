import type { ApiError } from '@/api/types';
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

// 게시글 제목, 내용 필수 유효성 검사
export const isRequiredTextValid = (value: string) => {
  return value.trim().length > 0;
};

export function getArticleUpdateSubmitErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return '수정 중 오류가 발생했습니다.';
  }

  const { status, message } = error as ApiError;

  if (status === 403) {
    return '게시글은 작성자 본인만 수정할 수 있습니다.';
  }

  if (status === 404) {
    return '존재하지 않는 게시글입니다.';
  }

  if (status === 401 && message) {
    return message;
  }

  return '수정 중 오류가 발생했습니다.';
}

/** API 요청용: 빈 문자열은 이미지 없음(null)으로 보냅니다. */
export const normalizeArticleImageUrl = (
  value: string | null | undefined,
): string | null => {
  if (value == null || value === '') {
    return null;
  }

  return value;
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
