'use client';

/**
 * 완료 이력과 팀/할 일 목록 상세 데이터를 조합해 보드 표시 데이터를 만드는 훅입니다.
 */

import { useMemo } from 'react';

import useHistoryBoardBaseData from '@/app/(service)/myhistory/hooks/useHistoryBoardBaseData';
import useHistoryTaskListSources from '@/app/(service)/myhistory/hooks/useHistoryTaskListSources';
import useHistoryTeamDetails from '@/app/(service)/myhistory/hooks/useHistoryTeamDetails';
import useProgressiveHistoryDateKeys from '@/app/(service)/myhistory/hooks/useProgressiveHistoryDateKeys';
import type { UseHistoryBoardDataParams } from '@/app/(service)/myhistory/types';
import {
  buildHistoryDateSections,
  buildHistorySummaryData,
} from '@/app/(service)/myhistory/utils/myHistoryData';

export default function useHistoryBoardData({
  activeFilterId,
  completedTasks,
  isAllRange,
  shouldLimitTeamQueries,
}: UseHistoryBoardDataParams) {
  const {
    completedDateKeys,
    currentUserId,
    isMembershipsError,
    isMembershipsLoading,
    isMeError,
    isMeLoading,
    uniqueTeams,
  } = useHistoryBoardBaseData(completedTasks);
  const { isProgressivelyLoading, visibleDateKeys } =
    useProgressiveHistoryDateKeys(completedDateKeys, isAllRange);
  const {
    isError: isTeamDetailsError,
    isLoading: isTeamDetailsLoading,
    teamDetails,
  } = useHistoryTeamDetails(uniqueTeams);
  const {
    isError: isTaskListSourcesError,
    isLoading: isTaskListSourcesLoading,
    taskListSources,
  } = useHistoryTaskListSources({
    activeFilterId,
    shouldLimitTeamQueries,
    teamDetails,
    visibleDateKeys,
  });

  const historySections = useMemo(
    () =>
      buildHistoryDateSections(completedTasks, taskListSources, activeFilterId),
    [activeFilterId, completedTasks, taskListSources],
  );

  const summaryData = useMemo(
    () => buildHistorySummaryData(currentUserId, teamDetails, taskListSources),
    [currentUserId, taskListSources, teamDetails],
  );

  return {
    filters: summaryData.filters,
    historySections,
    isError:
      isMeError ||
      isMembershipsError ||
      isTeamDetailsError ||
      isTaskListSourcesError,
    isLoading:
      isMeLoading ||
      isMembershipsLoading ||
      isTeamDetailsLoading ||
      isTaskListSourcesLoading,
    isProgressivelyLoading,
    summaryItems: summaryData.items,
  } as const;
}
