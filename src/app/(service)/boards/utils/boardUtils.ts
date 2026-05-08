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
