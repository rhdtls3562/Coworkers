/**
 * Swagger `Article` 도메인 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import { buildQueryString } from '@/api/buildQueryString';
import { API_PATH_SEGMENTS, HTTP_METHODS } from '@/api/constants';
import type { ArticleListQueryParams, QueryKeyId } from '@/api/queryKeys';
import type { ArticleBody } from '@/api/types';

function createArticlePath(articleId: QueryKeyId) {
  return `${API_PATH_SEGMENTS.ARTICLES}/${articleId}`;
}

function createArticleLikePath(articleId: QueryKeyId) {
  return `${createArticlePath(articleId)}${API_PATH_SEGMENTS.LIKE}`;
}

export async function getArticleList(
  teamId: string,
  params?: ArticleListQueryParams,
) {
  const endpoint = `${teamEndpoint(API_PATH_SEGMENTS.ARTICLES, teamId)}${buildQueryString(
    params,
  )}`;

  return apiClient<unknown>(endpoint);
}

export async function getArticleDetail(teamId: string, articleId: QueryKeyId) {
  return apiClient<unknown>(teamEndpoint(createArticlePath(articleId), teamId));
}

export async function createArticle(
  teamId: string,
  body: ArticleBody,
  token?: string,
) {
  return apiClient<unknown>(teamEndpoint(API_PATH_SEGMENTS.ARTICLES, teamId), {
    body: JSON.stringify(body),
    method: HTTP_METHODS.POST,
    token,
  });
}

export async function updateArticle(
  teamId: string,
  articleId: QueryKeyId,
  body: Partial<ArticleBody>,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createArticlePath(articleId), teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
      token,
    },
  );
}

export async function deleteArticle(
  teamId: string,
  articleId: QueryKeyId,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createArticlePath(articleId), teamId),
    {
      method: HTTP_METHODS.DELETE,
      token,
    },
  );
}

export async function likeArticle(
  teamId: string,
  articleId: QueryKeyId,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createArticleLikePath(articleId), teamId),
    {
      method: HTTP_METHODS.POST,
      token,
    },
  );
}

export async function unlikeArticle(
  teamId: string,
  articleId: QueryKeyId,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createArticleLikePath(articleId), teamId),
    {
      method: HTTP_METHODS.DELETE,
      token,
    },
  );
}
