/**
 * 오른쪽 패널 일정 수정 폼의 초기값과 변경 여부 계산을 담당하는 유틸입니다.
 */

import {
  clampTaskListMonthDay,
  DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskFormUtils';
import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleRepeatValue,
} from '@/components/common/rightPanel/types';
import {
  toTaskDetailScheduleDate,
  toTaskDetailScheduleMonthDay,
  toTaskDetailScheduleRepeatValue,
  toTaskDetailScheduleTime,
} from '@/components/common/rightPanel/utils/taskDetailSchedule';

export type TaskDetailScheduleFormInitialValues = {
  monthDay: number;
  repeat: TaskDetailScheduleRepeatValue;
  selectedDate: Date;
  startTime: string;
  weekDays: number[];
};

type HasTaskDetailScheduleChangesParams = {
  initialValues: TaskDetailScheduleFormInitialValues;
  monthDayInput: string;
  repeat: TaskDetailScheduleRepeatValue;
  selectedDate: Date;
  startTime: string;
  weekDays: number[];
};

export function getTaskDetailScheduleFormInitialValues(
  initialSchedule: TaskDetailScheduleEditConfig,
): TaskDetailScheduleFormInitialValues {
  return {
    monthDay: toTaskDetailScheduleMonthDay(initialSchedule.startedAtRaw),
    repeat: toTaskDetailScheduleRepeatValue(initialSchedule.frequencyType),
    selectedDate: toTaskDetailScheduleDate(initialSchedule.startedAtRaw),
    startTime: toTaskDetailScheduleTime(initialSchedule.startedAtRaw),
    weekDays: initialSchedule.weekDays?.length
      ? [...initialSchedule.weekDays].sort(
          (firstDay, secondDay) => firstDay - secondDay,
        )
      : [...DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS],
  };
}

export function hasTaskDetailScheduleChanges({
  initialValues,
  monthDayInput,
  repeat,
  selectedDate,
  startTime,
  weekDays,
}: HasTaskDetailScheduleChangesParams) {
  return (
    selectedDate.getTime() !== initialValues.selectedDate.getTime() ||
    startTime !== initialValues.startTime ||
    repeat !== initialValues.repeat ||
    clampTaskListMonthDay(Number(monthDayInput)) !== initialValues.monthDay ||
    weekDays.join(',') !== initialValues.weekDays.join(',')
  );
}
