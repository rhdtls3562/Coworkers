/**
 * 마이 히스토리 데이터 파싱 전반에서 공통으로 쓰는 기본 변환 유틸입니다.
 */

import type { HistoryTaskFrequency } from '@/app/(service)/myhistory/types';
import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleFrequencyType,
} from '@/components/common/rightPanel/types';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function toNumber(value: unknown) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  }

  return undefined;
}

export function toDateLabel(dateString?: string) {
  if (!dateString) {
    return '-';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatHistoryTaskFrequency(frequency?: HistoryTaskFrequency) {
  switch (frequency) {
    case 'DAILY':
      return '매일 반복';
    case 'MONTHLY':
      return '매월 반복';
    case 'ONCE':
      return '한 번만';
    case 'WEEKLY':
      return '매주 반복';
    case 'WORKDAY':
      return '평일 반복';
    default:
      return '반복 없음';
  }
}

function toTaskDetailScheduleFrequencyType(
  frequency?: HistoryTaskFrequency,
): TaskDetailScheduleFrequencyType | null {
  if (
    frequency === 'ONCE' ||
    frequency === 'DAILY' ||
    frequency === 'WEEKLY' ||
    frequency === 'MONTHLY'
  ) {
    return frequency;
  }

  return null;
}

export function toHistoryScheduleEditConfig({
  frequency,
  recurringId,
  startedAtRaw,
  weekDays,
}: {
  frequency?: HistoryTaskFrequency;
  recurringId?: number;
  startedAtRaw?: string;
  weekDays?: number[];
}) {
  const frequencyType = toTaskDetailScheduleFrequencyType(frequency);

  if (!frequencyType || !startedAtRaw) {
    return undefined;
  }

  return {
    frequencyType,
    recurringId:
      typeof recurringId === 'number' && recurringId > 0
        ? String(recurringId)
        : null,
    startedAtRaw,
    weekDays,
  } satisfies TaskDetailScheduleEditConfig;
}

export function toHistoryTaskIdentityKey(taskId: string, recurringId?: number) {
  if (typeof recurringId === 'number' && recurringId > 0) {
    return `recurring:${recurringId}`;
  }

  return `task:${taskId}`;
}
