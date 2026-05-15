/**
 * 리스트 페이지에서 사용하는 날짜 문자열 직렬화 유틸입니다.
 */

const DATE_PART_LENGTH = 2;
const KOREA_TIME_ZONE = 'Asia/Seoul';
const KOREA_UTC_OFFSET = 'Z';

type KoreaDateParts = {
  day: number;
  hours: number;
  minutes: number;
  month: number;
  seconds: number;
  year: number;
};

function getKoreaDateParts(date: Date): KoreaDateParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    timeZone: KOREA_TIME_ZONE,
    year: 'numeric',
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  ) as {
    day: number;
    hour: number;
    minute: number;
    month: number;
    second: number;
    year: number;
  };

  return {
    day: parts.day,
    hours: parts.hour,
    minutes: parts.minute,
    month: parts.month,
    seconds: parts.second,
    year: parts.year,
  };
}

function padDate(n: number) {
  return String(n).padStart(DATE_PART_LENGTH, '0');
}

function formatTimeParts(
  parts: Pick<KoreaDateParts, 'hours' | 'minutes' | 'seconds'>,
) {
  return `${padDate(parts.hours)}:${padDate(parts.minutes)}:${padDate(parts.seconds)}`;
}

/**
 * 오늘(한국 날짜 기준) Date를 반환합니다.
 */
export function getCurrentCalendarDate() {
  const p = getKoreaDateParts(new Date());
  return new Date(p.year, p.month - 1, p.day);
}

/**
 * 오늘 한국 날짜를 YYYY-MM-DD 문자열로 반환합니다.
 */
export function getCurrentDateString() {
  return toTaskListDateString(new Date());
}

/**
 * 현재 한국 시간을 HH:mm 문자열로 반환합니다.
 */
export function getCurrentTimeString() {
  const { hours, minutes } = getKoreaDateParts(new Date());
  return `${padDate(hours)}:${padDate(minutes)}`;
}

/**
 * Date를 한국 시간 기준 YYYY-MM-DD 문자열로 변환합니다.
 */
export function toTaskListDateString(date: Date) {
  const p = getKoreaDateParts(date);
  return `${p.year}-${padDate(p.month)}-${padDate(p.day)}`;
}

/**
 * Date를 한국 시간대 ISO 8601 문자열로 변환합니다.
 * 예: 2026-05-15T15:30:00+09:00
 */
export function toTaskListDateTimeString(date: Date) {
  const p = getKoreaDateParts(date);
  return `${p.year}-${padDate(p.month)}-${padDate(p.day)}T${formatTimeParts(p)}${KOREA_UTC_OFFSET}`;
}

/**
 * 백엔드 날짜 문자열에서 한국 시간 기준 YYYY-MM-DD를 추출합니다.
 */
export function toTaskListDateKey(dateString: string) {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString.slice(0, 10);
  }

  const p = getKoreaDateParts(parsedDate);
  return `${p.year}-${padDate(p.month)}-${padDate(p.day)}`;
}
