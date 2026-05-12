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

export function getCurrentKoreaDate() {
  const currentKoreaDateParts = getKoreaDateParts(new Date());

  return new Date(
    currentKoreaDateParts.year,
    currentKoreaDateParts.month - 1,
    currentKoreaDateParts.day,
    currentKoreaDateParts.hours,
    currentKoreaDateParts.minutes,
    currentKoreaDateParts.seconds,
  );
}

export function getCurrentKoreaDateTimeString() {
  return toTaskListDateTimeString(getCurrentKoreaDate());
}

export function toTaskListDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(DATE_PART_LENGTH, '0'),
    String(date.getDate()).padStart(DATE_PART_LENGTH, '0'),
  ].join('-');
}

export function toTaskListTimeString(date: Date) {
  return `${String(date.getHours()).padStart(DATE_PART_LENGTH, '0')}:${String(date.getMinutes()).padStart(DATE_PART_LENGTH, '0')}`;
}

export function mergeTaskListDateWithTime(baseDate: Date, timeSource: Date) {
  const mergedDate = new Date(baseDate);

  mergedDate.setHours(
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds(),
    0,
  );

  return mergedDate;
}

export function toTaskListDateTimeString(date: Date) {
  return `${toTaskListDateString(date)}T${String(date.getHours()).padStart(DATE_PART_LENGTH, '0')}:${String(date.getMinutes()).padStart(DATE_PART_LENGTH, '0')}:${String(date.getSeconds()).padStart(DATE_PART_LENGTH, '0')}${KOREA_UTC_OFFSET}`;
}
