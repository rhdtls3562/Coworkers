'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';

import useTaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCalendarPopover';
import type { TaskListCreateTaskRepeatValue } from '@/app/(service)/[teamid]/tasklist/types';
import {
  clampTaskListMonthDay,
  DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskFormUtils';
import { getNextWeeklyDate } from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskPayload';
import {
  getCurrentCalendarDate,
  getDefaultStartTimeString,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListDate';
import { useToast } from '@/components/common/toast';
import useClickOutside from '@/hooks/useClickOutside';

/**
 * 초기 날짜가 오늘 이전이면 오늘(한국 날짜 기준)로 대체합니다.
 * 페이지를 자정 전에 열어둔 상태에서 자정이 지나도 selectedDate가 갱신되지 않아
 * 할일 생성 시 전날 날짜가 들어가는 버그를 방지합니다.
 */
function clampToToday(date: Date): Date {
  const today = getCurrentCalendarDate();
  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  return normalizedDate >= today ? new Date(date) : today;
}

export function useTaskListCreateTaskForm(initialSelectedDate: Date) {
  const formId = useId();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(() =>
    clampToToday(initialSelectedDate),
  );
  const [startTime, setStartTime] = useState(() => getDefaultStartTimeString());
  const [repeat, setRepeat] = useState<TaskListCreateTaskRepeatValue>('once');
  const [weekDays, setWeekDays] = useState<number[]>([
    ...DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS,
  ]);
  const [monthDayInput, setMonthDayInput] = useState(() =>
    String(clampToToday(initialSelectedDate).getDate()),
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

  const toggleWeekDay = useCallback(
    (dayIndex: number) => {
      const newWeekDays = weekDays.includes(dayIndex)
        ? weekDays.filter((d) => d !== dayIndex)
        : [...weekDays, dayIndex].sort((a, b) => a - b);

      setWeekDays(newWeekDays);

      if (repeat !== 'weekly' || newWeekDays.length === 0) return;

      const currentDate = startDate ?? getCurrentCalendarDate();
      const nearestDate = getNextWeeklyDate(currentDate, newWeekDays);
      const isSameDay =
        nearestDate.getFullYear() === currentDate.getFullYear() &&
        nearestDate.getMonth() === currentDate.getMonth() &&
        nearestDate.getDate() === currentDate.getDate();

      if (!isSameDay) {
        setStartDate(nearestDate);
        showToast('해당 요일에 가까운 날짜로 변경되었습니다.', 'success');
      }
    },
    [repeat, startDate, weekDays, showToast],
  );

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
