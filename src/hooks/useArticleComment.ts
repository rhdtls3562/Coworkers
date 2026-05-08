/**
 * Swagger `ArticleComment` 도메인 댓글 목록 조회와 CRUD를 담당하는 훅 파일입니다.
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createArticleComment,
  deleteArticleComment,
  getArticleComments,
  updateArticleComment,
} from '@/api/commentApi';
import type { CursorPaginationQueryParams, QueryKeyId } from '@/api/queryKeys';
import { articleCommentQueryOptions } from '@/api/queryOptions';
import {
  createMutationOptions,
  type MutationOptionsOverrides,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import { refetchArticleCommentQueries } from '@/api/queryRefetch';

type ArticleCommentsData = Awaited<ReturnType<typeof getArticleComments>>;
type CreateArticleCommentData = Awaited<
  ReturnType<typeof createArticleComment>
>;
type UpdateArticleCommentData = Awaited<
  ReturnType<typeof updateArticleComment>
>;
type DeleteArticleCommentData = Awaited<
  ReturnType<typeof deleteArticleComment>
>;

const DEFAULT_ARTICLE_COMMENT_QUERY_PARAMS = {
  limit: 10,
} satisfies CursorPaginationQueryParams;

type UseArticleCommentsParams<TData = ArticleCommentsData> = {
  articleId: QueryKeyId;
  options?: QueryOptionsOverrides<ArticleCommentsData, TData>;
  params?: CursorPaginationQueryParams;
  teamId: string;
};

type CreateArticleCommentVariables = {
  articleId: QueryKeyId;
  body: Parameters<typeof createArticleComment>[2];
  teamId: string;
  token?: string;
};

type UpdateArticleCommentVariables = {
  articleId: QueryKeyId;
  body: Parameters<typeof updateArticleComment>[2];
  commentId: QueryKeyId;
  teamId: string;
  token?: string;
};

type DeleteArticleCommentVariables = {
  articleId: QueryKeyId;
  commentId: QueryKeyId;
  teamId: string;
  token?: string;
};

export function useArticleCommentsQuery<TData = ArticleCommentsData>({
  articleId,
  options,
  params,
  teamId,
}: UseArticleCommentsParams<TData>) {
  const effectiveParams = {
    ...DEFAULT_ARTICLE_COMMENT_QUERY_PARAMS,
    ...params,
  };

  return useQuery(
    articleCommentQueryOptions.list<TData>(
      teamId,
      articleId,
      effectiveParams,
      options,
    ),
  );
}

export function useCreateArticleCommentMutation(
  options?: MutationOptionsOverrides<
    CreateArticleCommentData,
    CreateArticleCommentVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({
        articleId,
        body,
        teamId,
        token,
      }: CreateArticleCommentVariables) =>
        createArticleComment(teamId, articleId, body, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleCommentQueries(
            queryClient,
            variables.teamId,
            variables.articleId,
          );
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useUpdateArticleCommentMutation(
  options?: MutationOptionsOverrides<
    UpdateArticleCommentData,
    UpdateArticleCommentVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({
        body,
        commentId,
        teamId,
        token,
      }: UpdateArticleCommentVariables) =>
        updateArticleComment(teamId, commentId, body, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleCommentQueries(
            queryClient,
            variables.teamId,
            variables.articleId,
          );
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useDeleteArticleCommentMutation(
  options?: MutationOptionsOverrides<
    DeleteArticleCommentData,
    DeleteArticleCommentVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({
        commentId,
        teamId,
        token,
      }: DeleteArticleCommentVariables) =>
        deleteArticleComment(teamId, commentId, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleCommentQueries(
            queryClient,
            variables.teamId,
            variables.articleId,
          );
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}
