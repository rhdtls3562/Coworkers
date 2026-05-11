import type { ArticleListQueryParams } from '@/api/queryKeys';
import type { ArticleSubmitAction } from '@/app/(service)/boards/utils/boardFormUtils';

export const BOARD_ORDER_BY = {
  RECENT: 'recent',
  LIKE: 'like',
} as const;

export const BOARD_BEST_LIST_PARAMS = {
  orderBy: BOARD_ORDER_BY.LIKE,
  page: 1,
  pageSize: 6,
} satisfies ArticleListQueryParams;

export const BOARD_MAIN_LIST_PARAMS = {
  orderBy: BOARD_ORDER_BY.RECENT,
  page: 1,
  pageSize: 8,
} satisfies ArticleListQueryParams;

export const BOARD_LIST_LOAD_MORE_ELEMENT_ID = 'board-list-load-more-sentinel';

export const BOARD_LIST_LOAD_MORE_ROOT_MARGIN = '240px';

export const BOARD_DEVICE_TYPE = {
  PC: 'PC',
  TABLET: 'TABLET',
  MOBILE: 'MOBILE',
} as const;

export const BOARD_DEVICE_TYPE_LIMIT = {
  [BOARD_DEVICE_TYPE.PC]: 3,
  [BOARD_DEVICE_TYPE.TABLET]: 2,
  [BOARD_DEVICE_TYPE.MOBILE]: 1,
} as const;

export const BOARD_SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '좋아요순', value: 'likes' },
] as const;

export const ARTICLE_SUBMIT_FALLBACK: Record<ArticleSubmitAction, string> = {
  create: '등록 중 오류가 발생했습니다.',
  update: '수정 중 오류가 발생했습니다.',
};
