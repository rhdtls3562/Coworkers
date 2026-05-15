/**
 * 완료 이력의 날짜 파싱과 범위 계산을 돕는 유틸입니다.
 */

import type {
  MyHistoryCompletedTaskRecord,
  MyHistoryDateRange,
} from '@/app/(service)/myhistory/types';
import { isDateWithinHistoryRange } from '@/app/(service)/myhistory/utils/formatHistoryDate';
import {
  toHistoryCalendarDate,
  toHistoryDateKey,
} from '@/app/(service)/myhistory/utils/myHistoryKoreaDate';

export function toTaskDate(task: MyHistoryCompletedTaskRecord) {
  return toHistoryCalendarDate(task.date ?? task.doneAt);
}

export function toSectionDateKey(task: MyHistoryCompletedTaskRecord) {
  return toHistoryDateKey(task.date ?? task.doneAt);
}

export function getLatestHistoryTaskDate(
  tasks: readonly MyHistoryCompletedTaskRecord[],
) {
  const latestDateKey = tasks.reduce<string | null>((latest, task) => {
    const dateKey = toSectionDateKey(task);

    if (!dateKey) {
      return latest;
    }

    if (!latest || dateKey > latest) {
      return dateKey;
    }

    return latest;
  }, null);

  return latestDateKey ? toHistoryCalendarDate(latestDateKey) : null;
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
