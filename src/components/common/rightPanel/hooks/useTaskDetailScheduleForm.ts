'use client';

/**
 * 오른쪽 패널 일정 수정 모달의 날짜/시간/반복 draft 상태를 관리합니다.
 */

import { useCallback, useMemo, useState } from 'react';

import useTaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCalendarPopover';
import {
  clampTaskListMonthDay,
  DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskFormUtils';
import type { UseTaskDetailScheduleFormReturn } from '@/components/common/rightPanel/hooks/useTaskDetailScheduleForm.types';
import {
  getTaskDetailScheduleFormInitialValues,
  hasTaskDetailScheduleChanges,
} from '@/components/common/rightPanel/hooks/useTaskDetailScheduleForm.utils';
import useTaskDetailTimePopover from '@/components/common/rightPanel/hooks/useTaskDetailTimePopover';
import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleRepeatValue,
} from '@/components/common/rightPanel/types';

export default function useTaskDetailScheduleForm(
  initialSchedule: TaskDetailScheduleEditConfig,
): UseTaskDetailScheduleFormReturn {
  const initialValues = useMemo(
    () => getTaskDetailScheduleFormInitialValues(initialSchedule),
    [initialSchedule],
  );

  const [selectedDate, setSelectedDate] = useState(initialValues.selectedDate);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [repeat, setRepeat] = useState<TaskDetailScheduleRepeatValue>(
    initialValues.repeat,
  );
  const [weekDays, setWeekDays] = useState<number[]>(initialValues.weekDays);
  const [monthDayInput, setMonthDayInput] = useState(
    String(initialValues.monthDay),
  );

  const {
    calendarButtonRef,
    calendarRef,
    closeCalendar,
    isCalendarOpen,
    toggleCalendar,
  } = useTaskListCalendarPopover();
  const {
    closeTimePopover,
    isTimePopoverOpen,
    timePopoverContainerRef,
    toggleTimePopover,
  } = useTaskDetailTimePopover();

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (!date) return;
      setSelectedDate(date);
      closeCalendar();
    },
    [closeCalendar],
  );

  const toggleWeekDay = useCallback((dayIndex: number) => {
    setWeekDays((previousWeekDays) =>
      previousWeekDays.includes(dayIndex)
        ? previousWeekDays.filter((day) => day !== dayIndex)
        : [...previousWeekDays, dayIndex].sort(
            (firstDay, secondDay) => firstDay - secondDay,
          ),
    );
  }, []);

  const handleMonthDayChange = useCallback((value: string) => {
    if (!/^\d{0,2}$/.test(value)) {
      return;
    }

    setMonthDayInput(value);
  }, []);

  const handleMonthDayBlur = useCallback(() => {
    setMonthDayInput((previousValue) =>
      String(clampTaskListMonthDay(Number(previousValue))),
    );
  }, []);

  const handleRepeatChange = useCallback(
    (value: TaskDetailScheduleRepeatValue) => {
      setRepeat(value);

      if (value === 'weekly' && weekDays.length === 0) {
        setWeekDays([...DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS]);
      }
    },
    [weekDays.length],
  );

  const handleOpenTime = useCallback(() => {
    if (isCalendarOpen) {
      closeCalendar();
    }

    toggleTimePopover();
  }, [closeCalendar, isCalendarOpen, toggleTimePopover]);

  const handleOpenDateCalendar = useCallback(() => {
    closeTimePopover();
    toggleCalendar();
  }, [closeTimePopover, toggleCalendar]);

  const monthDay = useMemo(
    () => clampTaskListMonthDay(Number(monthDayInput)),
    [monthDayInput],
  );
  const hasScheduleChanges = hasTaskDetailScheduleChanges({
    initialValues,
    monthDayInput,
    repeat,
    selectedDate,
    startTime,
    weekDays,
  });

  return {
    calendarButtonRef,
    calendarRef,
    handleDateChange,
    handleMonthDayBlur,
    handleMonthDayChange,
    handleOpenDateCalendar,
    handleOpenTime,
    handleRepeatChange,
    hasScheduleChanges,
    isCalendarOpen,
    isTimePopoverOpen,
    monthDay,
    monthDayInput,
    repeat,
    selectedDate,
    setStartTime,
    startTime,
    timePopoverContainerRef,
    toggleWeekDay,
    weekDays,
  };
}
