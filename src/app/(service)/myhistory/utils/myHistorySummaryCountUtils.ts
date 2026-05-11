/**
 * 히스토리 요약 카드의 목록별 총개수 계산에 필요한 키/집계 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  HistoryTeamDetail,
} from '@/app/(service)/myhistory/types';
import { toHistoryTaskIdentityKey } from '@/app/(service)/myhistory/utils/myHistoryShared';

type HistoryTaskIdentityLike = {
  doneAt?: string;
  id: string;
  recurringId?: number;
};

export function toHistoryTaskListSummaryKey(
  teamId: string,
  taskListId: string,
) {
  return `${teamId}:${taskListId}`;
}

function appendTaskIdentitySet(
  identitySet: Set<string>,
  tasks: readonly HistoryTaskIdentityLike[],
) {
  tasks.forEach((task) => {
    identitySet.add(toHistoryTaskIdentityKey(task.id, task.recurringId));
  });
}

export function buildTaskListTotalIdentityMap(
  teamDetails: readonly HistoryTeamDetail[],
  sources: readonly HistoryTaskListDetailSource[],
) {
  const totalIdentityMap = new Map<string, Set<string>>();

  teamDetails.forEach((teamDetail) => {
    teamDetail.taskLists.forEach((taskList) => {
      const taskListKey = toHistoryTaskListSummaryKey(
        teamDetail.id,
        taskList.id,
      );
      const identitySet =
        totalIdentityMap.get(taskListKey) ?? new Set<string>();

      appendTaskIdentitySet(identitySet, taskList.tasks);
      totalIdentityMap.set(taskListKey, identitySet);
    });
  });

  sources.forEach((source) => {
    const taskListKey = toHistoryTaskListSummaryKey(
      source.teamId,
      source.taskListId,
    );
    const identitySet = totalIdentityMap.get(taskListKey) ?? new Set<string>();

    appendTaskIdentitySet(identitySet, source.tasks);
    totalIdentityMap.set(taskListKey, identitySet);
  });

  return totalIdentityMap;
}

export function buildSourceTaskIdentityMap(
  sources: readonly HistoryTaskListDetailSource[],
  status: 'all' | 'pending',
) {
  const taskIdentityMap = new Map<string, Set<string>>();

  sources.forEach((source) => {
    const taskListKey = toHistoryTaskListSummaryKey(
      source.teamId,
      source.taskListId,
    );
    const identitySet = taskIdentityMap.get(taskListKey) ?? new Set<string>();

    source.tasks.forEach((task) => {
      if (status === 'pending' && task.doneAt) {
        return;
      }

      identitySet.add(toHistoryTaskIdentityKey(task.id, task.recurringId));
    });

    taskIdentityMap.set(taskListKey, identitySet);
  });

  return taskIdentityMap;
}
