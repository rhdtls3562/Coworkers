/**
 * 오른쪽 패널 일정 수정에 필요한 날짜/반복 값 변환 유틸입니다.
 */

import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleFrequencyType,
  TaskDetailScheduleRepeatValue,
} from '@/components/common/rightPanel/types';

const DATE_PART_LENGTH = 2;
const KOREA_TIME_ZONE = 'Asia/Seoul';

const FREQUENCY_TYPE_TO_REPEAT = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
  ONCE: 'once',
  WEEKLY: 'weekly',
} as const satisfies Record<
  TaskDetailScheduleFrequencyType,
  TaskDetailScheduleRepeatValue
>;

type KoreaFormatterParts = {
  day: string;
  hour: string;
  minute: string;
  month: string;
  year: string;
};

function toKoreaFormatterParts(date: Date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      day: '2-digit',
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      month: '2-digit',
      timeZone: KOREA_TIME_ZONE,
      year: 'numeric',
    })
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as KoreaFormatterParts;
}

function parseTaskDetailDateString(dateString: string) {
  const matchedDate = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!matchedDate) {
    return null;
  }

  const [, year, month, day] = matchedDate;
  const matchedTime = dateString.match(/T(\d{2}):(\d{2})/);
  const hours = matchedTime ? Number(matchedTime[1]) : 0;
  const minutes = matchedTime ? Number(matchedTime[2]) : 0;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hours,
    minutes,
    0,
    0,
  );
}

export function toTaskDetailScheduleDate(dateString: string) {
  return parseTaskDetailDateString(dateString) ?? new Date();
}

export function toTaskDetailScheduleTime(dateString: string) {
  const parsedDate = toTaskDetailScheduleDate(dateString);

  return `${String(parsedDate.getHours()).padStart(DATE_PART_LENGTH, '0')}:${String(parsedDate.getMinutes()).padStart(DATE_PART_LENGTH, '0')}`;
}

export function toTaskDetailScheduleMonthDay(dateString: string) {
  const parsedDate = toTaskDetailScheduleDate(dateString);

  return parsedDate.getDate();
}

export function toTaskDetailScheduleRepeatValue(
  frequencyType: TaskDetailScheduleFrequencyType,
) {
  return FREQUENCY_TYPE_TO_REPEAT[frequencyType];
}

export function formatTaskDetailStartedAt(dateString: string) {
  const formattedParts = toKoreaFormatterParts(
    toTaskDetailScheduleDate(dateString),
  );

  return `${formattedParts.year}-${formattedParts.month}-${formattedParts.day} ${formattedParts.hour}:${formattedParts.minute}`;
}

export function formatTaskDetailFrequency(
  schedule: Pick<TaskDetailScheduleEditConfig, 'frequencyType' | 'weekDays'>,
) {
  if (schedule.frequencyType === 'ONCE') {
    return '당일 반복';
  }

  if (schedule.frequencyType === 'DAILY') {
    return '매일 반복';
  }

  if (schedule.frequencyType === 'MONTHLY') {
    return '매월 반복';
  }

  const normalizedWeekDays = [...new Set(schedule.weekDays ?? [])]
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((firstDay, secondDay) => firstDay - secondDay);

  if (normalizedWeekDays.length === 0) {
    return '매주 반복';
  }

  const defaultWeekDays = [1, 2, 3, 4, 5];

  if (
    normalizedWeekDays.length === defaultWeekDays.length &&
    normalizedWeekDays.every((day, index) => day === defaultWeekDays[index])
  ) {
    return '매주 반복';
  }

  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return `${normalizedWeekDays.map((day) => weekdayLabels[day]).join(',')} 반복`;
}
