/**
 * 할 일 생성 모달의 반복 생성 payload를 만드는 유틸 파일입니다.
 */

import type { RecurringBody } from '@/api/types';
import type { TaskListCreateTaskRepeatValue } from '@/app/(service)/[teamid]/tasklist/types';

const HOUR_MINUTE_LENGTH = 2;

const FREQUENCY_MAP = {
  daily: 'DAILY',
  monthly: 'MONTHLY',
  once: 'ONCE',
  weekly: 'WEEKLY',
} as const satisfies Record<
  TaskListCreateTaskRepeatValue,
  RecurringBody['frequencyType']
>;

function parseTime(time: string) {
  const [hourValue, minuteValue] = time.split(':');

  return {
    hours: Number(hourValue),
    minutes: Number(minuteValue),
  };
}

function isValidTime(hours: number, minutes: number) {
  return (
    Number.isInteger(hours) &&
    Number.isInteger(minutes) &&
    hours >= 0 &&
    hours < 24 &&
    minutes >= 0 &&
    minutes < 60
  );
}

function formatDatePart(n: number) {
  return String(n).padStart(HOUR_MINUTE_LENGTH, '0');
}

export function buildTaskListStartDate(date: Date, time: string) {
  const { hours, minutes } = parseTime(time);

  const year = date.getFullYear();
  const month = formatDatePart(date.getMonth() + 1);
  const day = formatDatePart(date.getDate());

  if (isValidTime(hours, minutes)) {
    return `${year}-${month}-${day}T${time}:00+09:00`;
  }

  const fallbackTime = `${formatDatePart(date.getHours())}:${formatDatePart(date.getMinutes())}`;
  return `${year}-${month}-${day}T${fallbackTime}:00+09:00`;
}

type BuildTaskListRecurringBodyParams = {
  description: string;
  monthDay: number;
  repeat: TaskListCreateTaskRepeatValue;
  selectedDate: Date;
  startTime: string;
  title: string;
  weekDays: number[];
};

function getMonthDate(year: number, monthIndex: number, day: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return new Date(year, monthIndex, Math.min(day, daysInMonth));
}

function getNextWeeklyDate(selectedDate: Date, weekDays: number[]) {
  if (weekDays.length === 0) {
    return new Date(selectedDate);
  }

  const normalizedWeekDays = [...new Set(weekDays)]
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((firstDay, secondDay) => firstDay - secondDay);

  if (normalizedWeekDays.length === 0) {
    return new Date(selectedDate);
  }

  const normalizedSelectedDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  );

  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const candidateDate = new Date(normalizedSelectedDate);
    candidateDate.setDate(normalizedSelectedDate.getDate() + dayOffset);

    if (normalizedWeekDays.includes(candidateDate.getDay())) {
      return candidateDate;
    }
  }

  return normalizedSelectedDate;
}

export function resolveTaskListRecurringStartDate(
  repeat: TaskListCreateTaskRepeatValue,
  selectedDate: Date,
  monthDay: number,
  weekDays: number[] = [],
) {
  if (repeat === 'weekly') {
    return getNextWeeklyDate(selectedDate, weekDays);
  }

  if (repeat !== 'monthly') {
    return new Date(selectedDate);
  }

  const normalizedSelectedDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
  );
  const currentMonthDate = getMonthDate(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    monthDay,
  );

  if (currentMonthDate.getTime() >= normalizedSelectedDate.getTime()) {
    return currentMonthDate;
  }

  return getMonthDate(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    monthDay,
  );
}

export function buildTaskListRecurringBody({
  description,
  monthDay,
  repeat,
  selectedDate,
  startTime,
  title,
  weekDays,
}: BuildTaskListRecurringBodyParams): RecurringBody {
  const resolvedStartDate = resolveTaskListRecurringStartDate(
    repeat,
    selectedDate,
    monthDay,
    weekDays,
  );

  return {
    description,
    frequencyType: FREQUENCY_MAP[repeat],
    monthDay: repeat === 'monthly' ? monthDay : undefined,
    name: title,
    startDate: buildTaskListStartDate(resolvedStartDate, startTime),
    weekDays: repeat === 'weekly' && weekDays.length > 0 ? weekDays : undefined,
  };
}
