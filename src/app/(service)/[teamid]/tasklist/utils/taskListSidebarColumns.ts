/**
 * 리스트 페이지 사이드바 진행도 계산에 사용하는 보조 유틸입니다.
 */

import type { ApiError } from '@/api/types';
import type { TaskListDetail, TaskListSummary } from '@/types/task';

export function isTaskListNotFoundError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function createEmptyTaskListDetail(
  taskList: TaskListSummary,
): TaskListDetail {
  return {
    createdAt: taskList.createdAt,
    displayIndex: taskList.displayIndex,
    groupId: taskList.groupId,
    id: taskList.id,
    name: taskList.name,
    tasks: [],
    updatedAt: taskList.updatedAt,
  };
}
