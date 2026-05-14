/**
 * 할 일 생성 시 시작 시각이 현재 한국 시간보다 이전인지 검증하는 유틸입니다.
 */

function toMinuteTimestamp(dateTimeString: string) {
  const parsedTime = new Date(dateTimeString).getTime();

  if (Number.isNaN(parsedTime)) {
    return Number.NaN;
  }

  return Math.floor(parsedTime / (60 * 1000));
}

export function isPastTaskListStartDate(startDateTimeString: string) {
  const startMinuteTimestamp = toMinuteTimestamp(startDateTimeString);

  if (Number.isNaN(startMinuteTimestamp)) {
    return false;
  }

  return startMinuteTimestamp < Math.floor(Date.now() / (60 * 1000));
}
