/**
 * 할 일 보드에서 월 이동용 인라인 달력을 띄웁니다.
 */

import {
  TASK_LIST_CALENDAR_ANCHORED_WRAPPER_CLASS,
  TASK_LIST_CALENDAR_INLINE_EXPAND_WRAPPER_CLASS,
  TASK_LIST_CALENDAR_MODAL_OVERLAY_WRAPPER_CLASS,
  TASK_LIST_EXPAND_DATE_PICKER_CLASS,
} from '@/app/(service)/[teamid]/tasklist/constants/calendarPopoverConstants';
import type { TaskListCalendarPopoverProps } from '@/app/(service)/[teamid]/tasklist/types';
import { DatePicker } from '@/components/common/form';
import { cn } from '@/utils/cn';

export default function TaskListCalendarPopover({
  calendarRef,
  onSelectDate,
  selectedDate,
  variant = 'anchored',
}: TaskListCalendarPopoverProps) {
  const isAnchored = variant === 'anchored';
  const isInlineExpand = variant === 'inlineExpand';
  const isModalOverlay = variant === 'modalOverlay';
  const useExpandPicker = isInlineExpand || isModalOverlay;

  return (
    <div
      ref={calendarRef}
      role="dialog"
      aria-label="날짜 선택 달력"
      tabIndex={-1}
      className={cn(
        isAnchored && TASK_LIST_CALENDAR_ANCHORED_WRAPPER_CLASS,
        isInlineExpand && TASK_LIST_CALENDAR_INLINE_EXPAND_WRAPPER_CLASS,
        isModalOverlay && TASK_LIST_CALENDAR_MODAL_OVERLAY_WRAPPER_CLASS,
      )}
    >
      <DatePicker
        isInline
        selected={selectedDate}
        onChange={onSelectDate}
        className={cn(useExpandPicker && TASK_LIST_EXPAND_DATE_PICKER_CLASS)}
      />
    </div>
  );
}
