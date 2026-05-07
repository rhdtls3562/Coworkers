'use client';

/**
 * 내 히스토리 화면의 날짜 범위, 완료 이력, 보드 상태를 조합하는 훅입니다.
 */

import { useMemo, useState } from 'react';

import useHistoryBoardData from '@/app/(service)/myhistory/hooks/useHistoryBoardData';
import type {
  MyHistoryCompletedTaskRecord,
  MyHistoryDateRange,
  MyHistoryResolvedDateRange,
} from '@/app/(service)/myhistory/types';
import {
  addMonths,
  createHistoryAllRange,
  createHistoryMonthRange,
  formatHistoryRangeTitle,
} from '@/app/(service)/myhistory/utils/formatHistoryDate';
import {
  getHistorySectionsInRange,
  hasHistoryTasks,
} from '@/app/(service)/myhistory/utils/getHistorySections';
import {
  getCompletedTasksInRange,
  getLatestHistoryTaskDate,
  toCompletedTaskRecords,
} from '@/app/(service)/myhistory/utils/myHistoryData';
import { useCompletedTasksQuery } from '@/hooks/useUser';

export default function useHistoryBoard(activeFilterId: string | null) {
  const [selectedRangeOverride, setSelectedRangeOverride] =
    useState<MyHistoryDateRange | null>(null);
  const { data, isError, isLoading } = useCompletedTasksQuery();

  const completedTasks = useMemo<readonly MyHistoryCompletedTaskRecord[]>(
    () => toCompletedTaskRecords(data),
    [data],
  );
  const defaultAnchorDate = useMemo(
    () => getLatestHistoryTaskDate(completedTasks) ?? new Date(),
    [completedTasks],
  );
  const selectedRange = useMemo(() => {
    if (selectedRangeOverride) {
      return selectedRangeOverride;
    }
    return createHistoryAllRange(defaultAnchorDate);
  }, [defaultAnchorDate, selectedRangeOverride]);
  const completedTasksInRange = useMemo(
    () =>
      selectedRange.mode === 'all'
        ? completedTasks
        : getCompletedTasksInRange(completedTasks, selectedRange),
    [completedTasks, selectedRange],
  );
  const {
    filters,
    historySections,
    isError: isBoardDataError,
    isLoading: isBoardDataLoading,
    summaryItems,
  } = useHistoryBoardData({
    activeFilterId,
    completedTasks: completedTasksInRange,
    shouldLimitTeamQueries:
      activeFilterId !== null && selectedRange.mode === 'all',
  });
  const datedHistorySections = useMemo(
    () => getHistorySectionsInRange(historySections, selectedRange),
    [historySections, selectedRange],
  );

  const handleApplyRange = ({
    endDate,
    startDate,
  }: MyHistoryResolvedDateRange) => {
    setSelectedRangeOverride({
      endDate,
      mode: 'range',
      startDate,
    });
  };

  const handleMoveMonth = (monthOffset: number) => {
    setSelectedRangeOverride((prevRange) =>
      createHistoryMonthRange(
        addMonths(
          prevRange?.mode === 'all'
            ? defaultAnchorDate
            : (prevRange?.startDate ?? defaultAnchorDate),
          monthOffset,
        ),
      ),
    );
  };

  const handleResetRange = () => {
    setSelectedRangeOverride(null);
  };

  return {
    datedHistorySections,
    filters,
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    hasTasks: hasHistoryTasks(datedHistorySections),
    isError: isError || isBoardDataError,
    isLoading: isLoading || isBoardDataLoading,
    selectedRange,
    summaryItems,
    title: formatHistoryRangeTitle(selectedRange),
  } as const;
}
