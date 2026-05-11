/**
 * 리스트 페이지의 선택 날짜를 API query 문자열로 직렬화하는 유틸입니다.
 */

export function toTaskListDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
