/**
 * 주 반복 할 일의 요일 라벨 추론에 사용하는 날짜 / 매핑 유틸입니다.
 */

import { addDays } from '@/app/(service)/[teamid]/tasklist/utils/boardDate';
import { toTaskListDateString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import type { TaskListDetail } from '@/types/task';

const WEEKLY_RECURRING_PROBE_DAYS = 7;

export function getTaskListRecurringProbeDates(selectedDate: Date) {
  return Array.from({ length: WEEKLY_RECURRING_PROBE_DAYS }, (_, index) =>
    addDays(selectedDate, index),
  );
}

export function getTaskListWeeklyRecurringIds(taskListDetail?: TaskListDetail) {
  return Array.from(
    new Set(
      (taskListDetail?.tasks ?? [])
        .filter(
          (task) =>
            task.frequency === 'WEEKLY' &&
            task.recurringId > 0 &&
            !(task.weekDays && task.weekDays.length > 0),
        )
        .map((task) => String(task.recurringId)),
    ),
  );
}

export function inferTaskListRecurringWeekDays({
  probeDates,
  probeTaskLists,
  recurringIds,
}: {
  probeDates: readonly Date[];
  probeTaskLists: readonly (TaskListDetail | undefined)[];
  recurringIds: readonly string[];
}) {
  const recurringIdSet = new Set(recurringIds);
  const weekDayMap = new Map<string, Set<number>>();

  probeTaskLists.forEach((taskListDetail, index) => {
    const weekDay = probeDates[index]?.getDay();

    if (weekDay === undefined) {
      return;
    }

    taskListDetail?.tasks.forEach((task) => {
      const recurringId = String(task.recurringId);

      if (task.frequency !== 'WEEKLY' || !recurringIdSet.has(recurringId)) {
        return;
      }

      const weekDays = weekDayMap.get(recurringId) ?? new Set<number>();
      weekDays.add(weekDay);
      weekDayMap.set(recurringId, weekDays);
    });
  });

  return Object.fromEntries(
    Array.from(weekDayMap.entries()).map(([recurringId, weekDays]) => [
      recurringId,
      Array.from(weekDays).sort((firstDay, secondDay) => firstDay - secondDay),
    ]),
  ) as Record<string, number[]>;
}

export function toTaskListRecurringProbeDateStrings(dates: readonly Date[]) {
  return dates.map((date) => toTaskListDateString(date));
}
