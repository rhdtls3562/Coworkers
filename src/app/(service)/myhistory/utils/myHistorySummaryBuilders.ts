/**
 * 내 히스토리 왼쪽 요약 카드와 팀 필터 목록을 조합하는 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  HistoryTeamDetail,
  MyHistoryCompletedTaskRecord,
  MyHistoryViewMode,
} from '@/app/(service)/myhistory/types';
import { getTaskMetaMap } from '@/app/(service)/myhistory/utils/myHistorySectionUtils';
import {
  buildCompletedTaskCountMap,
  buildHistoryTeamFilters,
} from '@/app/(service)/myhistory/utils/myHistorySummaryBuilderUtils';
import { buildTeamSummaryCards } from '@/app/(service)/myhistory/utils/myHistorySummaryItemBuilders';

export function buildHistorySummaryData(
  teamDetails: readonly HistoryTeamDetail[],
  completedTasks: readonly MyHistoryCompletedTaskRecord[],
  sources: readonly HistoryTaskListDetailSource[],
  viewMode: MyHistoryViewMode,
) {
  const taskMetaMap = getTaskMetaMap(teamDetails, sources);
  const completedTaskCountMap = buildCompletedTaskCountMap(
    completedTasks,
    taskMetaMap,
  );
  const items = buildTeamSummaryCards(
    teamDetails,
    completedTaskCountMap,
    sources,
    viewMode,
  );

  return {
    filters: buildHistoryTeamFilters(items),
    items,
  };
}
