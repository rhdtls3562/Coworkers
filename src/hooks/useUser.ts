/**
 * 내 정보, 멤버십, 완료한 할 일 이력 등 사용자 범위 서버 상태를 관리하는 훅 파일입니다.
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  CompletedTaskHistoryQueryParams,
  QueryParams,
} from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import { userQueryOptions } from '@/api/queryOptions';
import {
  createMutationOptions,
  type MutationOptionsOverrides,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import {
  changePassword,
  deleteMe,
  getCompletedTasks,
  getMe,
  getMyGroups,
  getMyMemberships,
  resetPassword,
  sendResetPasswordEmail,
  updateMe,
} from '@/api/userApi';

type CompletedTasksData = Awaited<ReturnType<typeof getCompletedTasks>>;
type DeleteMeData = Awaited<ReturnType<typeof deleteMe>>;
export type MeData = Awaited<ReturnType<typeof getMe>>;
type MyGroupsData = Awaited<ReturnType<typeof getMyGroups>>;
type MyMembershipsData = Awaited<ReturnType<typeof getMyMemberships>>;
type ResetPasswordData = Awaited<ReturnType<typeof resetPassword>>;
type SendResetPasswordEmailData = Awaited<
  ReturnType<typeof sendResetPasswordEmail>
>;
type ChangePasswordData = Awaited<ReturnType<typeof changePassword>>;
type UpdateMeData = Awaited<ReturnType<typeof updateMe>>;

type UseCompletedTasksParams<TData = CompletedTasksData> = {
  options?: QueryOptionsOverrides<CompletedTasksData, TData>;
  params?: CompletedTaskHistoryQueryParams;
};

type UseMyGroupsParams<TData = MyGroupsData> = {
  options?: QueryOptionsOverrides<MyGroupsData, TData>;
  params?: QueryParams;
};

type UseMyMembershipsParams<TData = MyMembershipsData> = {
  options?: QueryOptionsOverrides<MyMembershipsData, TData>;
  params?: QueryParams;
};

type UseMeParams<TData = MeData> = {
  options?: QueryOptionsOverrides<MeData, TData>;
};

type DeleteMeVariables = void;

type ChangePasswordVariables = {
  password: string;
  passwordConfirmation: string;
};

type SendResetPasswordEmailVariables = {
  body: {
    email: string;
    redirectUrl: string;
  };
  teamId: string;
};

type ResetPasswordVariables = {
  body: {
    password: string;
    passwordConfirmation: string;
    token: string;
  };
  teamId: string;
};

type UpdateMeVariables = Partial<Pick<MeData, 'nickname' | 'image'>>;

export function useMeQuery<TData = MeData>({
  options,
}: UseMeParams<TData> = {}) {
  return useQuery(userQueryOptions.me<TData>(options));
}

export function useDeleteMeMutation(
  options?: MutationOptionsOverrides<DeleteMeData, DeleteMeVariables>,
) {
  return useMutation(
    createMutationOptions({
      mutationFn: () => deleteMe(),
      options,
    }),
  );
}

export function useSendResetPasswordEmailMutation(
  options?: MutationOptionsOverrides<
    SendResetPasswordEmailData,
    SendResetPasswordEmailVariables
  >,
) {
  return useMutation(
    createMutationOptions({
      mutationFn: ({ body, teamId }: SendResetPasswordEmailVariables) =>
        sendResetPasswordEmail(teamId, body),
      options,
    }),
  );
}

export function useChangePasswordMutation(
  options?: MutationOptionsOverrides<
    ChangePasswordData,
    ChangePasswordVariables
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation(
    createMutationOptions({
      mutationFn: (variables: ChangePasswordVariables) =>
        changePassword(variables),
      options: {
        ...restOptions,
        onSuccess: (data, variables, onMutateResult, context) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.user.me(),
          });

          onSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useResetPasswordMutation(
  options?: MutationOptionsOverrides<ResetPasswordData, ResetPasswordVariables>,
) {
  return useMutation(
    createMutationOptions({
      mutationFn: ({ body, teamId }: ResetPasswordVariables) =>
        resetPassword(teamId, body),
      options,
    }),
  );
}

export function useMyGroupsQuery<TData = MyGroupsData>({
  options,
  params,
}: UseMyGroupsParams<TData> = {}) {
  return useQuery(userQueryOptions.groups<TData>(params, options));
}

export function useMyMembershipsQuery<TData = MyMembershipsData>({
  options,
  params,
}: UseMyMembershipsParams<TData> = {}) {
  return useQuery(userQueryOptions.memberships<TData>(params, options));
}

export function useCompletedTasksQuery<TData = CompletedTasksData>({
  options,
  params,
}: UseCompletedTasksParams<TData> = {}) {
  return useQuery(userQueryOptions.completedTasks<TData>(params, options));
}

export function useUpdateMeMutation(
  options?: MutationOptionsOverrides<UpdateMeData, UpdateMeVariables>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};

  return useMutation(
    createMutationOptions({
      mutationFn: (variables: UpdateMeVariables) => updateMe(variables),
      options: {
        ...restOptions,
        onSuccess: (data, variables, onMutateResult, context) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.user.me(),
          });

          onSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}
