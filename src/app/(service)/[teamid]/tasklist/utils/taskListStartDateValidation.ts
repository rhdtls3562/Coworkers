/**
 * 할 일 생성 시 시작 시각이 현재 시간보다 이전인지 검증하는 유틸입니다.
 */

export function isPastTaskListStartDate(startDateTimeString: string) {
  const startDate = new Date(startDateTimeString);

  if (Number.isNaN(startDate.getTime())) {
    return false;
  }

  const now = new Date();
  const startMinute = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
  );
  const nowMinute = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
  );

  return startMinute.getTime() < nowMinute.getTime();
}
