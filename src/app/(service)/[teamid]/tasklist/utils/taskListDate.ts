/**
 * 리스트 페이지에서 사용하는 날짜 문자열 직렬화 유틸입니다.
 */

const DATE_PART_LENGTH = 2;

function padDate(n: number) {
  return String(n).padStart(DATE_PART_LENGTH, '0');
}

/**
 * 오늘 Date를 반환합니다.
 */
export function getCurrentCalendarDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 문자열로 반환합니다.
 */
export function getCurrentDateString() {
  return toTaskListDateString(new Date());
}

/**
 * 현재 시간을 HH:mm 문자열로 반환합니다.
 */
export function getCurrentTimeString() {
  const now = new Date();
  return `${padDate(now.getHours())}:${padDate(now.getMinutes())}`;
}

/**
 * 할 일 시작 시간의 기본값으로 사용할 현재 시간을 반환합니다.
 */
export function getDefaultStartTimeString() {
  const now = new Date();
  return `${padDate(now.getHours())}:${padDate(now.getMinutes())}`;
}

/**
 * Date를 YYYY-MM-DD 문자열로 변환합니다.
 */
export function toTaskListDateString(date: Date) {
  return `${date.getFullYear()}-${padDate(date.getMonth() + 1)}-${padDate(date.getDate())}`;
}

/**
 * 백엔드 날짜 문자열에서 YYYY-MM-DD를 추출합니다.
 */
export function toTaskListDateKey(dateString: string) {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString.slice(0, 10);
  }

  return `${parsedDate.getFullYear()}-${padDate(parsedDate.getMonth() + 1)}-${padDate(parsedDate.getDate())}`;
}
