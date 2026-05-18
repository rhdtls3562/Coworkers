/**
 * 할 일 만들기 모달의 날짜와 시간 선택 영역입니다.
 */

import TaskListCalendarPopover from '@/app/(service)/[teamid]/tasklist/components/TaskListCalendarPopover';
import TaskListTimePopover from '@/app/(service)/[teamid]/tasklist/components/TaskListTimePopover';
import {
  CREATE_TASK_MODAL_COLUMN_CLASS,
  DATE_TIME_TIME_COLUMN_CLASS,
  DATE_TIME_TIME_EXPAND_CLASS,
  DATE_TIME_TRIGGER_ACTIVE_CLASS,
  DATE_TIME_TRIGGER_CLASS,
  MODAL_HEADING_TYPO,
} from '@/app/(service)/[teamid]/tasklist/constants/createTaskModalConstants';
import type { TaskListCreateTaskModalDateTimeSectionProps } from '@/app/(service)/[teamid]/tasklist/types';
import { formatFullKoreanDate } from '@/app/(service)/[teamid]/tasklist/utils/boardDate';
import { cn } from '@/utils/cn';

export default function TaskListCreateTaskModalDateTimeSection({
  calendarButtonRef,
  calendarRef,
  formId,
  isCalendarOpen,
  isTimePopoverOpen,
  onDateChange,
  onOpenDateCalendar,
  onOpenTime,
  selectedDate,
  startTime,
  timePopoverContainerRef,
  onStartTimeChange,
}: TaskListCreateTaskModalDateTimeSectionProps) {
  return (
    <div className={cn('flex flex-col gap-4', CREATE_TASK_MODAL_COLUMN_CLASS)}>
      <p
        id={`${formId}-datetime-heading`}
        className={cn(MODAL_HEADING_TYPO, 'text-left')}
      >
        시작 날짜 및 시간
      </p>
      <div
        className="flex w-full min-w-0 flex-col gap-4"
        role="group"
        aria-labelledby={`${formId}-datetime-heading`}
      >
        <div
          ref={timePopoverContainerRef}
          className="flex w-full min-w-0 flex-col gap-4"
        >
          <div className="flex w-full min-w-0 flex-row flex-nowrap items-stretch gap-2">
            <div ref={calendarButtonRef} className="min-w-0 flex-1 basis-0">
              <button
                type="button"
                aria-label="날짜 선택"
                aria-haspopup="dialog"
                aria-expanded={isCalendarOpen}
                className={cn(
                  DATE_TIME_TRIGGER_CLASS,
                  'w-full min-w-0 truncate',
                  isCalendarOpen && DATE_TIME_TRIGGER_ACTIVE_CLASS,
                )}
                onClick={onOpenDateCalendar}
              >
                {formatFullKoreanDate(selectedDate)}
              </button>
            </div>
            <div className={DATE_TIME_TIME_COLUMN_CLASS}>
              <button
                type="button"
                id={`${formId}-time-value`}
                aria-label="시작 시간 선택"
                aria-expanded={isTimePopoverOpen}
                aria-haspopup="dialog"
                className={cn(
                  DATE_TIME_TRIGGER_CLASS,
                  'w-full min-w-0 cursor-pointer',
                  isTimePopoverOpen && DATE_TIME_TRIGGER_ACTIVE_CLASS,
                )}
                onClick={onOpenTime}
              >
                {startTime}
              </button>
            </div>
          </div>
          {isCalendarOpen ? (
            <TaskListCalendarPopover
              variant="inlineExpand"
              calendarRef={calendarRef}
              selectedDate={selectedDate}
              onSelectDate={onDateChange}
            />
          ) : null}

          {isTimePopoverOpen ? (
            <div
              className={DATE_TIME_TIME_EXPAND_CLASS}
              role="dialog"
              aria-label="시간 선택"
            >
              <TaskListTimePopover
                formId={formId}
                selectedTime={startTime}
                onSelectTime={onStartTimeChange}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
