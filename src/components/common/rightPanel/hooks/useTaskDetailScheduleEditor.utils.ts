/**
 * 오른쪽 패널 일정 수정 가능 여부와 저장 후 화면 반영값 생성을 돕는 유틸입니다.
 */

import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleFormValues,
  TaskDetailScheduleFrequencyType,
} from '@/components/common/rightPanel/types';
import {
  formatTaskDetailFrequency,
  formatTaskDetailStartedAt,
} from '@/components/common/rightPanel/utils/taskDetailSchedule';

const REPEAT_TO_FREQUENCY_TYPE = {
  daily: 'DAILY',
  monthly: 'MONTHLY',
  once: 'ONCE',
  weekly: 'WEEKLY',
} as const satisfies Record<
  TaskDetailScheduleFormValues['repeat'],
  TaskDetailScheduleFrequencyType
>;

export function hasTaskDetailScheduleEditCapability(
  scheduleEditConfig?: TaskDetailScheduleEditConfig,
) {
  return Boolean(
    scheduleEditConfig?.recurringId &&
    (scheduleEditConfig.frequencyType !== 'WEEKLY' ||
      (scheduleEditConfig.weekDays?.length ?? 0) > 0),
  );
}

export function createNextTaskDetailScheduleEditConfig(
  currentScheduleEditConfig: TaskDetailScheduleEditConfig,
  values: TaskDetailScheduleFormValues,
  startedAtRaw: string,
) {
  return {
    frequencyType: REPEAT_TO_FREQUENCY_TYPE[values.repeat],
    recurringId: currentScheduleEditConfig.recurringId,
    startedAtRaw,
    weekDays: values.repeat === 'weekly' ? values.weekDays : undefined,
  } satisfies TaskDetailScheduleEditConfig;
}

export function getTaskDetailScheduleDisplayValues(
  scheduleEditConfig: TaskDetailScheduleEditConfig,
) {
  return {
    frequency: formatTaskDetailFrequency(scheduleEditConfig),
    startedAt: formatTaskDetailStartedAt(scheduleEditConfig.startedAtRaw),
  };
}
