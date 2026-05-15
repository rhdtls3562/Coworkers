/**
 * 할 일 만들기 모달 — 반복 요일(일~토 한 글자). 피그마 date picker-요일 스펙.
 */

'use client';

import type { TaskListRepeatWeekdayPickerProps } from '@/app/(service)/[teamid]/tasklist/types';
import {
  canRemoveWeekday,
  TASKLIST_WEEKDAY_LABELS,
} from '@/app/(service)/[teamid]/tasklist/utils/boardDate';
import { useToast } from '@/components/common/toast';
import { cn } from '@/utils/cn';

export default function TaskListRepeatWeekdayPicker({
  selectedDays,
  onToggleDay,
  className,
}: TaskListRepeatWeekdayPickerProps) {
  const { showToast } = useToast();

  const handleToggleDay = (dayIndex: number) => {
    if (!canRemoveWeekday(selectedDays, dayIndex)) {
      showToast('반복 요일이 1개 이상 있어야 합니다.', 'error');
      return;
    }
    onToggleDay(dayIndex);
  };

  return (
    <div
      className={cn(
        'mx-auto grid w-full min-w-0 max-w-full grid-cols-7 gap-2',
        className,
      )}
      role="group"
      aria-label="반복 요일"
    >
      {TASKLIST_WEEKDAY_LABELS.map((label, dayIndex) => {
        const isOn = selectedDays.includes(dayIndex);
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isOn}
            className={cn(
              'flex h-12 min-h-12 w-full min-w-0 items-center justify-center rounded-xl px-1 py-2 text-center text-sm font-medium transition-colors',
              isOn
                ? 'bg-brand-primary text-white'
                : 'border border-background-tertiary bg-background-primary text-text-primary hover:bg-background-secondary',
            )}
            onClick={() => handleToggleDay(dayIndex)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
