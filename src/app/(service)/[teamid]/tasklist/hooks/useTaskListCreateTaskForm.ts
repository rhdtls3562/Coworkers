'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';

import useTaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCalendarPopover';
import type { TaskListCreateTaskRepeatValue } from '@/app/(service)/[teamid]/tasklist/types';
import {
  clampTaskListMonthDay,
  DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskFormUtils';
import {
  getCurrentCalendarDate,
  getCurrentTimeString,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import useClickOutside from '@/hooks/useClickOutside';

export function useTaskListCreateTaskForm(initialSelectedDate: Date) {
  const formId = useId();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(
    () => new Date(initialSelectedDate),
  );
  const [startTime, setStartTime] = useState(() => getCurrentTimeString());
  const [repeat, setRepeat] = useState<TaskListCreateTaskRepeatValue>('once');
  const [weekDays, setWeekDays] = useState<number[]>([
    ...DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS,
  ]);
  const [monthDayInput, setMonthDayInput] = useState(() =>
    String(initialSelectedDate.getDate()),
  );
  const [memo, setMemo] = useState('');

  const {
    calendarButtonRef,
    calendarRef,
    closeCalendar,
    isCalendarOpen,
    toggleCalendar,
  } = useTaskListCalendarPopover();

  const timePopoverContainerRef = useRef<HTMLDivElement>(null);
  const timePopoverButtonRef = useRef<HTMLButtonElement>(null);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

  const closeTimePopover = useCallback(() => {
    setIsTimePopoverOpen(false);
  }, []);

  useClickOutside({
    onClickOutside: closeTimePopover,
    refs: [timePopoverContainerRef, timePopoverButtonRef],
  });

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (!date) return;
      setStartDate(date);
      closeCalendar();
    },
    [closeCalendar],
  );

  const toggleWeekDay = useCallback((dayIndex: number) => {
    setWeekDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort((a, b) => a - b),
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
    (value: TaskListCreateTaskRepeatValue) => {
      setRepeat(value);

      if (value === 'weekly' && weekDays.length === 0) {
        setWeekDays([...DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS]);
      }
    },
    [weekDays.length],
  );

  const handleOpenTime = useCallback(() => {
    if (isCalendarOpen) closeCalendar();
    setIsTimePopoverOpen((prev) => !prev);
  }, [isCalendarOpen, closeCalendar]);

  const handleOpenDateCalendar = useCallback(() => {
    setIsTimePopoverOpen(false);
    toggleCalendar();
  }, [toggleCalendar]);

  const selected = startDate ?? getCurrentCalendarDate();
  const monthDay = useMemo(
    () => clampTaskListMonthDay(Number(monthDayInput)),
    [monthDayInput],
  );

  return {
    calendarButtonRef,
    calendarRef,
    closeTimePopover,
    formId,
    handleDateChange,
    handleMonthDayBlur,
    handleMonthDayChange,
    handleOpenDateCalendar,
    handleOpenTime,
    handleRepeatChange,
    isCalendarOpen,
    isTimePopoverOpen,
    memo,
    monthDay,
    monthDayInput,
    repeat,
    selected,
    setMemo,
    setStartTime,
    setTitle,
    startTime,
    timePopoverButtonRef,
    timePopoverContainerRef,
    title,
    toggleWeekDay,
    weekDays,
  };
}
