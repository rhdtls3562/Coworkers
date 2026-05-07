/**
 * 완료 이력의 날짜 파싱과 범위 계산을 돕는 유틸입니다.
 */

import type {
  MyHistoryCompletedTaskRecord,
  MyHistoryDateRange,
} from '@/app/(service)/myhistory/types';
import { isDateWithinHistoryRange } from '@/app/(service)/myhistory/utils/formatHistoryDate';

export function toTaskDate(task: MyHistoryCompletedTaskRecord) {
  const baseDate = task.date ?? task.doneAt;

  if (!baseDate) {
    return null;
  }

  const date = new Date(baseDate);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function toSectionDateKey(task: MyHistoryCompletedTaskRecord) {
  const baseDate = task.date ?? task.doneAt;

  return baseDate ? baseDate.slice(0, 10) : null;
}

export function getLatestHistoryTaskDate(
  tasks: readonly MyHistoryCompletedTaskRecord[],
) {
  const latestTimestamp = tasks.reduce<number | null>((latest, task) => {
    const date = toTaskDate(task);

    if (!date) {
      return latest;
    }

    const timestamp = date.getTime();

    if (latest === null || timestamp > latest) {
      return timestamp;
    }

    return latest;
  }, null);

  return latestTimestamp === null ? null : new Date(latestTimestamp);
}

export function getCompletedTasksInRange(
  tasks: readonly MyHistoryCompletedTaskRecord[],
  range: MyHistoryDateRange,
) {
  return tasks.filter((task) => {
    const date = toTaskDate(task);

    return date ? isDateWithinHistoryRange(date, range) : false;
  });
}
