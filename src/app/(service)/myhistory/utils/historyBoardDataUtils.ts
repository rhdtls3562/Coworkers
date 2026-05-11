/**
 * 히스토리 보드 조회에 필요한 날짜 키와 할 일 목록 식별자 조합을 만드는 유틸입니다.
 */

import type {
  HistoryTaskListDescriptor,
  HistoryTeamDetail,
  MyHistoryCompletedTaskRecord,
  MyHistoryDateRange,
} from '@/app/(service)/myhistory/types';
import { addDays } from '@/app/(service)/myhistory/utils/formatHistoryDate';
import { toSectionDateKey } from '@/app/(service)/myhistory/utils/myHistoryTaskDateHelpers';

export function getCompletedDateKeys(
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
) {
  return Array.from(
    new Set(
      completedTasks
        .map((task) => (task.date ?? task.doneAt)?.slice(0, 10))
        .filter((dateKey): dateKey is string => Boolean(dateKey)),
    ),
  );
}

export function sortHistoryDateKeysByRecency(dateKeys: readonly string[]) {
  return [...dateKeys].sort((firstDateKey, secondDateKey) => {
    return new Date(secondDateKey).getTime() - new Date(firstDateKey).getTime();
  });
}

export function getTodayHistoryDateKey() {
  const today = new Date();
  return formatHistoryDateKey(today);
}

function formatHistoryDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getHistoryDateKeysFromRange(range: MyHistoryDateRange) {
  const dateKeys: string[] = [];
  let currentDate = new Date(
    range.startDate.getFullYear(),
    range.startDate.getMonth(),
    range.startDate.getDate(),
  );
  const endDate = new Date(
    range.endDate.getFullYear(),
    range.endDate.getMonth(),
    range.endDate.getDate(),
  );

  while (currentDate.getTime() <= endDate.getTime()) {
    dateKeys.push(formatHistoryDateKey(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dateKeys;
}

export function getTeamTaskDateKeys(teamDetails: readonly HistoryTeamDetail[]) {
  return Array.from(
    new Set(
      teamDetails.flatMap((teamDetail) =>
        teamDetail.taskLists.flatMap((taskList) =>
          taskList.tasks
            .map((task) => task.date.slice(0, 10))
            .filter((dateKey) => Boolean(dateKey)),
        ),
      ),
    ),
  );
}

export function getHistoryTaskListDescriptors(
  teamDetails: readonly HistoryTeamDetail[],
  completedDateKeys: readonly string[],
) {
  return teamDetails.flatMap((teamDetail) =>
    completedDateKeys.flatMap((dateKey) =>
      teamDetail.taskLists.map((taskList) => ({
        dateKey,
        displayIndex: taskList.displayIndex,
        taskListId: taskList.id,
        taskListName: taskList.name,
        teamId: teamDetail.id,
        teamName: teamDetail.name,
      })),
    ),
  ) satisfies HistoryTaskListDescriptor[];
}

export function getVisibleCompletedTasks(
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
  visibleDateKeys: readonly string[],
) {
  const visibleDateKeySet = new Set(visibleDateKeys);

  return completedTasks.filter((task) => {
    const sectionDateKey = toSectionDateKey(task);

    return sectionDateKey ? visibleDateKeySet.has(sectionDateKey) : false;
  });
}
