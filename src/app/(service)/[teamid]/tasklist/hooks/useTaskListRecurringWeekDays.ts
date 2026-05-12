'use client';

/**
 * 주 반복 할 일의 선택 요일을 현재 날짜 기준으로 추론하는 훅입니다.
 */

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import {
  getTaskListRecurringProbeDates,
  getTaskListWeeklyRecurringIds,
  inferTaskListRecurringWeekDays,
  toTaskListRecurringProbeDateStrings,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListRecurringWeekDays';
import type { TaskListDetail } from '@/types/task';

type UseTaskListRecurringWeekDaysParams = {
  groupId: string | null;
  selectedDate: Date;
  taskListDetail?: TaskListDetail;
  taskListId: string;
};

export default function useTaskListRecurringWeekDays({
  groupId,
  selectedDate,
  taskListDetail,
  taskListId,
}: UseTaskListRecurringWeekDaysParams) {
  const recurringIds = useMemo(
    () => getTaskListWeeklyRecurringIds(taskListDetail),
    [taskListDetail],
  );
  const probeDates = useMemo(
    () =>
      recurringIds.length > 0
        ? getTaskListRecurringProbeDates(selectedDate)
        : [],
    [recurringIds.length, selectedDate],
  );
  const probeDateStrings = useMemo(
    () => toTaskListRecurringProbeDateStrings(probeDates),
    [probeDates],
  );
  const probeQueries = useQueries({
    queries: probeDateStrings.map((date) =>
      taskQueryOptions.taskListDetail(String(groupId), taskListId, {
        date,
      }),
    ),
  });

  return useMemo(
    () =>
      inferTaskListRecurringWeekDays({
        probeDates,
        probeTaskLists: probeQueries.map((query) => query.data),
        recurringIds,
      }),
    [probeDates, probeQueries, recurringIds],
  );
}
