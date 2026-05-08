/**
 * 할 일 상세, 목록, 댓글 조회 쿼리를 모아둔 훅 파일입니다.
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import { commentQueryOptions, taskQueryOptions } from '@/api/queryOptions';
import type {
  TaskCommentsData,
  TaskDetailData,
  TasksData,
  UseTaskCommentsParams,
  UseTaskDetailParams,
  UseTasksParams,
} from '@/hooks/task.types';

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
