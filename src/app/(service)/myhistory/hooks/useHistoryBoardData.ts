'use client';

/**
 * 완료 이력과 팀/할 일 목록 상세 데이터를 조합해 보드 표시 데이터를 만드는 훅입니다.
 */

import { useMemo } from 'react';

import { MY_HISTORY_VIEW_MODES } from '@/app/(service)/myhistory/constants';
import useHistoryBoardBaseData from '@/app/(service)/myhistory/hooks/useHistoryBoardBaseData';
import useHistoryTaskListSources from '@/app/(service)/myhistory/hooks/useHistoryTaskListSources';
import useHistoryTeamDetails from '@/app/(service)/myhistory/hooks/useHistoryTeamDetails';
import useProgressiveHistoryDateKeys from '@/app/(service)/myhistory/hooks/useProgressiveHistoryDateKeys';
import type { UseHistoryBoardDataParams } from '@/app/(service)/myhistory/types';
import {
  buildHistoryDateSections,
  buildHistorySummaryData,
  buildPendingHistoryDateSections,
  getHistoryDateKeysFromRange,
  getTodayHistoryDateKey,
  getVisibleCompletedTasks,
} from '@/app/(service)/myhistory/utils/myHistoryData';

export default function useHistoryBoardData({
  activeFilterId,
  completedTasks,
  isAllRange,
  selectedRange,
  shouldLimitTeamQueries,
  viewMode,
}: UseHistoryBoardDataParams) {
  const {
    completedDateKeys,
    isMembershipsError,
    isMembershipsLoading,
    isMeError,
    isMeLoading,
    uniqueTeams,
  } = useHistoryBoardBaseData(completedTasks);
  const {
    isError: isTeamDetailsError,
    isLoading: isTeamDetailsLoading,
    teamDetails,
  } = useHistoryTeamDetails(uniqueTeams);
  const historyDateKeys = useMemo(() => {
    if (viewMode !== MY_HISTORY_VIEW_MODES.PENDING) {
      return completedDateKeys;
    }

    if (isAllRange) {
      return [getTodayHistoryDateKey()];
    }

    return getHistoryDateKeysFromRange(selectedRange);
  }, [completedDateKeys, isAllRange, selectedRange, viewMode]);
  const { isProgressivelyLoading, visibleDateKeys } =
    useProgressiveHistoryDateKeys(historyDateKeys, isAllRange);
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
  const visibleCompletedTasks = useMemo(
    () => getVisibleCompletedTasks(completedTasks, visibleDateKeys),
    [completedTasks, visibleDateKeys],
  );

  const historySections = useMemo(() => {
    if (viewMode === MY_HISTORY_VIEW_MODES.PENDING) {
      return buildPendingHistoryDateSections(taskListSources, activeFilterId);
    }

    return buildHistoryDateSections(
      visibleCompletedTasks,
      teamDetails,
      taskListSources,
      activeFilterId,
    );
  }, [
    activeFilterId,
    taskListSources,
    teamDetails,
    viewMode,
    visibleCompletedTasks,
  ]);

  const summaryData = useMemo(
    () =>
      buildHistorySummaryData(
        teamDetails,
        completedTasks,
        taskListSources,
        viewMode,
      ),
    [completedTasks, taskListSources, teamDetails, viewMode],
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
