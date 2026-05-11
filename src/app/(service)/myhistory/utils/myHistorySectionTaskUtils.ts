/**
 * 반복 할 일 완료 이력에서 최신 항목만 남기도록 정리하는 유틸입니다.
 */

import type {
  HistoryTaskMeta,
  MyHistoryCompletedTaskRecord,
} from '@/app/(service)/myhistory/types';
import { toTaskDate } from '@/app/(service)/myhistory/utils/myHistoryTaskDateHelpers';

type HistoryTaskMetaMap = ReadonlyMap<string, HistoryTaskMeta>;

function toHistoryTaskId(task: MyHistoryCompletedTaskRecord) {
  return typeof task.id === 'number' || typeof task.id === 'string'
    ? String(task.id)
    : null;
}

function isMoreRecentHistoryTask(
  candidateTask: MyHistoryCompletedTaskRecord,
  currentTask: MyHistoryCompletedTaskRecord,
) {
  const candidateTime = toTaskDate(candidateTask)?.getTime() ?? 0;
  const currentTime = toTaskDate(currentTask)?.getTime() ?? 0;

  return candidateTime > currentTime;
}

export function collapseRecurringHistoryTasks(
  tasks: readonly MyHistoryCompletedTaskRecord[],
  taskMetaMap: HistoryTaskMetaMap,
) {
  const latestTaskMap = new Map<string, MyHistoryCompletedTaskRecord>();

  tasks.forEach((task) => {
    const taskId = toHistoryTaskId(task);

    if (!taskId) {
      return;
    }

    const taskMeta = taskMetaMap.get(taskId);

    if (!taskMeta) {
      return;
    }

    const currentTask = latestTaskMap.get(taskMeta.taskIdentityKey);

    if (!currentTask || isMoreRecentHistoryTask(task, currentTask)) {
      latestTaskMap.set(taskMeta.taskIdentityKey, task);
    }
  });

  return Array.from(latestTaskMap.values());
}
