/** 게시판 페이지 TypeScript 타입 정의 파일입니다. */

import {
  BOARD_DEVICE_TYPE,
  BOARD_SORT_VALUE,
} from '@/app/(service)/boards/constants';

export type ArticleSubmitAction = 'create' | 'update';

export type Writer = {
  id: number;
  image?: string | null;
  nickname: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  image: string | null;
  writer: Writer;
  likeCount: number;
  isLiked?: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type BoardListSortValue =
  (typeof BOARD_SORT_VALUE)[keyof typeof BOARD_SORT_VALUE];

export type BoardListProps = {
  isSearchMode: boolean;
  keyword?: string;
  listSort: BoardListSortValue;
};

export type BoardDeviceType =
  (typeof BOARD_DEVICE_TYPE)[keyof typeof BOARD_DEVICE_TYPE];

export type BestPagination = {
  currentPage: number;
  totalPages: number;
};
