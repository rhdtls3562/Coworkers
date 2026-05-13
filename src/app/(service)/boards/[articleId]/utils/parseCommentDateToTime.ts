/**
 * 댓글 `createdAt` 등 API 날짜 문자열을 정렬용 epoch(ms)로 변환합니다.
 * 파싱 실패 시 0을 반환합니다.
 */
export function parseCommentDateToTime(value: string): number {
  const normalizedValue = value.replace(/\./g, '-');
  const time = new Date(normalizedValue).getTime();

  return Number.isNaN(time) ? 0 : time;
}
