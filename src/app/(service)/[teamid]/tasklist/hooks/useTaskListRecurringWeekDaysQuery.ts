/**
 * 주 반복 할 일의 선택 요일을 현재 날짜 기준으로 추론하는 훅입니다.
 */

import { useMemo } from 'react';

import { useQueries } from '@tanstack/react-query';

import { taskQueryOptions } from '@/api/queryOptions';
import type { UseTaskListRecurringWeekDaysQueryParams } from '@/app/(service)/[teamid]/tasklist/types';
import {
  getTaskListRecurringProbeDates,
  getTaskListWeeklyRecurringIds,
  inferTaskListRecurringWeekDays,
  toTaskListRecurringProbeDateStrings,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListRecurringWeekDays';

export default function useTaskListRecurringWeekDaysQuery({
  groupId,
  selectedDate,
  taskListDetail,
  taskListId,
}: UseTaskListRecurringWeekDaysQueryParams) {
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
      taskQueryOptions.taskListDetail(
        groupId ?? '',
        taskListId,
        {
          date,
        },
        {
          enabled: groupId !== null && taskListId !== '',
        },
      ),
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
