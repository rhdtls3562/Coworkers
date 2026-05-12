'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import useTaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCalendarPopover';
import type { TaskListCreateTaskRepeatValue } from '@/app/(service)/[teamid]/tasklist/types';
import {
  getCurrentKoreaCalendarDate,
  getCurrentKoreaTimeString,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';

const DEFAULT_WEEKLY_REPEAT_DAYS = [1, 2, 3, 4, 5] as const;

export function clampMonthDay(n: number): number {
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > 31) return 31;
  return Math.floor(n);
}

export function useTaskListCreateTaskForm(initialSelectedDate: Date) {
  const formId = useId();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(
    () => new Date(initialSelectedDate),
  );
  const [startTime, setStartTime] = useState(() => getCurrentKoreaTimeString());
  const [repeat, setRepeat] = useState<TaskListCreateTaskRepeatValue>('once');
  const [weekDays, setWeekDays] = useState<number[]>([
    ...DEFAULT_WEEKLY_REPEAT_DAYS,
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

  const handleMonthDayChange = useCallback((value: string) => {
    if (!/^\d{0,2}$/.test(value)) {
      return;
    }

    setMonthDayInput(value);
  }, []);

  const handleMonthDayBlur = useCallback(() => {
    setMonthDayInput((previousValue) =>
      String(clampMonthDay(Number(previousValue))),
    );
  }, []);

  const handleRepeatChange = useCallback(
    (value: TaskListCreateTaskRepeatValue) => {
      setRepeat(value);

      if (value === 'weekly' && weekDays.length === 0) {
        setWeekDays([...DEFAULT_WEEKLY_REPEAT_DAYS]);
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

  const selected = startDate ?? getCurrentKoreaCalendarDate();
  const monthDay = useMemo(
    () => clampMonthDay(Number(monthDayInput)),
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
    timePopoverContainerRef,
    title,
    toggleWeekDay,
    weekDays,
  };
}
