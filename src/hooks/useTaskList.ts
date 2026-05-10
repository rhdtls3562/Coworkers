/**
 * 할 일 목록(컬럼) 조회, 생성, 수정, 삭제, 순서 변경을 담당하는 훅 파일입니다.
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import type { QueryKeyId, TeamScopedDateQueryParams } from '@/api/queryKeys';
import { taskQueryOptions } from '@/api/queryOptions';
import type { QueryOptionsOverrides } from '@/api/queryOptions/factory';
import { getTaskListDetail } from '@/api/taskApi';

type TaskListDetailData = Awaited<ReturnType<typeof getTaskListDetail>>;

type UseTaskListDetailParams<TData = TaskListDetailData> = {
  options?: QueryOptionsOverrides<TaskListDetailData, TData>;
  params?: TeamScopedDateQueryParams;
  taskListId: QueryKeyId;
  teamId: string;
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
