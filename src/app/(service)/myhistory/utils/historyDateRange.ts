/**
 * 히스토리 날짜 비교와 월/기간 범위 계산에 사용하는 기본 유틸입니다.
 */

import type {
  MyHistoryDateRange,
  MyHistoryResolvedDateRange,
} from '@/app/(service)/myhistory/types';

export function parseHistoryDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);

  return new Date(year, month - 1, day);
}

export function addDays(date: Date, dayCount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + dayCount);

  return nextDate;
}

export function addMonths(date: Date, monthCount: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(date.getMonth() + monthCount);

  return nextDate;
}

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toEndOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

export function getMonthStartDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEndDate(date: Date) {
  return toEndOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function normalizeHistoryDateRange(
  startDate: Date,
  endDate: Date,
): MyHistoryResolvedDateRange {
  const normalizedStartDate = toStartOfDay(startDate);
  const normalizedEndDate = toEndOfDay(endDate);

  if (normalizedStartDate.getTime() <= normalizedEndDate.getTime()) {
    return {
      endDate: normalizedEndDate,
      startDate: normalizedStartDate,
    };
  }

  return {
    endDate: toEndOfDay(startDate),
    startDate: toStartOfDay(endDate),
  };
}

export function isSameHistoryMonth(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

export function isDateWithinHistoryRange(
  date: Date,
  range: MyHistoryResolvedDateRange | MyHistoryDateRange,
) {
  const time = date.getTime();
  const startTime = toStartOfDay(range.startDate).getTime();
  const endTime = toEndOfDay(range.endDate).getTime();

  return time >= startTime && time <= endTime;
}
