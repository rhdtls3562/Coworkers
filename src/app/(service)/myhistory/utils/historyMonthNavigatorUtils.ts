/**
 * 마이 히스토리 월 네비게이터에서 사용하는 날짜 범위 보조 유틸 모음입니다.
 */

import type { MyHistoryDraftDateRange } from '@/app/(service)/myhistory/types';
import {
  getMonthEndDate,
  getMonthStartDate,
} from '@/app/(service)/myhistory/utils/formatHistoryDate';

export function createHistoryDraftRange(
  endDate: Date | null,
  startDate: Date | null,
): MyHistoryDraftDateRange {
  return {
    endDate,
    startDate,
  };
}

export function getHistoryRangeMonthLimit(
  draftRange: MyHistoryDraftDateRange,
  isSelectingEndDate: boolean,
) {
  if (!draftRange.startDate || !isSelectingEndDate) {
    return {};
  }

  return {
    maxDate: getMonthEndDate(draftRange.startDate),
    minDate: getMonthStartDate(draftRange.startDate),
  };
}
