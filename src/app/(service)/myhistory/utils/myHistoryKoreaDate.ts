/**
 * 마이 히스토리에서 서버 날짜 문자열을 한국 날짜 기준으로 다루기 위한 유틸입니다.
 */

import {
  getCurrentCalendarDate,
  getCurrentDateString,
  toTaskListDateKey,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import { parseHistoryDateKey } from '@/app/(service)/myhistory/utils/formatHistoryDate';

const HISTORY_DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toHistoryDateKey(dateString?: string | null) {
  if (!dateString) {
    return null;
  }

  if (HISTORY_DATE_KEY_PATTERN.test(dateString)) {
    return dateString;
  }

  return toTaskListDateKey(dateString);
}

export function toHistoryCalendarDate(dateString?: string | null) {
  const dateKey = toHistoryDateKey(dateString);

  return dateKey ? parseHistoryDateKey(dateKey) : null;
}

export function toHistoryDateLabel(dateString?: string | null) {
  const dateKey = toHistoryDateKey(dateString);

  if (!dateKey) {
    return '-';
  }

  const [year, month, day] = dateKey.split('-');

  return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`;
}

export function getCurrentHistoryCalendarDate() {
  return getCurrentCalendarDate();
}

export function getCurrentHistoryDateKey() {
  return getCurrentDateString();
}
