/**
 * Swagger `Comment`, `ArticleComment` 도메인 query options 모음입니다.
 *
 * 댓글은 파일 기준으로는 둘로 나뉩니다.
 * - 할 일 댓글 -> `commentQueryOptions`
 * - 게시글 댓글 -> `articleCommentQueryOptions`
 *
 * 즉 댓글 기능을 붙일 때는
 * 먼저 "이 댓글이 할 일 댓글인지, 게시글 댓글인지"를 구분한 뒤
 * 이 파일에서 맞는 options를 보면 됩니다.
 */

import { getArticleComments, getTaskComments } from '@/api/commentApi';
import type { CursorPaginationQueryParams, QueryKeyId } from '@/api/queryKeys';
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
  ArticleCommentsData,
  TaskCommentsData,
} from '@/api/queryOptions/types';

type CursorPageResponse = {
  nextCursor: number | null;
};

/** 할 일 댓글 조회용 query options입니다. */
export const commentQueryOptions = {
  taskComments: <TData = TaskCommentsData>(
    teamId: string,
    taskId: QueryKeyId,
    options?: QueryOptionsOverrides<TaskCommentsData, TData>,
  ) =>
    createQueryOptions<TaskCommentsData, TData>({
      options,
      queryFn: () => getTaskComments(teamId, taskId),
      queryKey: queryKeys.comment.task(teamId, taskId),
      staleTime: QUERY_OPTION_DEFAULTS.COMMENT_LIST_STALE_TIME,
    }),
} as const;

/** 게시글 댓글 조회용 query options입니다. */
export const articleCommentQueryOptions = {
  list: <TData = ArticleCommentsData>(
    teamId: string,
    articleId: QueryKeyId,
    params: CursorPaginationQueryParams,
    options?: QueryOptionsOverrides<ArticleCommentsData, TData>,
  ) =>
    createListQueryOptions<ArticleCommentsData, TData>({
      options,
      queryFn: () => getArticleComments(teamId, articleId, params),
      queryKey: queryKeys.articleComment.list(teamId, articleId, params),
      staleTime: QUERY_OPTION_DEFAULTS.COMMENT_LIST_STALE_TIME,
    }),
  infiniteList: <TData = ArticleCommentsData>(
    teamId: string,
    articleId: QueryKeyId,
    params: CursorPaginationQueryParams,
    options?: InfiniteQueryOptionsOverrides<ArticleCommentsData, number, TData>,
  ) =>
    createInfiniteQueryOptions<ArticleCommentsData, number, TData>({
      getNextPageParam: (lastPage) => {
        const page = lastPage as CursorPageResponse;

        return page.nextCursor ?? undefined;
      },
      initialPageParam: 0,
      options,
      queryFn: ({ pageParam }) =>
        getArticleComments(teamId, articleId, { ...params, cursor: pageParam }),
      queryKey: queryKeys.articleComment.infiniteList(
        teamId,
        articleId,
        params,
      ),
      staleTime: QUERY_OPTION_DEFAULTS.COMMENT_LIST_STALE_TIME,
    }),
} as const;
