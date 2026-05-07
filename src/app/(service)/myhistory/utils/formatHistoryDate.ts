/**
 * 마이 히스토리 날짜 범위 생성과 표시 문자열 포맷을 담당하는 유틸입니다.
 */

import type { MyHistoryDateRange } from '@/app/(service)/myhistory/types';
export {
  addDays,
  addMonths,
  getMonthEndDate,
  getMonthStartDate,
  isDateWithinHistoryRange,
  isSameHistoryMonth,
  normalizeHistoryDateRange,
  parseHistoryDateKey,
} from '@/app/(service)/myhistory/utils/historyDateRange';
import {
  getMonthEndDate,
  getMonthStartDate,
  isSameHistoryMonth,
} from '@/app/(service)/myhistory/utils/historyDateRange';

const WEEK_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const MONTH_PAD_LENGTH = 2;
const DAY_PAD_LENGTH = 2;

function padMonth(month: number) {
  return String(month).padStart(MONTH_PAD_LENGTH, '0');
}

function padDay(day: number) {
  return String(day).padStart(DAY_PAD_LENGTH, '0');
}

export function createHistoryMonthRange(
  date: Date,
  mode: MyHistoryDateRange['mode'] = 'month',
): MyHistoryDateRange {
  return {
    endDate: getMonthEndDate(date),
    mode,
    startDate: getMonthStartDate(date),
  };
}

export function createHistoryAllRange(date: Date): MyHistoryDateRange {
  return {
    endDate: date,
    mode: 'all',
    startDate: date,
  };
}

export function formatHistoryMonth(date: Date) {
  return `${date.getFullYear()}.${padMonth(date.getMonth() + 1)}`;
}

export function formatHistoryShortDate(date: Date) {
  return `${date.getFullYear()}.${padMonth(date.getMonth() + 1)}.${padDay(date.getDate())}`;
}

function isFullHistoryMonthRange(range: MyHistoryDateRange) {
  return (
    isSameHistoryMonth(range.startDate, range.endDate) &&
    range.startDate.getDate() === 1 &&
    range.endDate.getTime() === getMonthEndDate(range.startDate).getTime()
  );
}

function isSameHistoryDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function getHistoryRangeTitleParts(range: MyHistoryDateRange) {
  if (range.mode === 'all') {
    return ['전체'] as const;
  }

  if (range.mode === 'month' || isFullHistoryMonthRange(range)) {
    return [formatHistoryMonth(range.startDate)] as const;
  }

  if (isSameHistoryDay(range.startDate, range.endDate)) {
    return [formatHistoryShortDate(range.startDate)] as const;
  }

  return [
    formatHistoryShortDate(range.startDate),
    formatHistoryShortDate(range.endDate),
  ] as const;
}

export function formatHistoryRangeTitle(range: MyHistoryDateRange) {
  return getHistoryRangeTitleParts(range).join(' - ');
}

export function formatHistoryDate(date: Date) {
  const weekDay = WEEK_DAY_LABELS[date.getDay()];

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekDay})`;
}
