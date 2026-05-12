/**
 * 팀별 완료 요약 카드와 필터 계산에 필요한 세부 유틸입니다.
 */

import type {
  HistoryTaskMetaMap,
  MyHistoryCompletedTaskRecord,
  MyHistoryFilter,
  MyHistorySummaryItem,
} from '@/app/(service)/myhistory/types';
import { toHistoryTaskListSummaryKey } from '@/app/(service)/myhistory/utils/myHistorySummaryCountUtils';

function getTaskId(task: MyHistoryCompletedTaskRecord) {
  return typeof task.id === 'string' || typeof task.id === 'number'
    ? String(task.id)
    : null;
}

export function buildCompletedTaskCountMap(
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
  taskMetaMap: HistoryTaskMetaMap,
) {
  const completedTaskMap = completedTasks.reduce<Map<string, Set<string>>>(
    (taskCountMap, task) => {
      const taskId = getTaskId(task);

      if (!taskId) {
        return taskCountMap;
      }

      const taskMeta = taskMetaMap.get(taskId);

      if (!taskMeta) {
        return taskCountMap;
      }

      const taskListKey = toHistoryTaskListSummaryKey(
        taskMeta.teamId,
        taskMeta.taskListId,
      );
      const completedTaskSet =
        taskCountMap.get(taskListKey) ?? new Set<string>();

      completedTaskSet.add(taskMeta.taskIdentityKey);
      taskCountMap.set(taskListKey, completedTaskSet);

      return taskCountMap;
    },
    new Map(),
  );

  return completedTaskMap;
}

export function buildHistoryTeamFilters(
  summaryItems: readonly MyHistorySummaryItem[],
) {
  return summaryItems.map(
    (item) =>
      ({
        count: item.count,
        id: item.id,
        label: item.title,
      }) satisfies MyHistoryFilter,
  );
}
