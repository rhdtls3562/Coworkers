/**
 * 할 일 목록(컬럼) 조회, 생성, 수정, 삭제, 순서 변경을 담당하는 훅 파일입니다.
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { QueryKeyId, TeamScopedDateQueryParams } from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import { taskListQueryKeys } from '@/api/queryKeys/team';
import { taskQueryOptions } from '@/api/queryOptions';
import {
  createMutationOptions,
  type MutationOptionsOverrides,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import { createTaskList, getTaskListDetail } from '@/api/taskApi';

type TaskListDetailData = Awaited<ReturnType<typeof getTaskListDetail>>;

type UseTaskListDetailParams<TData = TaskListDetailData> = {
  options?: QueryOptionsOverrides<TaskListDetailData, TData>;
  params?: TeamScopedDateQueryParams;
  taskListId: QueryKeyId;
  teamId: string;
};

type CreateTaskListData = Awaited<ReturnType<typeof createTaskList>>;
type CreateTaskListVariables = {
  body: Parameters<typeof createTaskList>[1];
  teamId: string;
  groupId: Parameters<typeof createTaskList>[0];
};

export function useTaskListDetailQuery<TData = TaskListDetailData>({
  options,
  params,
  taskListId,
  teamId,
}: UseTaskListDetailParams<TData>) {
  return useQuery(
    taskQueryOptions.taskListDetail<TData>(teamId, taskListId, params, options),
  );
}

export function useCreateTaskListMutation(
  options?: MutationOptionsOverrides<
    CreateTaskListData,
    CreateTaskListVariables
  >,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({ groupId, body }: CreateTaskListVariables) =>
        createTaskList(groupId, body),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          await queryClient.invalidateQueries({
            queryKey: taskListQueryKeys.lists(variables.teamId),
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.team.detail(variables.teamId),
          });
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}
