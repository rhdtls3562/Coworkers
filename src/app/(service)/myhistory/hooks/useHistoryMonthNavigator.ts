/**
 * 내 히스토리 월 네비게이터의 기간 선택과 월 이동 동작을 관리하는 훅입니다.
 */

import { useMemo, useState } from 'react';

import type {
  MyHistoryDraftDateRange,
  UseHistoryMonthNavigatorParams,
} from '@/app/(service)/myhistory/types';
import {
  getHistoryRangeTitleParts,
  normalizeHistoryDateRange,
} from '@/app/(service)/myhistory/utils/formatHistoryDate';
import {
  createHistoryDraftRange,
  getHistoryRangeMonthLimit,
} from '@/app/(service)/myhistory/utils/historyMonthNavigatorUtils';
import type { DatePickerRangeValue } from '@/components/common/form/types';

export default function useHistoryMonthNavigator({
  closeCalendar,
  isCalendarOpen,
  onApplyRange,
  onMoveMonth,
  selectedRange,
  toggleCalendar,
}: UseHistoryMonthNavigatorParams) {
  const [draftRange, setDraftRange] = useState<MyHistoryDraftDateRange>({
    endDate: selectedRange.endDate,
    startDate: selectedRange.startDate,
  });
  const isSelectingEndDate = Boolean(
    draftRange.startDate && !draftRange.endDate,
  );
  const titleParts = useMemo(
    () => getHistoryRangeTitleParts(selectedRange),
    [selectedRange],
  );
  const rangeMonthLimit = useMemo(
    () => getHistoryRangeMonthLimit(draftRange, isSelectingEndDate),
    [draftRange, isSelectingEndDate],
  );

  const handleRangeChange = (nextRange: DatePickerRangeValue) => {
    const [nextStartDate, nextEndDate] = nextRange;

    if (!nextStartDate) {
      setDraftRange(createHistoryDraftRange(null, null));
      return;
    }

    if (!nextEndDate) {
      setDraftRange(createHistoryDraftRange(null, nextStartDate));
      return;
    }

    const normalizedRange = normalizeHistoryDateRange(
      nextStartDate,
      nextEndDate,
    );

    setDraftRange(normalizedRange);
    onApplyRange(normalizedRange);
    closeCalendar();
  };

  const handleMoveMonth = (monthOffset: number) => {
    closeCalendar();
    onMoveMonth(monthOffset);
  };

  const syncDraftRangeWithSelectedRange = () => {
    setDraftRange(
      createHistoryDraftRange(selectedRange.endDate, selectedRange.startDate),
    );
  };

  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      syncDraftRangeWithSelectedRange();
    }

    toggleCalendar();
  };

  return {
    draftRange,
    handleMoveMonth,
    handleRangeChange,
    handleToggleCalendar,
    isRangeTitle: titleParts.length === 2,
    rangeMonthLimit,
    titleParts,
  } as const;
}
