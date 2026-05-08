/**
 * 내 히스토리 왼쪽 요약 카드와 팀 필터 목록을 조합하는 유틸입니다.
 */

import type {
  HistoryTaskListDetailSource,
  HistoryTeamDetail,
} from '@/app/(service)/myhistory/types';
import {
  accumulateTeamSummariesFromTaskLists,
  buildHistoryTeamFilters,
  buildTeamSummaryCards,
} from '@/app/(service)/myhistory/utils/myHistorySummaryBuilderUtils';

export function buildHistorySummaryData(
  currentUserId: number | string | undefined,
  teamDetails: readonly HistoryTeamDetail[],
  sources: readonly HistoryTaskListDetailSource[],
) {
  const teamSummaryMap = accumulateTeamSummariesFromTaskLists(
    currentUserId,
    sources,
  );
  const items = buildTeamSummaryCards(teamDetails, teamSummaryMap);

  return {
    filters: buildHistoryTeamFilters(items),
    items,
  };
}
