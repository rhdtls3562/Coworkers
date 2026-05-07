/**
 * 할 일 관련 query options 모음입니다.
 *
 * 이 파일은 아래 조회 기능을 만들 때 사용합니다.
 * - 날짜 / 조건별 할 일 목록 조회
 * - 할 일 상세 조회
 * - 할 일 목록(컬럼) 상세 조회
 *
 * 즉 `taskApi.ts`의 조회 함수를 React Query에 연결하는 중간 단계라고 보면 됩니다.
 */

import type {
  QueryKeyId,
  TaskQueryParams,
  TeamScopedDateQueryParams,
} from '@/api/queryKeys';
import { queryKeys } from '@/api/queryKeys';
import { QUERY_OPTION_DEFAULTS } from '@/api/queryOptions/constants';
import {
  createListQueryOptions,
  createQueryOptions,
  type QueryOptionsOverrides,
} from '@/api/queryOptions/factory';
import type {
  TaskDetailData,
  TaskListDetailData,
  TasksData,
} from '@/api/queryOptions/types';
import { getTaskDetail, getTaskListDetail, getTasks } from '@/api/taskApi';

/** 할 일 / 할 일 목록 조회 hook이 공통으로 사용하는 options입니다. */
export const taskQueryOptions = {
  detail: <TData = TaskDetailData>(
    teamId: string,
    taskListId: QueryKeyId,
    taskId: QueryKeyId,
    options?: QueryOptionsOverrides<TaskDetailData, TData>,
  ) =>
    createQueryOptions<TaskDetailData, TData>({
      options,
      queryFn: () => getTaskDetail(teamId, taskListId, taskId),
      queryKey: queryKeys.task.detail(teamId, taskId, taskListId),
      staleTime: QUERY_OPTION_DEFAULTS.DETAIL_STALE_TIME,
    }),
  list: <TData = TasksData>(
    teamId: string,
    params: TaskQueryParams,
    options?: QueryOptionsOverrides<TasksData, TData>,
  ) =>
    createListQueryOptions<TasksData, TData>({
      options,
      queryFn: () => getTasks(teamId, params),
      queryKey: queryKeys.task.list(teamId, params),
      staleTime: QUERY_OPTION_DEFAULTS.LIST_STALE_TIME,
    }),
  taskListDetail: <TData = TaskListDetailData>(
    teamId: string,
    taskListId: QueryKeyId,
    params?: TeamScopedDateQueryParams,
    options?: QueryOptionsOverrides<TaskListDetailData, TData>,
  ) =>
    createQueryOptions<TaskListDetailData, TData>({
      options,
      queryFn: () => getTaskListDetail(teamId, taskListId, params),
      queryKey: queryKeys.taskList.detail(teamId, taskListId, params),
      staleTime: QUERY_OPTION_DEFAULTS.TASK_LIST_DETAIL_STALE_TIME,
    }),
} as const;
