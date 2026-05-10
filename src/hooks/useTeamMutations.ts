'use client';

/**
 * 팀 생성과 초대 링크 참여처럼 팀 목록을 바꾸는 mutation 훅 모음입니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  acceptGroupInvitation,
  createGroup,
  updateGroup,
} from '@/api/groupApi';
import { queryKeys } from '@/api/queryKeys';
import {
  createMutationOptions,
  type MutationOptionsOverrides,
} from '@/api/queryOptions/factory';
import { refetchUserQueries } from '@/api/queryRefetch';

type CreateTeamData = Awaited<ReturnType<typeof createGroup>>;
type AcceptTeamInvitationData = Awaited<
  ReturnType<typeof acceptGroupInvitation>
>;
type UpdateTeamData = Awaited<ReturnType<typeof updateGroup>>;

type CreateTeamVariables = {
  body: Parameters<typeof createGroup>[1];
  teamId: Parameters<typeof createGroup>[0];
};

type AcceptTeamInvitationVariables = {
  body: Parameters<typeof acceptGroupInvitation>[1];
  teamId: Parameters<typeof acceptGroupInvitation>[0];
};

type UpdateTeamVariables = {
  body: Parameters<typeof updateGroup>[2];
  groupId: Parameters<typeof updateGroup>[1];
  teamId: Parameters<typeof updateGroup>[0];
};

export function useCreateTeamMutation(
  options?: MutationOptionsOverrides<CreateTeamData, CreateTeamVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ body, teamId }: CreateTeamVariables) =>
        createGroup(teamId, body),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchUserQueries(queryClient);
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useAcceptTeamInvitationMutation(
  options?: MutationOptionsOverrides<
    AcceptTeamInvitationData,
    AcceptTeamInvitationVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ body, teamId }: AcceptTeamInvitationVariables) =>
        acceptGroupInvitation(teamId, body),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchUserQueries(queryClient);
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useUpdateTeamMutation(
  options?: MutationOptionsOverrides<UpdateTeamData, UpdateTeamVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ body, groupId, teamId }: UpdateTeamVariables) =>
        updateGroup(teamId, groupId, body),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await Promise.all([
            refetchUserQueries(queryClient),
            queryClient.invalidateQueries({
              queryKey: queryKeys.team.detail(String(variables.groupId)),
            }),
          ]);
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}
