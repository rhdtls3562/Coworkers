/**
 * 완료되지 않은 할 일만 날짜별 섹션으로 묶는 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  MyHistoryDateSection,
  MyHistoryTask,
  PendingTaskSource,
} from '@/app/(service)/myhistory/types';
import { toHistoryDateKey } from '@/app/(service)/myhistory/utils/myHistoryKoreaDate';
import {
  formatHistoryTaskFrequency,
  toDateLabel,
  toHistoryScheduleEditConfig,
  toHistoryTaskIdentityKey,
} from '@/app/(service)/myhistory/utils/myHistoryShared';

function toPendingTaskDateKey(source: PendingTaskSource) {
  return toHistoryDateKey(source.task.date) ?? source.source.dateKey;
}

function toPendingHistoryTask({ source, task }: PendingTaskSource) {
  return {
    commentCount: task.commentCount,
    description: task.description,
    doneAt: '-',
    dueDate: toDateLabel(task.date),
    frequency: formatHistoryTaskFrequency(task.frequency),
    id: task.id,
    isCompleted: false,
    scheduleEditConfig: toHistoryScheduleEditConfig({
      frequency: task.frequency,
      recurringId: task.recurringId,
      startedAtRaw: task.date,
      weekDays: task.weekDays,
    }),
    startDate: task.startDate,
    startedAt: toDateLabel(task.date),
    taskListId: source.taskListId,
    teamId: source.teamId,
    title: task.name,
  } satisfies MyHistoryTask;
}

function collapsePendingSourcesByIdentity(
  sources: readonly HistoryTaskListDetailSource[],
  activeTeamId: string | null,
) {
  const nearestPendingTaskMap = new Map<string, PendingTaskSource>();

  sources.forEach((source) => {
    if (activeTeamId && source.teamId !== activeTeamId) {
      return;
    }

    source.tasks.forEach((task) => {
      if (task.doneAt) {
        return;
      }

      const taskIdentityKey = toHistoryTaskIdentityKey(
        task.id,
        task.recurringId,
      );
      const previousTask = nearestPendingTaskMap.get(taskIdentityKey);
      const currentDateKey = toPendingTaskDateKey({ source, task });
      const previousDateKey = previousTask
        ? toPendingTaskDateKey(previousTask)
        : null;

      if (
        !previousTask ||
        (previousDateKey && currentDateKey < previousDateKey) ||
        (previousDateKey === currentDateKey &&
          task.date.localeCompare(previousTask.task.date) < 0)
      ) {
        nearestPendingTaskMap.set(taskIdentityKey, { source, task });
      }
    });
  });

  return Array.from(nearestPendingTaskMap.values());
}

export function buildPendingHistoryDateSections(
  sources: readonly HistoryTaskListDetailSource[],
  activeTeamId: string | null,
) {
  const sections = collapsePendingSourcesByIdentity(
    sources,
    activeTeamId,
  ).reduce<Record<string, MyHistoryDateSection>>((sections, pendingSource) => {
    const sectionDateKey = toPendingTaskDateKey(pendingSource);
    const section = sections[sectionDateKey] ?? {
      date: sectionDateKey,
      groups: [],
      id: sectionDateKey,
    };
    const groupId = `${pendingSource.source.teamId}-${pendingSource.source.taskListId}`;
    const group = section.groups.find((item) => item.id === groupId);

    if (group) {
      group.tasks.push(toPendingHistoryTask(pendingSource));
    } else {
      section.groups.push({
        id: groupId,
        tasks: [toPendingHistoryTask(pendingSource)],
        teamName: pendingSource.source.teamName,
        title: pendingSource.source.taskListName,
      });
    }

    sections[sectionDateKey] = section;
    return sections;
  }, {});

  return Object.values(sections);
}
