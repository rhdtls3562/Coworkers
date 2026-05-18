/**
 * 팀 / 할 일 리스트 화면에서 런타임에 섞여 들어올 수 있는 null 항목을 걸러내는 유틸입니다.
 */

import type { Task } from '@/types/task';

function isNonNullObject<T extends object>(
  value: T | null | undefined,
): value is T {
  return typeof value === 'object' && value !== null;
}

export function getSafeTaskArray<T extends Task>(
  tasks: readonly (T | null | undefined)[] | null | undefined,
) {
  return (tasks ?? []).filter(isNonNullObject);
}

export function getSafeTaskListArray<T extends { id: number | string }>(
  taskLists: readonly (T | null | undefined)[] | null | undefined,
) {
  return (taskLists ?? []).filter(isNonNullObject);
}
