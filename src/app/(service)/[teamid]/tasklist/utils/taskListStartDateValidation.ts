/**
 * 할 일 생성 시 시작 시각이 현재 한국 시간보다 이전인지 검증하는 유틸입니다.
 */

import { getCurrentKoreaDateTimeString } from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';

function toMinuteKey(dateTimeString: string) {
  return dateTimeString.slice(0, 16);
}

export function isPastTaskListStartDate(startDateTimeString: string) {
  return (
    toMinuteKey(startDateTimeString) <
    toMinuteKey(getCurrentKoreaDateTimeString())
  );
}
