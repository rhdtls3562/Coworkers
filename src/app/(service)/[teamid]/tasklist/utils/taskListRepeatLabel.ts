/**
 * 할 일 반복 라벨을 화면 표시용 문자열로 변환하는 유틸입니다.
 */

import { TASKLIST_WEEKDAY_LABELS } from '@/app/(service)/[teamid]/tasklist/utils/boardDate';
import type { Task } from '@/types/task';

const DEFAULT_WEEKLY_REPEAT_DAYS = [1, 2, 3, 4, 5] as const;

function normalizeWeekDays(weekDays?: number[]) {
  return (weekDays ?? [])
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((firstDay, secondDay) => firstDay - secondDay);
}

function isDefaultWeeklyRepeatDays(weekDays: readonly number[]) {
  return (
    weekDays.length === DEFAULT_WEEKLY_REPEAT_DAYS.length &&
    weekDays.every((day, index) => day === DEFAULT_WEEKLY_REPEAT_DAYS[index])
  );
}

export function formatTaskListRepeatLabel(
  frequency: Task['frequency'],
  weekDays?: number[],
) {
  if (frequency === 'ONCE') {
    return '당일 반복';
  }

  if (frequency === 'DAILY') {
    return '매일 반복';
  }

  if (frequency === 'MONTHLY') {
    return '매월 반복';
  }

  const normalizedWeekDays = normalizeWeekDays(weekDays);

  if (normalizedWeekDays.length === 0) {
    return '매주 반복';
  }

  if (isDefaultWeeklyRepeatDays(normalizedWeekDays)) {
    return '매주 반복';
  }

  return `${normalizedWeekDays
    .map((day) => TASKLIST_WEEKDAY_LABELS[day])
    .join(',')} 반복`;
}
