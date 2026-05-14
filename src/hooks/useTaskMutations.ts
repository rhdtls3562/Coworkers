/**
 * 할 일 자체의 수정, 삭제 mutation을 모아둔 훅 파일입니다.
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { QueryKeyId } from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import {
  createMutationOptions,
  type MutationOptionsOverrides,
} from '@/api/queryOptions/factory';
import { deleteTask, updateTask } from '@/api/taskApi';
import type { TaskUpdateBody } from '@/api/types';
import {
  invalidateTaskCheckedFollowups,
  syncDeletedTaskCaches,
  syncTaskCheckedCaches,
} from '@/hooks/taskMutationCache';
import type { GroupDetail } from '@/types/group';
import type { TaskListDetail } from '@/types/task';

type UpdateTaskData = Awaited<ReturnType<typeof updateTask>>;
type DeleteTaskData = Awaited<ReturnType<typeof deleteTask>>;

type UpdateTaskVariables = {
  body: TaskUpdateBody;
  taskId: QueryKeyId;
  taskListId: QueryKeyId;
  teamId: string;
  token?: string;
};

type DeleteTaskVariables = {
  taskId: QueryKeyId;
  taskListId: QueryKeyId;
  teamId: string;
  token?: string;
};

export function useUpdateTaskMutation(
  options?: MutationOptionsOverrides<UpdateTaskData, UpdateTaskVariables>,
) {
  const queryClient = useQueryClient();
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({
        body,
        taskId,
        taskListId,
        teamId,
        token,
      }: UpdateTaskVariables) =>
        updateTask(teamId, taskListId, taskId, body, token),
      options: {
        ...options,
        onSuccess: async (data, variables, onMutateResult, context) => {
          if (typeof variables.body.done === 'boolean') {
            syncTaskCheckedCaches({
              checked: variables.body.done,
              queryClient,
              taskId: variables.taskId,
              taskListId: variables.taskListId,
              teamId: variables.teamId,
            });
            await invalidateTaskCheckedFollowups({
              queryClient,
              taskId: variables.taskId,
              taskListId: variables.taskListId,
              teamId: variables.teamId,
            });
            await queryClient.invalidateQueries({
              queryKey: queryKeys.taskList.detail(
                variables.teamId,
                String(variables.taskListId),
              ),
            });
          } else {
            await Promise.all([
              queryClient.invalidateQueries({
                queryKey: queryKeys.task.detail(
                  variables.teamId,
                  variables.taskId,
                  variables.taskListId,
                ),
              }),
              queryClient.invalidateQueries({
                queryKey: queryKeys.taskList.detail(
                  variables.teamId,
                  variables.taskListId,
                ),
              }),
            ]);
          }
          await handleSuccess?.(data, variables, onMutateResult, context);
        },
      },
    }),
  );
}

export function useDeleteTaskMutation(
  options?: MutationOptionsOverrides<DeleteTaskData, DeleteTaskVariables>,
) {
  const queryClient = useQueryClient();
  const handleError = options?.onError;
  const handleMutate = options?.onMutate;
  const handleSuccess = options?.onSuccess;

  return useMutation(
    createMutationOptions({
      mutationFn: ({
        taskId,
        taskListId,
        teamId,
        token,
      }: DeleteTaskVariables) => deleteTask(teamId, taskListId, taskId, token),
      options: {
        ...options,
        onMutate: async (variables, context) => {
          const taskListIdString = String(variables.taskListId);

          await Promise.all([
            queryClient.cancelQueries({
              queryKey: queryKeys.team.detail(variables.teamId),
            }),
            queryClient.cancelQueries({
              queryKey: queryKeys.taskList.detail(
                variables.teamId,
                taskListIdString,
              ),
            }),
            queryClient.cancelQueries({
              queryKey: queryKeys.user.completedTasks(),
            }),
          ]);

          const previousTeamDetail = queryClient.getQueryData<GroupDetail>(
            queryKeys.team.detail(variables.teamId),
          );
          const previousTaskListDetails = queryClient.getQueriesData<
            TaskListDetail | undefined
          >({
            queryKey: queryKeys.taskList.detail(
              variables.teamId,
              taskListIdString,
            ),
          });
          const previousCompletedTasksQueries = queryClient.getQueriesData({
            queryKey: queryKeys.user.completedTasks(),
          });

          syncDeletedTaskCaches({
            queryClient,
            taskId: variables.taskId,
            taskListId: variables.taskListId,
            teamId: variables.teamId,
          });

          const externalOnMutateResult = await handleMutate?.(
            variables,
            context,
          );

          return {
            externalOnMutateResult,
            previousCompletedTasksQueries,
            previousTaskListDetails,
            previousTeamDetail,
          };
        },
        onError: async (error, variables, onMutateResult, context) => {
          if (onMutateResult?.previousTeamDetail !== undefined) {
            queryClient.setQueryData(
              queryKeys.team.detail(variables.teamId),
              onMutateResult.previousTeamDetail,
            );
          }

          onMutateResult?.previousTaskListDetails?.forEach(
            ([queryKey, previousTaskListDetail]) => {
              queryClient.setQueryData(queryKey, previousTaskListDetail);
            },
          );

          onMutateResult?.previousCompletedTasksQueries?.forEach(
            ([queryKey, previousCompletedTasks]) => {
              queryClient.setQueryData(queryKey, previousCompletedTasks);
            },
          );

          await handleError?.(
            error,
            variables,
            onMutateResult?.externalOnMutateResult,
            context,
          );
        },
        onSuccess: async (data, variables, onMutateResult, context) => {
          await Promise.all([
            queryClient.removeQueries({
              queryKey: queryKeys.task.detail(
                variables.teamId,
                variables.taskId,
                variables.taskListId,
              ),
            }),
            queryClient.invalidateQueries({
              queryKey: queryKeys.team.detail(variables.teamId),
            }),
            queryClient.invalidateQueries({
              queryKey: queryKeys.taskList.detail(
                variables.teamId,
                variables.taskListId,
              ),
            }),
            queryClient.invalidateQueries({
              queryKey: queryKeys.user.completedTasks(),
            }),
            queryClient.invalidateQueries({
              queryKey: queryKeys.user.completedTaskSummary(),
            }),
          ]);
          await handleSuccess?.(
            data,
            variables,
            onMutateResult?.externalOnMutateResult,
            context,
          );
        },
      },
    }),
  );
}
