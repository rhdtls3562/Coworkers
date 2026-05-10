'use client';

/**
 * Swagger `Article` 도메인 서버 상태를 관리하는 커스텀 훅입니다.
 */

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createArticle,
  deleteArticle,
  getArticleDetail,
  getArticleList,
  likeArticle,
  unlikeArticle,
  updateArticle,
} from '@/api/articleApi';
import type { ArticleListQueryParams, QueryKeyId } from '@/api/queryKeys';
import { articleQueryOptions } from '@/api/queryOptions';
import {
  createMutationOptions,
  type InfiniteQueryOptionsOverrides,
  type MutationOptionsOverrides,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import {
  refetchArticleListQueries,
  refetchArticleQueries,
} from '@/api/queryRefetch';

type ArticleListData = Awaited<ReturnType<typeof getArticleList>>;
type ArticleDetailData = Awaited<ReturnType<typeof getArticleDetail>>;
type CreateArticleData = Awaited<ReturnType<typeof createArticle>>;
type UpdateArticleData = Awaited<ReturnType<typeof updateArticle>>;
type DeleteArticleData = Awaited<ReturnType<typeof deleteArticle>>;
type LikeArticleData = Awaited<ReturnType<typeof likeArticle>>;
type UnlikeArticleData = Awaited<ReturnType<typeof unlikeArticle>>;

const DEFAULT_ARTICLE_LIST_QUERY_PARAMS = {
  orderBy: 'recent',
  page: 1,
  pageSize: 10,
} satisfies ArticleListQueryParams;

type UseArticleListParams<TData = ArticleListData> = {
  options?: QueryOptionsOverrides<ArticleListData, TData>;
  params?: ArticleListQueryParams;
  teamId: string;
};

type UseArticleInfiniteListParams<
  TData = InfiniteData<ArticleListData, number>,
> = {
  options?: InfiniteQueryOptionsOverrides<ArticleListData, number, TData>;
  params?: ArticleListQueryParams;
  teamId: string;
};

type UseArticleDetailParams<TData = ArticleDetailData> = {
  articleId: QueryKeyId;
  options?: QueryOptionsOverrides<ArticleDetailData, TData>;
  teamId: string;
};

type CreateArticleVariables = {
  body: Parameters<typeof createArticle>[1];
  teamId: string;
  token?: string;
};

type UpdateArticleVariables = {
  articleId: QueryKeyId;
  body: Parameters<typeof updateArticle>[2];
  teamId: string;
  token?: string;
};

type DeleteArticleVariables = {
  articleId: QueryKeyId;
  teamId: string;
  token?: string;
};

type LikeArticleVariables = {
  articleId: QueryKeyId;
  teamId: string;
  token?: string;
};

export function useArticleListQuery<TData = ArticleListData>({
  options,
  params,
  teamId,
}: UseArticleListParams<TData>) {
  const effectiveParams = { ...DEFAULT_ARTICLE_LIST_QUERY_PARAMS, ...params };

  return useQuery(
    articleQueryOptions.list<TData>(teamId, effectiveParams, options),
  );
}

export function useArticleInfiniteListQuery<
  TData = InfiniteData<ArticleListData, number>,
>({ options, params, teamId }: UseArticleInfiniteListParams<TData>) {
  const effectiveParams = { ...DEFAULT_ARTICLE_LIST_QUERY_PARAMS, ...params };

  return useInfiniteQuery(
    articleQueryOptions.infiniteList<TData>(teamId, effectiveParams, options),
  );
}

export function useArticleDetailQuery<TData = ArticleDetailData>({
  articleId,
  options,
  teamId,
}: UseArticleDetailParams<TData>) {
  return useQuery(
    articleQueryOptions.detail<TData>(teamId, articleId, options),
  );
}

export function useCreateArticleMutation(
  options?: MutationOptionsOverrides<CreateArticleData, CreateArticleVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ body, teamId, token }: CreateArticleVariables) =>
        createArticle(teamId, body, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleListQueries(queryClient, variables.teamId);
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useUpdateArticleMutation(
  options?: MutationOptionsOverrides<UpdateArticleData, UpdateArticleVariables>,
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
      }: UpdateArticleVariables) =>
        updateArticle(teamId, articleId, body, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleQueries(
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

export function useDeleteArticleMutation(
  options?: MutationOptionsOverrides<DeleteArticleData, DeleteArticleVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ articleId, teamId, token }: DeleteArticleVariables) =>
        deleteArticle(teamId, articleId, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleQueries(
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

export function useLikeArticleMutation(
  options?: MutationOptionsOverrides<LikeArticleData, LikeArticleVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ articleId, teamId, token }: LikeArticleVariables) =>
        likeArticle(teamId, articleId, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleQueries(
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

export function useUnlikeArticleMutation(
  options?: MutationOptionsOverrides<UnlikeArticleData, LikeArticleVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ articleId, teamId, token }: LikeArticleVariables) =>
        unlikeArticle(teamId, articleId, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchArticleQueries(
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
