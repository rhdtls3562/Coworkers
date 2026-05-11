'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import useTaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCalendarPopover';
import type { TaskListCreateTaskRepeatValue } from '@/app/(service)/[teamid]/tasklist/types';

export function clampMonthDay(n: number): number {
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > 31) return 31;
  return Math.floor(n);
}

export function useTaskListCreateTaskForm(initialDate?: Date) {
  const formId = useId();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(
    () => initialDate ?? new Date(),
  );
  const [startTime, setStartTime] = useState('15:30');
  const [repeat, setRepeat] = useState<TaskListCreateTaskRepeatValue>('once');
  const [weekDays, setWeekDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [monthDay, setMonthDay] = useState(0);
  const [memo, setMemo] = useState('');

  const {
    calendarButtonRef,
    calendarRef,
    closeCalendar,
    isCalendarOpen,
    toggleCalendar,
  } = useTaskListCalendarPopover();

  const timePopoverContainerRef = useRef<HTMLDivElement>(null);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

  const closeTimePopover = useCallback(() => {
    setIsTimePopoverOpen(false);
  }, []);

  useEffect(() => {
    if (!isTimePopoverOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        timePopoverContainerRef.current &&
        !timePopoverContainerRef.current.contains(event.target as Node)
      ) {
        setIsTimePopoverOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isTimePopoverOpen]);

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

  const handleOpenTime = useCallback(() => {
    if (isCalendarOpen) closeCalendar();
    setIsTimePopoverOpen((prev) => !prev);
  }, [isCalendarOpen, closeCalendar]);

  const handleOpenDateCalendar = useCallback(() => {
    setIsTimePopoverOpen(false);
    toggleCalendar();
  }, [toggleCalendar]);

  const selected = startDate ?? new Date();

  return {
    calendarButtonRef,
    calendarRef,
    closeTimePopover,
    formId,
    handleDateChange,
    handleOpenDateCalendar,
    handleOpenTime,
    isCalendarOpen,
    isTimePopoverOpen,
    memo,
    monthDay,
    repeat,
    selected,
    setMemo,
    setMonthDay,
    setRepeat,
    setStartDate,
    setStartTime,
    setTitle,
    startTime,
    timePopoverContainerRef,
    title,
    toggleWeekDay,
    weekDays,
  };
}
