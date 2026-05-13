/**
 * 빈 보드 플레이스홀더에서 사용하는 날짜 표시 유틸입니다.
 */

export function formatTaskListBoardPlaceholderDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}. ${month}. ${day}`;
}
