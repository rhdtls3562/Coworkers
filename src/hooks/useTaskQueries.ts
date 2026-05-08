/**
 * 할 일 상세, 목록, 댓글 조회 쿼리를 모아둔 훅 파일입니다.
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import type { getTaskComments } from '@/api/commentApi';
import type { QueryKeyId, TaskQueryParams } from '@/api/queryKeys';
import { commentQueryOptions, taskQueryOptions } from '@/api/queryOptions';
import type { QueryOptionsOverrides } from '@/api/queryOptions/factory';
import type { getTaskDetail, getTasks } from '@/api/taskApi';

type TasksData = Awaited<ReturnType<typeof getTasks>>;
type TaskDetailData = Awaited<ReturnType<typeof getTaskDetail>>;
type TaskCommentsData = Awaited<ReturnType<typeof getTaskComments>>;

type UseTasksParams<TData = TasksData> = {
  options?: QueryOptionsOverrides<TasksData, TData>;
  params: TaskQueryParams;
  teamId: string;
};

type UseTaskDetailParams<TData = TaskDetailData> = {
  options?: QueryOptionsOverrides<TaskDetailData, TData>;
  taskId: QueryKeyId;
  taskListId: QueryKeyId;
  teamId: string;
};

type UseTaskCommentsParams<TData = TaskCommentsData> = {
  options?: QueryOptionsOverrides<TaskCommentsData, TData>;
  taskId: QueryKeyId;
  teamId: string;
};

export function useTasksQuery<TData = TasksData>({
  options,
  params,
  teamId,
}: UseTasksParams<TData>) {
  return useQuery(taskQueryOptions.list<TData>(teamId, params, options));
}

export function useTaskDetailQuery<TData = TaskDetailData>({
  options,
  taskId,
  taskListId,
  teamId,
}: UseTaskDetailParams<TData>) {
  return useQuery(
    taskQueryOptions.detail<TData>(teamId, taskListId, taskId, options),
  );
}

export function useTaskCommentsQuery<TData = TaskCommentsData>({
  options,
  taskId,
  teamId,
}: UseTaskCommentsParams<TData>) {
  return useQuery(
    commentQueryOptions.taskComments<TData>(teamId, taskId, options),
  );
}
