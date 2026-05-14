/**
 * 할 일 생성 시 시작 시각이 현재 한국 시간보다 이전인지 검증하는 유틸입니다.
 */

import {
  getCurrentKoreaDateString,
  getCurrentKoreaTimeString,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';

function toComparableMinuteString(dateTimeString: string) {
  const matchedDateTime = dateTimeString.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/,
  );

  if (!matchedDateTime) {
    return null;
  }

  const [, date, hours, minutes] = matchedDateTime;

  return `${date}T${hours}:${minutes}`;
}

export function isPastTaskListStartDate(startDateTimeString: string) {
  const comparableStartDateTime = toComparableMinuteString(startDateTimeString);

  if (!comparableStartDateTime) {
    return false;
  }

  const currentKoreaMinute = `${getCurrentKoreaDateString()}T${getCurrentKoreaTimeString()}`;

  return comparableStartDateTime < currentKoreaMinute;
}
