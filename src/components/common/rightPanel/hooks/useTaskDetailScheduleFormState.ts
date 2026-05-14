/**
 * 오른쪽 패널 일정 수정 폼의 draft 값과 입력 핸들러를 관리하는 훅입니다.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  clampTaskListMonthDay,
  DEFAULT_TASK_LIST_WEEKLY_REPEAT_DAYS,
} from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskFormUtils';
import type { TaskDetailScheduleFormInitialValues } from '@/components/common/rightPanel/hooks/useTaskDetailScheduleForm.utils';
import type { TaskDetailScheduleRepeatValue } from '@/components/common/rightPanel/types';

type UseTaskDetailScheduleFormStateReturn = {
  handleMonthDayBlur: () => void;
  handleMonthDayChange: (value: string) => void;
  handleRepeatChange: (value: TaskDetailScheduleRepeatValue) => void;
  monthDay: number;
  monthDayInput: string;
  repeat: TaskDetailScheduleRepeatValue;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setStartTime: (value: string) => void;
  startTime: string;
  toggleWeekDay: (dayIndex: number) => void;
  weekDays: number[];
};

export default function useTaskDetailScheduleFormState(
  initialValues: TaskDetailScheduleFormInitialValues,
): UseTaskDetailScheduleFormStateReturn {
  const [selectedDate, setSelectedDate] = useState(initialValues.selectedDate);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [repeat, setRepeat] = useState<TaskDetailScheduleRepeatValue>(
    initialValues.repeat,
  );
  const [weekDays, setWeekDays] = useState<number[]>(initialValues.weekDays);
  const [monthDayInput, setMonthDayInput] = useState(
    String(initialValues.monthDay),
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

  const monthDay = useMemo(
    () => clampTaskListMonthDay(Number(monthDayInput)),
    [monthDayInput],
  );

  return {
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
  };
}
