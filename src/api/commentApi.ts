/**
 * Swagger `Comment`, `ArticleComment` 도메인 API를 정의하는 파일입니다.
 */

import { apiClient, teamEndpoint } from '@/api/apiClient';
import { buildQueryString } from '@/api/buildQueryString';
import { API_PATH_SEGMENTS, HTTP_METHODS } from '@/api/constants';
import type { CursorPaginationQueryParams, QueryKeyId } from '@/api/queryKeys';
import type { CommentBody } from '@/api/types';

function createTaskCommentsPath(taskId: QueryKeyId) {
  return `${API_PATH_SEGMENTS.TASKS}/${taskId}${API_PATH_SEGMENTS.COMMENTS}`;
}

function createTaskCommentPath(taskId: QueryKeyId, commentId: QueryKeyId) {
  return `${createTaskCommentsPath(taskId)}/${commentId}`;
}

function createArticleCommentsPath(articleId: QueryKeyId) {
  return `${API_PATH_SEGMENTS.ARTICLES}/${articleId}${API_PATH_SEGMENTS.COMMENTS}`;
}

function createArticleCommentPath(commentId: QueryKeyId) {
  return `${API_PATH_SEGMENTS.COMMENTS}/${commentId}`;
}

export async function getTaskComments(teamId: string, taskId: QueryKeyId) {
  return apiClient<unknown>(
    teamEndpoint(createTaskCommentsPath(taskId), teamId),
  );
}

export async function createTaskComment(
  teamId: string,
  taskId: QueryKeyId,
  body: CommentBody,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createTaskCommentsPath(taskId), teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
      token,
    },
  );
}

export async function updateTaskComment(
  teamId: string,
  taskId: QueryKeyId,
  commentId: QueryKeyId,
  body: CommentBody,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createTaskCommentPath(taskId, commentId), teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
      token,
    },
  );
}

export async function deleteTaskComment(
  teamId: string,
  taskId: QueryKeyId,
  commentId: QueryKeyId,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createTaskCommentPath(taskId, commentId), teamId),
    {
      method: HTTP_METHODS.DELETE,
      token,
    },
  );
}

export async function getArticleComments(
  teamId: string,
  articleId: QueryKeyId,
  params: CursorPaginationQueryParams,
) {
  const endpoint = `${teamEndpoint(
    createArticleCommentsPath(articleId),
    teamId,
  )}${buildQueryString(params)}`;

  return apiClient<unknown>(endpoint);
}

export async function createArticleComment(
  teamId: string,
  articleId: QueryKeyId,
  body: CommentBody,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createArticleCommentsPath(articleId), teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.POST,
      token,
    },
  );
}

export async function updateArticleComment(
  teamId: string,
  commentId: QueryKeyId,
  body: CommentBody,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createArticleCommentPath(commentId), teamId),
    {
      body: JSON.stringify(body),
      method: HTTP_METHODS.PATCH,
      token,
    },
  );
}

export async function deleteArticleComment(
  teamId: string,
  commentId: QueryKeyId,
  token?: string,
) {
  return apiClient<unknown>(
    teamEndpoint(createArticleCommentPath(commentId), teamId),
    {
      method: HTTP_METHODS.DELETE,
      token,
    },
  );
}
