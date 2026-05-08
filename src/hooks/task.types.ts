/**
 * 할 일 조회/수정/삭제/댓글 훅에서 공유하는 타입 모음입니다.
 */

'use client';

import type { getTaskComments } from '@/api/commentApi';
import type { QueryKeyId, TaskQueryParams } from '@/api/queryKeys';
import type { QueryOptionsOverrides } from '@/api/queryOptions/factory';
import type { getTaskDetail, getTasks } from '@/api/taskApi';

export type TasksData = Awaited<ReturnType<typeof getTasks>>;
export type TaskDetailData = Awaited<ReturnType<typeof getTaskDetail>>;
export type TaskCommentsData = Awaited<ReturnType<typeof getTaskComments>>;

export type UseTasksParams<TData = TasksData> = {
  options?: QueryOptionsOverrides<TasksData, TData>;
  params: TaskQueryParams;
  teamId: string;
};

export type UseTaskDetailParams<TData = TaskDetailData> = {
  options?: QueryOptionsOverrides<TaskDetailData, TData>;
  taskId: QueryKeyId;
  taskListId: QueryKeyId;
  teamId: string;
};

export type UseTaskCommentsParams<TData = TaskCommentsData> = {
  options?: QueryOptionsOverrides<TaskCommentsData, TData>;
  taskId: QueryKeyId;
  teamId: string;
};
