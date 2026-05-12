/**
 * 내 히스토리 화면의 완료 이력 조회와 보드 표시 상태를 조합하는 훅입니다.
 */

import { useMemo } from 'react';

import { MY_HISTORY_EMPTY_STATE_BY_VIEW_MODE } from '@/app/(service)/myhistory/constants';
import useHistoryBoardData from '@/app/(service)/myhistory/hooks/useHistoryBoardData';
import useHistorySelectedRange from '@/app/(service)/myhistory/hooks/useHistorySelectedRange';
import type {
  MyHistoryCompletedTaskRecord,
  MyHistoryViewMode,
} from '@/app/(service)/myhistory/types';
import {
  buildVisibleHistorySections,
  hasHistoryTasks,
} from '@/app/(service)/myhistory/utils/getHistorySections';
import {
  getCompletedTasksInRange,
  getLatestHistoryTaskDate,
  toCompletedTaskRecords,
} from '@/app/(service)/myhistory/utils/myHistoryData';
import { useCompletedTasksQuery } from '@/hooks/useUser';

export default function useHistoryBoardQuery(
  activeFilterId: string | null,
  viewMode: MyHistoryViewMode,
) {
  const { data, isError, isLoading } = useCompletedTasksQuery();

  const completedTasks = useMemo<readonly MyHistoryCompletedTaskRecord[]>(
    () => toCompletedTaskRecords(data),
    [data],
  );
  const defaultAnchorDate = useMemo(
    () => getLatestHistoryTaskDate(completedTasks) ?? new Date(),
    [completedTasks],
  );
  const {
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    isAllRange,
    selectedRange,
    title,
  } = useHistorySelectedRange({
    defaultAnchorDate,
  });
  const completedTasksInRange = useMemo(
    () =>
      isAllRange
        ? completedTasks
        : getCompletedTasksInRange(completedTasks, selectedRange),
    [completedTasks, isAllRange, selectedRange],
  );
  const {
    filters,
    historySections,
    isError: isBoardDataError,
    isLoading: isBoardDataLoading,
    isProgressivelyLoading,
    summaryItems,
  } = useHistoryBoardData({
    activeFilterId,
    completedTasks: completedTasksInRange,
    isAllRange,
    selectedRange,
    shouldLimitTeamQueries: activeFilterId !== null && isAllRange,
    viewMode,
  });
  const datedHistorySections = useMemo(
    () => buildVisibleHistorySections(historySections, selectedRange),
    [historySections, selectedRange],
  );
  const emptyState = MY_HISTORY_EMPTY_STATE_BY_VIEW_MODE[viewMode];

  return {
    datedHistorySections,
    emptyDescription: emptyState.description,
    emptyTitle: emptyState.title,
    filters,
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    hasTasks: hasHistoryTasks(datedHistorySections),
    isError: isError || isBoardDataError,
    isLoading: isLoading || isBoardDataLoading,
    isProgressivelyLoading,
    selectedRange,
    summaryItems,
    title,
  } as const;
}
