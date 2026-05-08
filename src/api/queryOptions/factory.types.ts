/**
 * React Query 공용 팩토리에서 사용하는 옵션 타입 모음입니다.
 */

import type {
  MutationKey,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

export type { QueryKey };

export type QueryOptionsOverrides<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UndefinedInitialDataOptions<TQueryFnData, Error, TData, TQueryKey>,
  'queryFn' | 'queryKey'
>;

export type MutationOptionsOverrides<
  TData,
  TVariables,
  TOnMutateResult = unknown,
> = Omit<
  UseMutationOptions<TData, Error, TVariables, TOnMutateResult>,
  'mutationFn' | 'mutationKey'
>;

export type CreateQueryOptionsParams<
  TQueryFnData,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = {
  options?: QueryOptionsOverrides<TQueryFnData, TData, TQueryKey>;
  queryFn: () => Promise<TQueryFnData>;
  queryKey: TQueryKey;
  staleTime?: number;
};

export type CreateMutationOptionsParams<
  TData,
  TVariables,
  TOnMutateResult = unknown,
> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  mutationKey?: MutationKey;
  options?: MutationOptionsOverrides<TData, TVariables, TOnMutateResult>;
};
