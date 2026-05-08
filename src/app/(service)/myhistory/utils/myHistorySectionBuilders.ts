/**
 * 완료 이력을 날짜별, 주제별 히스토리 섹션 구조로 조합하는 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  MyHistoryCompletedTaskRecord,
} from '@/app/(service)/myhistory/types';
import { buildHistoryDateSectionMap } from '@/app/(service)/myhistory/utils/myHistorySectionBuilderUtils';
import { filterHistoryTasksByActiveTeam } from '@/app/(service)/myhistory/utils/myHistorySectionFilterUtils';
import { sortHistoryTasksByDisplayOrder } from '@/app/(service)/myhistory/utils/myHistorySectionSortUtils';
import { getTaskMetaMap } from '@/app/(service)/myhistory/utils/myHistorySectionUtils';

export function buildHistoryDateSections(
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
  sources: readonly HistoryTaskListDetailSource[],
  activeTeamId: string | null,
) {
  const taskMetaMap = getTaskMetaMap(sources);
  const teamVisibleTasks = filterHistoryTasksByActiveTeam(
    completedTasks,
    activeTeamId,
    taskMetaMap,
  );
  const sortedTasks = sortHistoryTasksByDisplayOrder(
    teamVisibleTasks,
    taskMetaMap,
  );
  const sectionsByDate = buildHistoryDateSectionMap(sortedTasks, taskMetaMap);

  return Object.values(sectionsByDate);
}
