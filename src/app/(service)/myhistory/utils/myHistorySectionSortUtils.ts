/**
 * 히스토리 날짜 섹션 안에서 완료 이력을 읽기 좋은 순서로 정렬하는 유틸입니다.
 */

import type {
  HistoryTaskMeta,
  HistoryTaskMetaMap,
  MyHistoryCompletedTaskRecord,
} from '@/app/(service)/myhistory/types';
import { toTaskDate } from '@/app/(service)/myhistory/utils/myHistoryTaskDateHelpers';

function compareByCompletedAt(
  firstTask: MyHistoryCompletedTaskRecord,
  secondTask: MyHistoryCompletedTaskRecord,
) {
  const firstDate = toTaskDate(firstTask)?.getTime() ?? 0;
  const secondDate = toTaskDate(secondTask)?.getTime() ?? 0;

  return firstDate - secondDate;
}

function compareByTaskListOrder(
  firstMeta: HistoryTaskMeta | undefined,
  secondMeta: HistoryTaskMeta | undefined,
) {
  return (
    (firstMeta?.taskListDisplayIndex ?? 0) -
    (secondMeta?.taskListDisplayIndex ?? 0)
  );
}

function compareByTaskOrder(
  firstTask: MyHistoryCompletedTaskRecord,
  secondTask: MyHistoryCompletedTaskRecord,
) {
  return (firstTask.displayIndex ?? 0) - (secondTask.displayIndex ?? 0);
}

export function sortHistoryTasksByDisplayOrder(
  tasks: readonly MyHistoryCompletedTaskRecord[],
  taskMetaMap: HistoryTaskMetaMap,
) {
  return [...tasks].sort((firstTask, secondTask) => {
    const completedAtOrder = compareByCompletedAt(firstTask, secondTask);

    if (completedAtOrder !== 0) {
      return completedAtOrder;
    }

    const firstMeta = taskMetaMap.get(String(firstTask.id ?? ''));
    const secondMeta = taskMetaMap.get(String(secondTask.id ?? ''));
    const taskListOrder = compareByTaskListOrder(firstMeta, secondMeta);

    if (taskListOrder !== 0) {
      return taskListOrder;
    }

    return compareByTaskOrder(firstTask, secondTask);
  });
}
