'use client';

/**
 * 팀 생성과 초대 링크 참여처럼 팀 목록을 바꾸는 mutation 훅 모음입니다.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  acceptGroupInvitation,
  createGroup,
  deleteGroup,
  getGroupInvitation,
  removeMemberGroup,
  updateGroup,
} from '@/api/groupApi';
import { queryKeys } from '@/api/queryKeys';
import { QueryKeyId } from '@/api/queryKeys/types';
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

type UpdateTeamVariables = {
  body: Parameters<typeof updateGroup>[1];
  teamId: Parameters<typeof updateGroup>[0];
};

type CreateTeamVariables = {
  body: Parameters<typeof createGroup>[1];
  teamId: Parameters<typeof createGroup>[0];
};

type AcceptTeamInvitationVariables = {
  body: Parameters<typeof acceptGroupInvitation>[1];
  teamId: Parameters<typeof acceptGroupInvitation>[0];
};

type DeleteTeamVariables = {
  teamId: QueryKeyId;
};
type DeleteTeamData = Awaited<ReturnType<typeof deleteGroup>>;

type RemoveMemberTeamVariables = {
  memberUserId: QueryKeyId;
  teamId: QueryKeyId;
};
type RemoveMemberTeamData = Awaited<ReturnType<typeof removeMemberGroup>>;

type GetInvitationData = Awaited<ReturnType<typeof getGroupInvitation>>;
type GetInvitationVariables = {
  teamId: number;
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
      mutationFn: ({ body, teamId }: UpdateTeamVariables) =>
        updateGroup(teamId, body),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.team.detail(String(variables.teamId)),
          });
          await refetchUserQueries(queryClient);
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useDeleteTeamMutation(
  options?: MutationOptionsOverrides<DeleteTeamData, DeleteTeamVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ teamId }: DeleteTeamVariables) => deleteGroup(teamId),
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

export function useRemoveMemberTeamMutation(
  options?: MutationOptionsOverrides<
    RemoveMemberTeamData,
    RemoveMemberTeamVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ teamId, memberUserId }: RemoveMemberTeamVariables) =>
        removeMemberGroup(teamId, memberUserId),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.team.detail(String(variables.teamId)),
          });
          await refetchUserQueries(queryClient);
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useGetInvitationMutation(
  options?: MutationOptionsOverrides<GetInvitationData, GetInvitationVariables>,
) {
  return useMutation(
    createMutationOptions({
      mutationFn: ({ teamId }: GetInvitationVariables) =>
        getGroupInvitation(teamId),
      options,
    }),
  );
}
