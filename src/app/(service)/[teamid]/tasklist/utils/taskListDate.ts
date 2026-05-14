/**
 * 리스트 페이지에서 사용하는 날짜 문자열 직렬화 유틸입니다.
 */

const DATE_PART_LENGTH = 2;
const KOREA_TIME_ZONE = 'Asia/Seoul';
const KOREA_UTC_OFFSET = '+09:00';

type KoreaDateParts = {
  day: number;
  hours: number;
  minutes: number;
  month: number;
  seconds: number;
  year: number;
};
type KoreaFormatterParts = {
  day: number;
  hour: number;
  minute: number;
  month: number;
  second: number;
  year: number;
};

type KoreaDateStringParts = {
  day: string;
  hour: string;
  minute: string;
  month: string;
  second: string;
  year: string;
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
  ) as KoreaFormatterParts;

  return {
    day: parts.day,
    hours: parts.hour,
    minutes: parts.minute,
    month: parts.month,
    seconds: parts.second,
    year: parts.year,
  };
}

function getKoreaDateStringParts(date: Date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      timeZone: KOREA_TIME_ZONE,
      year: 'numeric',
    })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as KoreaDateStringParts;
}

function formatTaskListDateParts(
  parts: Pick<KoreaDateParts, 'day' | 'month' | 'year'>,
) {
  return [
    parts.year,
    String(parts.month).padStart(DATE_PART_LENGTH, '0'),
    String(parts.day).padStart(DATE_PART_LENGTH, '0'),
  ].join('-');
}

function formatTaskListTimeParts(
  parts: Pick<KoreaDateParts, 'hours' | 'minutes' | 'seconds'>,
) {
  return `${String(parts.hours).padStart(DATE_PART_LENGTH, '0')}:${String(parts.minutes).padStart(DATE_PART_LENGTH, '0')}:${String(parts.seconds).padStart(DATE_PART_LENGTH, '0')}`;
}

/**
 * 달력 선택 상태에만 사용하는 "오늘(한국 날짜 기준)" Date입니다.
 * 절대 시각 비교 용도가 아니라 YYYY-MM-DD 캘린더 값을 맞추기 위한 값입니다.
 */
export function getCurrentKoreaCalendarDate() {
  const currentKoreaDateParts = getKoreaDateParts(new Date());
  return new Date(
    currentKoreaDateParts.year,
    currentKoreaDateParts.month - 1,
    currentKoreaDateParts.day,
  );
}

export function getCurrentKoreaDateString() {
  return formatTaskListDateParts(getKoreaDateParts(new Date()));
}

export function getCurrentKoreaTimeString() {
  const { hours, minutes } = getKoreaDateParts(new Date());
  return `${String(hours).padStart(DATE_PART_LENGTH, '0')}:${String(minutes).padStart(DATE_PART_LENGTH, '0')}`;
}

export function getCurrentKoreaDateTimeString() {
  const currentKoreaDateParts = getKoreaDateParts(new Date());
  return `${formatTaskListDateParts(currentKoreaDateParts)}T${formatTaskListTimeParts(currentKoreaDateParts)}${KOREA_UTC_OFFSET}`;
}

export function toTaskListDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(DATE_PART_LENGTH, '0'),
    String(date.getDate()).padStart(DATE_PART_LENGTH, '0'),
  ].join('-');
}

export function toTaskListDateTimeString(date: Date) {
  return `${toTaskListDateString(date)}T${formatTaskListTimeParts({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  })}${KOREA_UTC_OFFSET}`;
}

export function toTaskListKoreaDateKey(dateString: string) {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString.slice(0, 10);
  }

  const koreaDateParts = getKoreaDateStringParts(parsedDate);

  return `${koreaDateParts.year}-${koreaDateParts.month}-${koreaDateParts.day}`;
}
