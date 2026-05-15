/**
 * 오른쪽 패널 일정 수정 폼 훅의 반환 타입을 정의하는 파일입니다.
 */

import type { RefObject } from 'react';

import type { TaskDetailScheduleRepeatValue } from '@/components/common/rightPanel/types';

export type UseTaskDetailScheduleFormReturn = {
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
  timePopoverButtonRef: RefObject<HTMLButtonElement | null>;
  timePopoverContainerRef: RefObject<HTMLDivElement | null>;
  toggleWeekDay: (dayIndex: number) => void;
  weekDays: number[];
};
