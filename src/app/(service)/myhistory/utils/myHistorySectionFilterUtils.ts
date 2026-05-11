/**
 * 선택된 팀 기준으로 완료 이력 작업 목록을 거르는 유틸입니다.
 */

import type {
  HistoryTaskMeta,
  MyHistoryCompletedTaskRecord,
} from '@/app/(service)/myhistory/types';

type HistoryTaskMetaMap = ReadonlyMap<string, HistoryTaskMeta>;

function toHistoryTaskId(task: MyHistoryCompletedTaskRecord) {
  return typeof task.id === 'number' || typeof task.id === 'string'
    ? String(task.id)
    : null;
}

function hasHistoryTaskMeta(
  task: MyHistoryCompletedTaskRecord,
  taskMetaMap: HistoryTaskMetaMap,
) {
  const taskId = toHistoryTaskId(task);

  return taskId ? taskMetaMap.has(taskId) : false;
}

export function filterHistoryTasksByActiveTeam(
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
  activeTeamId: string | null,
  taskMetaMap: HistoryTaskMetaMap,
) {
  if (!activeTeamId) {
    return completedTasks.filter((task) =>
      hasHistoryTaskMeta(task, taskMetaMap),
    );
  }

  return completedTasks.filter((task) => {
    const taskId = toHistoryTaskId(task);

    return taskId ? taskMetaMap.get(taskId)?.teamId === activeTeamId : false;
  });
}
