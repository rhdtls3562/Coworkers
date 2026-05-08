/**
 * 도메인별 query options / mutation options 생성을 도와주는 공용 팩토리입니다.
 *
 * 이 파일은 아래 상황에서 열어보면 됩니다.
 * - 새 queryOptions 파일을 만들 때
 * - 목록 조회에 `keepPreviousData`를 자동으로 넣고 싶을 때
 * - mutation options 타입을 통일하고 싶을 때
 *
 * 핵심 규칙:
 * - `createQueryOptions`: 일반 조회용
 * - `createListQueryOptions`: 목록 조회용 (기본 `keepPreviousData` 포함)
 * - `createMutationOptions`: mutation용
 */

import {
  keepPreviousData,
  mutationOptions,
  queryOptions,
} from '@tanstack/react-query';

import type {
  CreateMutationOptionsParams,
  CreateQueryOptionsParams,
  QueryKey,
} from '@/api/queryOptions/factory.types';

export type {
  MutationOptionsOverrides,
  QueryOptionsOverrides,
} from '@/api/queryOptions/factory.types';

export function createQueryOptions<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  options,
  queryFn,
  queryKey,
  staleTime,
}: CreateQueryOptionsParams<TQueryFnData, TData, TQueryKey>) {
  return queryOptions({
    queryFn,
    queryKey,
    staleTime,
    ...options,
  });
}

export function createListQueryOptions<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  options,
  queryFn,
  queryKey,
  staleTime,
}: CreateQueryOptionsParams<TQueryFnData, TData, TQueryKey>) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn,
    queryKey,
    staleTime,
    ...options,
  });
}

export function createMutationOptions<
  TData,
  TVariables,
  TOnMutateResult = unknown,
>({
  mutationFn,
  mutationKey,
  options,
}: CreateMutationOptionsParams<TData, TVariables, TOnMutateResult>) {
  return mutationOptions({
    ...(mutationKey ? { mutationKey } : {}),
    mutationFn,
    ...options,
  });
}
