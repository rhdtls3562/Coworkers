/**
 * 내 히스토리 화면의 선택된 날짜 범위 상태와 범위 변경 액션을 관리하는 훅입니다.
 */

'use client';

import { useMemo, useState } from 'react';

import { MY_HISTORY_DATE_RANGE_MODES } from '@/app/(service)/myhistory/constants';
import type {
  MyHistoryDateRange,
  MyHistoryResolvedDateRange,
} from '@/app/(service)/myhistory/types';
import {
  addMonths,
  createHistoryAllRange,
  createHistoryMonthRange,
  formatHistoryRangeTitle,
} from '@/app/(service)/myhistory/utils/formatHistoryDate';

type UseHistorySelectedRangeParams = {
  defaultAnchorDate: Date;
};

export default function useHistorySelectedRange({
  defaultAnchorDate,
}: UseHistorySelectedRangeParams) {
  const [selectedRangeOverride, setSelectedRangeOverride] =
    useState<MyHistoryDateRange | null>(null);
  const selectedRange = useMemo(() => {
    if (selectedRangeOverride) {
      return selectedRangeOverride;
    }

    return createHistoryAllRange(defaultAnchorDate);
  }, [defaultAnchorDate, selectedRangeOverride]);
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
        addMonths(
          prevRange?.mode === MY_HISTORY_DATE_RANGE_MODES.ALL
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
    handleApplyRange,
    handleMoveMonth,
    handleResetRange,
    isAllRange,
    selectedRange,
    title: formatHistoryRangeTitle(selectedRange),
  } as const;
}
