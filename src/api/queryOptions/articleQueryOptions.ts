/**
 * Swagger `Article` 도메인 query options 모음입니다.
 *
 * 이 파일은 "게시글 조회 hook을 만들 때 기본 옵션을 어디서 가져오지?"가
 * 궁금할 때 보면 됩니다.
 *
 * queryOptions는 아래를 한 번에 묶어둡니다.
 * - 어떤 queryKey를 쓸지
 * - 어떤 API 함수를 호출할지
 * - staleTime 같은 기본 캐시 옵션을 얼마나 줄지
 *
 * 즉 화면에서는 보통 hook만 쓰면 되지만,
 * 새 조회 hook을 만들거나 목록/상세 기본 옵션을 바꾸고 싶을 때는
 * 이 파일을 같이 열어보면 됩니다.
 */

import { getArticleDetail, getArticleList } from '@/api/articleApi';
import type { ArticleListQueryParams, QueryKeyId } from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import { QUERY_OPTION_DEFAULTS } from '@/api/queryOptions/constants';
import {
  createInfiniteQueryOptions,
  createListQueryOptions,
  createQueryOptions,
  type InfiniteQueryOptionsOverrides,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import type {
  ArticleDetailData,
  ArticleListData,
} from '@/api/queryOptions/types';

type CursorPageResponse = {
  nextCursor: number | null;
};

/** 게시글 조회용 query options입니다. 목록 / 상세 hook이 이 설정을 사용합니다. */
export const articleQueryOptions = {
  detail: <TData = ArticleDetailData>(
    teamId: string,
    articleId: QueryKeyId,
    options?: QueryOptionsOverrides<ArticleDetailData, TData>,
  ) =>
    createQueryOptions<ArticleDetailData, TData>({
      options,
      queryFn: () => getArticleDetail(teamId, articleId),
      queryKey: queryKeys.article.detail(teamId, articleId),
      staleTime: QUERY_OPTION_DEFAULTS.DETAIL_STALE_TIME,
    }),
  list: <TData = ArticleListData>(
    teamId: string,
    params?: ArticleListQueryParams,
    options?: QueryOptionsOverrides<ArticleListData, TData>,
  ) =>
    createListQueryOptions<ArticleListData, TData>({
      options,
      queryFn: () => getArticleList(teamId, params),
      queryKey: queryKeys.article.list(teamId, params),
      staleTime: QUERY_OPTION_DEFAULTS.LIST_STALE_TIME,
    }),
  infiniteList: <TData = ArticleListData>(
    teamId: string,
    params?: ArticleListQueryParams,
    options?: InfiniteQueryOptionsOverrides<ArticleListData, number, TData>,
  ) =>
    createInfiniteQueryOptions<ArticleListData, number, TData>({
      getNextPageParam: (lastPage) => {
        const page = lastPage as CursorPageResponse;

        return page.nextCursor ?? undefined;
      },
      initialPageParam: 0,
      options,
      queryFn: ({ pageParam }) =>
        getArticleList(teamId, { ...params, cursor: pageParam }),
      queryKey: queryKeys.article.infiniteList(teamId, params),
      staleTime: QUERY_OPTION_DEFAULTS.LIST_STALE_TIME,
    }),
} as const;
