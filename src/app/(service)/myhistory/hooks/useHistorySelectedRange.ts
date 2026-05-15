/**
 * 내 히스토리 화면의 선택된 날짜 범위 상태와 범위 변경 액션을 관리하는 훅입니다.
 */

import { useMemo, useState } from 'react';

import {
  MY_HISTORY_DATE_RANGE_MODES,
  MY_HISTORY_VIEW_MODES,
} from '@/app/(service)/myhistory/constants';
import type {
  MyHistoryDateRange,
  MyHistoryResolvedDateRange,
  UseHistorySelectedRangeParams,
} from '@/app/(service)/myhistory/types';
import {
  addMonths,
  createHistoryMonthRange,
  createHistoryMonthRangeFromToday,
  formatHistoryRangeTitle,
} from '@/app/(service)/myhistory/utils/formatHistoryDate';

export default function useHistorySelectedRange({
  defaultAnchorDate,
  viewMode,
}: UseHistorySelectedRangeParams) {
  const [selectedRangeOverride, setSelectedRangeOverride] =
    useState<MyHistoryDateRange | null>(null);
  const isDefaultCurrentMonthRange = selectedRangeOverride === null;
  const selectedRange = useMemo(() => {
    if (selectedRangeOverride) {
      return selectedRangeOverride;
    }

    if (viewMode === MY_HISTORY_VIEW_MODES.PENDING) {
      return createHistoryMonthRangeFromToday(defaultAnchorDate);
    }

    return createHistoryMonthRange(defaultAnchorDate);
  }, [defaultAnchorDate, selectedRangeOverride, viewMode]);
  const isAllRange = selectedRange.mode === MY_HISTORY_DATE_RANGE_MODES.ALL;

  const handleApplyRange = ({
    endDate,
    startDate,
  }: MyHistoryResolvedDateRange) => {
    setSelectedRangeOverride({
      endDate,
      mode: MY_HISTORY_DATE_RANGE_MODES.RANGE,
      startDate,
    });
  };

  const handleMoveMonth = (monthOffset: number) => {
    setSelectedRangeOverride((prevRange) =>
      createHistoryMonthRange(
        addMonths(prevRange?.startDate ?? defaultAnchorDate, monthOffset),
      ),
    );
  };

  const handleResetRange = () => {
    setSelectedRangeOverride(null);
  };

  return {
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    isAllRange,
    selectedRange,
    title: isDefaultCurrentMonthRange
      ? '이달의 전체'
      : formatHistoryRangeTitle(selectedRange),
  } as const;
}
