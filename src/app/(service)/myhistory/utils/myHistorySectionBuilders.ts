/**
 * 완료 이력을 날짜별, 주제별 히스토리 섹션 구조로 만드는 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  MyHistoryCompletedTaskRecord,
  MyHistoryDateSection,
} from '@/app/(service)/myhistory/types';
import {
  getTaskMetaMap,
  toHistoryTask,
} from '@/app/(service)/myhistory/utils/myHistorySectionUtils';
import {
  toSectionDateKey,
  toTaskDate,
} from '@/app/(service)/myhistory/utils/myHistoryTaskDateHelpers';

export function getHistorySections(
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
  sources: readonly HistoryTaskListDetailSource[],
  activeTeamId: string | null,
) {
  const taskMetaMap = getTaskMetaMap(sources);
  const visibleTasks = completedTasks
    .filter((task) => {
      if (!activeTeamId) {
        return true;
      }

      const taskId =
        typeof task.id === 'number' || typeof task.id === 'string'
          ? String(task.id)
          : null;

      return taskId ? taskMetaMap.get(taskId)?.teamId === activeTeamId : false;
    })
    .sort((firstTask, secondTask) => {
      const firstDate = toTaskDate(firstTask)?.getTime() ?? 0;
      const secondDate = toTaskDate(secondTask)?.getTime() ?? 0;

      if (firstDate !== secondDate) {
        return firstDate - secondDate;
      }

      const firstMeta = taskMetaMap.get(String(firstTask.id ?? ''));
      const secondMeta = taskMetaMap.get(String(secondTask.id ?? ''));

      if (
        (firstMeta?.taskListDisplayIndex ?? 0) !==
        (secondMeta?.taskListDisplayIndex ?? 0)
      ) {
        return (
          (firstMeta?.taskListDisplayIndex ?? 0) -
          (secondMeta?.taskListDisplayIndex ?? 0)
        );
      }

      return (firstTask.displayIndex ?? 0) - (secondTask.displayIndex ?? 0);
    });

  const sectionsByDate = visibleTasks.reduce<
    Record<string, MyHistoryDateSection>
  >((sections, task) => {
    const sectionDateKey = toSectionDateKey(task);

    if (!sectionDateKey) {
      return sections;
    }

    const section =
      sections[sectionDateKey] ??
      ({
        date: sectionDateKey,
        groups: [],
        id: sectionDateKey,
      } satisfies MyHistoryDateSection);
    const taskMeta = taskMetaMap.get(String(task.id ?? ''));
    const groupId = `${taskMeta?.teamId ?? 'unknown'}-${taskMeta?.taskListId ?? 'unknown'}`;
    const existingGroup = section.groups.find((group) => group.id === groupId);

    if (existingGroup) {
      existingGroup.tasks.push(toHistoryTask(task, taskMeta));
    } else {
      section.groups.push({
        id: groupId,
        tasks: [toHistoryTask(task, taskMeta)],
        teamName: taskMeta?.teamName ?? '',
        title: taskMeta?.taskListName ?? '완료',
      });
    }

    sections[sectionDateKey] = section;

    return sections;
  }, {});

  return Object.values(sectionsByDate);
}
