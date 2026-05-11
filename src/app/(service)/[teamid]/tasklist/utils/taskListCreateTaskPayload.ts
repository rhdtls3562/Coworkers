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

export function buildTaskListStartDate(date: Date, time: string) {
  const { hours, minutes } = parseTime(time);
  const nextDate = new Date(date);

  if (isValidTime(hours, minutes)) {
    nextDate.setHours(hours, minutes, 0, 0);
    return nextDate.toISOString();
  }

  const fallbackTime = `${String(nextDate.getHours()).padStart(
    HOUR_MINUTE_LENGTH,
    '0',
  )}:${String(nextDate.getMinutes()).padStart(HOUR_MINUTE_LENGTH, '0')}`;

  return buildTaskListStartDate(nextDate, fallbackTime);
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

export function buildTaskListRecurringBody({
  description,
  monthDay,
  repeat,
  selectedDate,
  startTime,
  title,
  weekDays,
}: BuildTaskListRecurringBodyParams): RecurringBody {
  return {
    description,
    frequencyType: FREQUENCY_MAP[repeat],
    monthDay: repeat === 'monthly' ? monthDay : undefined,
    name: title,
    startDate: buildTaskListStartDate(selectedDate, startTime),
    weekDays: repeat === 'weekly' ? weekDays : undefined,
  };
}
