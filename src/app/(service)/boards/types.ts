import {
  BOARD_DEVICE_TYPE,
  BOARD_ORDER_BY,
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

export type PostListResponse = {
  totalCount: number;
  list: Post[];
};

export type BoardListProps = {
  isSearchMode: boolean;
  keyword?: string;
};

export type OrderBy = (typeof BOARD_ORDER_BY)[keyof typeof BOARD_ORDER_BY];

export type BoardDeviceType =
  (typeof BOARD_DEVICE_TYPE)[keyof typeof BOARD_DEVICE_TYPE];

export type BestPagination = {
  currentPage: number;
  totalPages: number;
};
