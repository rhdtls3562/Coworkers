/**
 * 화면 표시용 날짜 포맷 변환 유틸 함수 파일입니다.
 */

const KST_TIME_FORMAT = new Intl.DateTimeFormat('en-CA', {
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  timeZone: 'Asia/Seoul',
});

// YYYY-MM-DD 형식의 날짜 전용 문자열은 시각 없음으로 판단
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatKSTTime(dateString?: string): string | null {
  if (!dateString || DATE_ONLY_PATTERN.test(dateString)) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return KST_TIME_FORMAT.format(date);
}

/**
 * 24시간 이내: '방금 전' / 'n분 전' / 'n시간 전'
 * 24시간 초과: formatFallback이 있으면 그 결과, 없으면 'yyyy-mm-dd'
 */
export function formatRelativeTime(
  value: string | null,
  formatFallback?: (date: Date) => string,
): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMinutes < 1) return '방금 전';
  if (diffHours < 1) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;

  if (formatFallback) return formatFallback(date);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
