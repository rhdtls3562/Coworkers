/**
 * 할 일 만들기 모달의 시간 선택 팝오버입니다.
 */

import {
  DATE_TIME_TIME_POPOVER_COLUMN_CLASS,
  DATE_TIME_TIME_POPOVER_OPTION_ACTIVE_CLASS,
  DATE_TIME_TIME_POPOVER_OPTION_CLASS,
} from '@/app/(service)/[teamid]/tasklist/constants/createTaskModalConstants';
import {
  TASK_LIST_TIME_PICKER_HOURS,
  TASK_LIST_TIME_PICKER_MINUTES,
} from '@/app/(service)/[teamid]/tasklist/constants/taskListTimePopoverConstants';
import type { TaskListTimePopoverProps } from '@/app/(service)/[teamid]/tasklist/types';
import { getTaskListTimeParts } from '@/app/(service)/[teamid]/tasklist/utils/taskListTimePopover';
import { cn } from '@/utils/cn';

export default function TaskListTimePopover({
  formId,
  selectedTime,
  onSelectTime,
}: TaskListTimePopoverProps) {
  const { hour, minute } = getTaskListTimeParts(selectedTime);

  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="dialog"
      aria-label="시간 선택"
      tabIndex={-1}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-secondary">시</p>
        <div className={DATE_TIME_TIME_POPOVER_COLUMN_CLASS}>
          {TASK_LIST_TIME_PICKER_HOURS.map((optionHour) => (
            <button
              key={optionHour}
              type="button"
              className={cn(
                DATE_TIME_TIME_POPOVER_OPTION_CLASS,
                optionHour === hour &&
                  DATE_TIME_TIME_POPOVER_OPTION_ACTIVE_CLASS,
              )}
              onClick={() => onSelectTime(`${optionHour}:${minute}`)}
            >
              {optionHour}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-secondary">분</p>
        <div className={DATE_TIME_TIME_POPOVER_COLUMN_CLASS}>
          {TASK_LIST_TIME_PICKER_MINUTES.map((optionMinute) => (
            <button
              key={optionMinute}
              type="button"
              aria-controls={`${formId}-time-value`}
              className={cn(
                DATE_TIME_TIME_POPOVER_OPTION_CLASS,
                optionMinute === minute &&
                  DATE_TIME_TIME_POPOVER_OPTION_ACTIVE_CLASS,
              )}
              onClick={() => onSelectTime(`${hour}:${optionMinute}`)}
            >
              {optionMinute}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
