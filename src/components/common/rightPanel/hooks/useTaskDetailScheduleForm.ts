'use client';

/**
 * 오른쪽 패널 일정 수정 모달의 날짜/시간/반복 draft 상태를 관리합니다.
 */

import { useCallback, useMemo } from 'react';

import useTaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCalendarPopover';
import type { UseTaskDetailScheduleFormReturn } from '@/components/common/rightPanel/hooks/useTaskDetailScheduleForm.types';
import {
  getTaskDetailScheduleFormInitialValues,
  hasTaskDetailScheduleChanges,
} from '@/components/common/rightPanel/hooks/useTaskDetailScheduleForm.utils';
import useTaskDetailScheduleFormState from '@/components/common/rightPanel/hooks/useTaskDetailScheduleFormState';
import useTaskDetailTimePopover from '@/components/common/rightPanel/hooks/useTaskDetailTimePopover';
import type { TaskDetailScheduleEditConfig } from '@/components/common/rightPanel/types';

export default function useTaskDetailScheduleForm(
  initialSchedule: TaskDetailScheduleEditConfig,
): UseTaskDetailScheduleFormReturn {
  const initialValues = useMemo(
    () => getTaskDetailScheduleFormInitialValues(initialSchedule),
    [initialSchedule],
  );
  const {
    handleMonthDayBlur,
    handleMonthDayChange,
    handleRepeatChange,
    monthDay,
    monthDayInput,
    repeat,
    selectedDate,
    setSelectedDate,
    setStartTime,
    startTime,
    toggleWeekDay,
    weekDays,
  } = useTaskDetailScheduleFormState(initialValues);

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
    [closeCalendar, setSelectedDate],
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
