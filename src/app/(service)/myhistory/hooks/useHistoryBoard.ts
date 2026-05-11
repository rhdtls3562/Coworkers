'use client';

/**
 * 내 히스토리 화면의 완료 이력 조회와 보드 표시 상태를 조합하는 훅입니다.
 */

import { useMemo } from 'react';

import { MY_HISTORY_VIEW_MODES } from '@/app/(service)/myhistory/constants';
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

export default function useHistoryBoard(
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

  return {
    datedHistorySections,
    filters,
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    hasTasks: hasHistoryTasks(datedHistorySections),
    emptyDescription:
      viewMode === MY_HISTORY_VIEW_MODES.PENDING
        ? '일정을 확인하고 하나씩 완료해보세요!'
        : '하나씩 완료해가며 히스토리를 만들어보세요!',
    emptyTitle:
      viewMode === MY_HISTORY_VIEW_MODES.PENDING
        ? '아직 해야 할 작업이 없어요.'
        : '아직 완료된 작업이 없어요.',
    isError: isError || isBoardDataError,
    isLoading: isLoading || isBoardDataLoading,
    isProgressivelyLoading,
    selectedRange,
    summaryItems,
    title,
  } as const;
}
