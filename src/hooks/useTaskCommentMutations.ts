/**
 * 할 일 댓글 생성, 수정, 삭제 mutation을 모아둔 훅 파일입니다.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createTaskComment,
  deleteTaskComment,
  updateTaskComment,
} from '@/api/commentApi';
import type { QueryKeyId } from '@/api/queryKeys';
import {
  createMutationOptions,
  type MutationOptionsOverrides,
} from '@/api/queryOptions/factory';
import { refetchTaskCommentQueries } from '@/api/queryRefetch';

type CreateTaskCommentData = Awaited<ReturnType<typeof createTaskComment>>;
type UpdateTaskCommentData = Awaited<ReturnType<typeof updateTaskComment>>;
type DeleteTaskCommentData = Awaited<ReturnType<typeof deleteTaskComment>>;

type CreateTaskCommentVariables = {
  body: {
    content: string;
  };
  groupId?: string;
  taskId: QueryKeyId;
  teamId: string;
  token?: string;
};

type UpdateTaskCommentVariables = {
  body: {
    content: string;
  };
  commentId: QueryKeyId;
  groupId?: string;
  taskId: QueryKeyId;
  teamId: string;
  token?: string;
};

type DeleteTaskCommentVariables = {
  commentId: QueryKeyId;
  groupId?: string;
  taskId: QueryKeyId;
  teamId: string;
  token?: string;
};

export function useCreateTaskCommentMutation(
  options?: MutationOptionsOverrides<
    CreateTaskCommentData,
    CreateTaskCommentVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: (variables: CreateTaskCommentVariables) =>
        createTaskComment(
          variables.teamId,
          variables.taskId,
          variables.body,
          variables.token,
        ),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchTaskCommentQueries(
            queryClient,
            variables.teamId,
            variables.taskId,
            variables.groupId,
          );
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useUpdateTaskCommentMutation(
  options?: MutationOptionsOverrides<
    UpdateTaskCommentData,
    UpdateTaskCommentVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: (variables: UpdateTaskCommentVariables) =>
        updateTaskComment(
          variables.teamId,
          variables.taskId,
          variables.commentId,
          variables.body,
          variables.token,
        ),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchTaskCommentQueries(
            queryClient,
            variables.teamId,
            variables.taskId,
            variables.groupId,
          );
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useDeleteTaskCommentMutation(
  options?: MutationOptionsOverrides<
    DeleteTaskCommentData,
    DeleteTaskCommentVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: (variables: DeleteTaskCommentVariables) =>
        deleteTaskComment(
          variables.teamId,
          variables.taskId,
          variables.commentId,
          variables.token,
        ),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await refetchTaskCommentQueries(
            queryClient,
            variables.teamId,
            variables.taskId,
            variables.groupId,
          );
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}
