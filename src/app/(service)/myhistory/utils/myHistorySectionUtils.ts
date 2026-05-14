/**
 * 히스토리 섹션 생성에 필요한 작업 메타와 화면 표시용 작업 변환 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  HistoryTaskMeta,
  HistoryTeamDetail,
  MyHistoryCompletedTaskRecord,
  MyHistoryTask,
} from '@/app/(service)/myhistory/types';
import {
  formatHistoryTaskFrequency,
  toDateLabel,
  toHistoryScheduleEditConfig,
  toHistoryTaskIdentityKey,
} from '@/app/(service)/myhistory/utils/myHistoryShared';

export function getTaskMetaMap(
  teamDetails: readonly HistoryTeamDetail[],
  sources: readonly HistoryTaskListDetailSource[],
) {
  const taskMetaMap = new Map<string, HistoryTaskMeta>();

  teamDetails.forEach((teamDetail) => {
    teamDetail.taskLists.forEach((taskList) => {
      taskList.tasks.forEach((task) => {
        taskMetaMap.set(task.id, {
          commentCount: task.commentCount,
          scheduleEditConfig: toHistoryScheduleEditConfig({
            frequency: task.frequency,
            recurringId: task.recurringId,
            startedAtRaw: task.date,
            weekDays: task.weekDays,
          }),
          taskDisplayIndex: task.displayIndex,
          taskIdentityKey: toHistoryTaskIdentityKey(task.id, task.recurringId),
          taskListDisplayIndex: taskList.displayIndex,
          taskListId: taskList.id,
          taskListName: taskList.name,
          taskName: task.name,
          teamId: teamDetail.id,
          teamName: teamDetail.name,
        });
      });
    });
  });

  sources.forEach((source) => {
    source.tasks.forEach((task) => {
      taskMetaMap.set(task.id, {
        commentCount: task.commentCount,
        scheduleEditConfig: toHistoryScheduleEditConfig({
          frequency: task.frequency,
          recurringId: task.recurringId,
          startedAtRaw: task.date,
          weekDays: task.weekDays,
        }),
        taskDisplayIndex: task.displayIndex,
        taskIdentityKey: toHistoryTaskIdentityKey(task.id, task.recurringId),
        taskListDisplayIndex: source.displayIndex,
        taskListId: source.taskListId,
        taskListName: source.taskListName,
        taskName: task.name,
        teamId: source.teamId,
        teamName: source.teamName,
      });
    });
  });

  return taskMetaMap;
}

export function toHistoryTask(
  task: MyHistoryCompletedTaskRecord,
  meta?: HistoryTaskMeta,
) {
  return {
    commentCount: meta?.commentCount ?? 0,
    description: task.description ?? '',
    doneAt: toDateLabel(task.doneAt),
    dueDate: toDateLabel(task.date),
    frequency: formatHistoryTaskFrequency(task.frequency),
    id: String(task.id ?? `${task.name}-${task.doneAt}`),
    isCompleted: true,
    scheduleEditConfig: toHistoryScheduleEditConfig({
      frequency: task.frequency,
      recurringId: meta?.scheduleEditConfig?.recurringId
        ? Number(meta.scheduleEditConfig.recurringId)
        : undefined,
      startedAtRaw: task.date ?? meta?.scheduleEditConfig?.startedAtRaw,
      weekDays: meta?.scheduleEditConfig?.weekDays,
    }),
    startedAt: toDateLabel(task.date),
    taskListId: meta?.taskListId ?? '',
    teamId: meta?.teamId ?? '',
    title: task.name?.trim() || meta?.taskName || '이름 없는 할 일',
  } satisfies MyHistoryTask;
}
