/**
 * 완료 이력을 날짜 섹션과 주제 그룹으로 묶는 유틸입니다.
 */

import type {
  HistoryTaskMeta,
  HistoryTaskMetaMap,
  MyHistoryCompletedTaskRecord,
  MyHistoryDateSection,
} from '@/app/(service)/myhistory/types';
import { toHistoryTask } from '@/app/(service)/myhistory/utils/myHistorySectionUtils';
import { toSectionDateKey } from '@/app/(service)/myhistory/utils/myHistoryTaskDateHelpers';

function createEmptyDateSection(sectionDateKey: string): MyHistoryDateSection {
  return {
    date: sectionDateKey,
    groups: [],
    id: sectionDateKey,
  };
}

function buildHistoryGroupId(taskMeta?: HistoryTaskMeta) {
  return `${taskMeta?.teamId ?? 'unknown'}-${taskMeta?.taskListId ?? 'unknown'}`;
}

export function buildHistoryDateSectionMap(
  tasks: readonly MyHistoryCompletedTaskRecord[],
  taskMetaMap: HistoryTaskMetaMap,
) {
  return tasks.reduce<Record<string, MyHistoryDateSection>>(
    (sections, task) => {
      const sectionDateKey = toSectionDateKey(task);

      if (!sectionDateKey) {
        return sections;
      }

      const section =
        sections[sectionDateKey] ?? createEmptyDateSection(sectionDateKey);
      const taskMeta = taskMetaMap.get(String(task.id ?? ''));
      const groupId = buildHistoryGroupId(taskMeta);
      const existingGroup = section.groups.find(
        (group) => group.id === groupId,
      );

      if (existingGroup) {
        existingGroup.tasks.push(toHistoryTask(task, taskMeta));
      } else {
        section.groups.push({
          id: groupId,
          tasks: [toHistoryTask(task, taskMeta)],
          teamName: taskMeta?.teamName ?? '',
          title: taskMeta?.taskListName ?? '',
        });
      }

      sections[sectionDateKey] = section;

      return sections;
    },
    {},
  );
}
