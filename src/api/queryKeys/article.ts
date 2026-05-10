/**
 * Swagger `Article`, `ArticleComment` 도메인 기준 쿼리 키 모음입니다.
 *
 * 이 파일은 아래 상황에서 먼저 열어보면 됩니다.
 * - 게시글 / 게시글 댓글 조회용 hook을 새로 만들 때
 * - 게시글 생성, 수정, 삭제 후 어떤 캐시를 다시 받아와야 하는지 확인할 때
 * - `list`, `detail`, `all` 범위를 어떤 기준으로 나눌지 정할 때
 *
 * 자주 쓰는 기준:
 * - `article.list(...)`: 게시글 목록 한 벌
 * - `article.lists(...)`: 게시글 목록 전체 범위
 * - `article.detail(...)`: 게시글 상세 하나
 * - `articleComment.article(...)`: 특정 게시글에 달린 댓글 전체 범위
 */

import {
  QUERY_KEY_RESOURCES,
  QUERY_KEY_SEGMENTS,
} from '@/api/queryKeys/constants';
import {
  createTeamResourceQueryKeys,
  createTeamScopeQueryKey,
  withQueryParams,
} from '@/api/queryKeys/factory';
import type {
  ArticleListQueryParams,
  CursorPaginationQueryParams,
  QueryKeyId,
} from '@/api/queryKeys/types';

/**
 * 게시글(채용 / 홍보) 관련 캐시 키입니다.
 *
 * 예:
 * - 게시글 목록 조회 -> `list`
 * - 게시글 상세 조회 -> `detail`
 * - 게시글 mutation 후 목록 전체 갱신 -> `lists`
 */
export const articleQueryKeys = {
  all: (teamId: string) =>
    createTeamResourceQueryKeys(teamId, QUERY_KEY_RESOURCES.ARTICLES).all,
  detail: (teamId: string, articleId: QueryKeyId) =>
    createTeamResourceQueryKeys(teamId, QUERY_KEY_RESOURCES.ARTICLES).detail(
      articleId,
    ),
  infiniteList: (teamId: string, params?: ArticleListQueryParams) =>
    createTeamResourceQueryKeys(
      teamId,
      QUERY_KEY_RESOURCES.ARTICLES,
    ).infiniteList(params),
  like: (teamId: string, articleId: QueryKeyId) =>
    createTeamScopeQueryKey(
      teamId,
      QUERY_KEY_RESOURCES.ARTICLES,
      QUERY_KEY_SEGMENTS.DETAIL,
      articleId,
      QUERY_KEY_SEGMENTS.LIKE,
    ),
  list: (teamId: string, params?: ArticleListQueryParams) =>
    createTeamResourceQueryKeys(teamId, QUERY_KEY_RESOURCES.ARTICLES).list(
      params,
    ),
  lists: (teamId: string) =>
    createTeamResourceQueryKeys(teamId, QUERY_KEY_RESOURCES.ARTICLES).lists(),
} as const;

/**
 * 게시글 댓글 관련 캐시 키입니다.
 *
 * 예:
 * - 게시글 댓글 목록 조회 -> `list`
 * - 댓글 mutation 후 해당 게시글 댓글 전체 갱신 -> `article`
 * - 특정 댓글 하나를 직접 다루는 경우 -> `detail`
 */
export const articleCommentQueryKeys = {
  all: (teamId: string) =>
    createTeamScopeQueryKey(teamId, QUERY_KEY_RESOURCES.ARTICLE_COMMENTS),
  article: (teamId: string, articleId: QueryKeyId) =>
    createTeamScopeQueryKey(
      teamId,
      QUERY_KEY_RESOURCES.ARTICLE_COMMENTS,
      articleId,
    ),
  detail: (teamId: string, commentId: QueryKeyId) =>
    createTeamScopeQueryKey(
      teamId,
      QUERY_KEY_RESOURCES.ARTICLE_COMMENTS,
      QUERY_KEY_SEGMENTS.DETAIL,
      commentId,
    ),
  infiniteList: (
    teamId: string,
    articleId: QueryKeyId,
    params?: CursorPaginationQueryParams,
  ) =>
    withQueryParams(
      createTeamScopeQueryKey(
        teamId,
        QUERY_KEY_RESOURCES.ARTICLE_COMMENTS,
        articleId,
        QUERY_KEY_SEGMENTS.INFINITE_LIST,
      ),
      params,
    ),
  list: (
    teamId: string,
    articleId: QueryKeyId,
    params?: CursorPaginationQueryParams,
  ) =>
    withQueryParams(
      createTeamScopeQueryKey(
        teamId,
        QUERY_KEY_RESOURCES.ARTICLE_COMMENTS,
        articleId,
        QUERY_KEY_SEGMENTS.LIST,
      ),
      params,
    ),
} as const;
