/**
 * 리스트 페이지에서 사용하는 날짜 문자열 직렬화 유틸입니다.
 */

const DATE_PART_LENGTH = 2;

export function toTaskListDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(DATE_PART_LENGTH, '0'),
    String(date.getDate()).padStart(DATE_PART_LENGTH, '0'),
  ].join('-');
}

export function toTaskListDateTimeString(date: Date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);

  return `${toTaskListDateString(date)}T${String(date.getHours()).padStart(DATE_PART_LENGTH, '0')}:${String(date.getMinutes()).padStart(DATE_PART_LENGTH, '0')}:${String(date.getSeconds()).padStart(DATE_PART_LENGTH, '0')}${offsetSign}${String(Math.floor(absoluteOffsetMinutes / 60)).padStart(DATE_PART_LENGTH, '0')}:${String(absoluteOffsetMinutes % 60).padStart(DATE_PART_LENGTH, '0')}`;
}
