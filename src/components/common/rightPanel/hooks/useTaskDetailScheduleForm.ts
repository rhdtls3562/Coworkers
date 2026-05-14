'use client';

/**
 * 오른쪽 패널 일정 수정 모달의 날짜/시간/반복 draft 상태를 관리합니다.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';

import useTaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCalendarPopover';
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

type UseTaskDetailScheduleFormReturn = {
  calendarButtonRef: RefObject<HTMLDivElement | null>;
  calendarRef: RefObject<HTMLDivElement | null>;
  handleDateChange: (date: Date | null) => void;
  handleMonthDayBlur: () => void;
  handleMonthDayChange: (value: string) => void;
  handleOpenDateCalendar: () => void;
  handleOpenTime: () => void;
  handleRepeatChange: (value: TaskDetailScheduleRepeatValue) => void;
  hasScheduleChanges: boolean;
  isCalendarOpen: boolean;
  isTimePopoverOpen: boolean;
  monthDay: number;
  monthDayInput: string;
  repeat: TaskDetailScheduleRepeatValue;
  selectedDate: Date;
  setStartTime: (value: string) => void;
  startTime: string;
  timePopoverContainerRef: RefObject<HTMLDivElement | null>;
  toggleWeekDay: (dayIndex: number) => void;
  weekDays: number[];
};

export default function useTaskDetailScheduleForm(
  initialSchedule: TaskDetailScheduleEditConfig,
): UseTaskDetailScheduleFormReturn {
  const initialSelectedDate = useMemo(
    () => toTaskDetailScheduleDate(initialSchedule.startedAtRaw),
    [initialSchedule.startedAtRaw],
  );
  const initialStartTime = useMemo(
    () => toTaskDetailScheduleTime(initialSchedule.startedAtRaw),
    [initialSchedule.startedAtRaw],
  );
  const initialRepeat = useMemo(
    () => toTaskDetailScheduleRepeatValue(initialSchedule.frequencyType),
    [initialSchedule.frequencyType],
  );
  const initialWeekDays = useMemo(
    () =>
      initialSchedule.weekDays?.length
        ? [...initialSchedule.weekDays]
        : [...DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS],
    [initialSchedule.weekDays],
  );
  const initialMonthDay = useMemo(
    () => toTaskDetailScheduleMonthDay(initialSchedule.startedAtRaw),
    [initialSchedule.startedAtRaw],
  );

  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [repeat, setRepeat] =
    useState<TaskDetailScheduleRepeatValue>(initialRepeat);
  const [weekDays, setWeekDays] = useState<number[]>(initialWeekDays);
  const [monthDayInput, setMonthDayInput] = useState(String(initialMonthDay));

  const {
    calendarButtonRef,
    calendarRef,
    closeCalendar,
    isCalendarOpen,
    toggleCalendar,
  } = useTaskListCalendarPopover();

  const timePopoverContainerRef = useRef<HTMLDivElement>(null);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

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
    if (isCalendarOpen) closeCalendar();
    setIsTimePopoverOpen((previousValue) => !previousValue);
  }, [closeCalendar, isCalendarOpen]);

  const handleOpenDateCalendar = useCallback(() => {
    setIsTimePopoverOpen(false);
    toggleCalendar();
  }, [toggleCalendar]);

  const monthDay = useMemo(
    () => clampTaskListMonthDay(Number(monthDayInput)),
    [monthDayInput],
  );
  const hasScheduleChanges =
    selectedDate.getTime() !== initialSelectedDate.getTime() ||
    startTime !== initialStartTime ||
    repeat !== initialRepeat ||
    monthDay !== initialMonthDay ||
    weekDays.join(',') !== initialWeekDays.join(',');

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
