/**
 * 할 일 만들기 모달의 반복 설정과 추가 반복 옵션을 렌더링합니다.
 */

import TaskListRepeatWeekdayPicker from '@/app/(service)/[teamid]/tasklist/components/TaskListRepeatWeekdayPicker';
import TaskListSelectDropdown from '@/app/(service)/[teamid]/tasklist/components/TaskListSelectDropdown';
import {
  CREATE_TASK_MODAL_COLUMN_CLASS,
  MODAL_HEADING_TYPO,
  REPEAT_DROPDOWN_BUTTON_CLASS,
  REPEAT_TRIGGER_LAYOUT_CLASS,
  TASK_LIST_CREATE_TASK_REPEAT_ITEMS,
} from '@/app/(service)/[teamid]/tasklist/constants/createTaskModalConstants';
import type {
  TaskListCreateTaskModalRepeatSectionProps,
  TaskListCreateTaskRepeatValue,
} from '@/app/(service)/[teamid]/tasklist/types';
import Input from '@/components/common/form/components/Input';
import { cn } from '@/utils/cn';

export default function TaskListCreateTaskModalRepeatSection({
  formId,
  monthDay,
  onMonthDayBlur,
  onMonthDayChange,
  onRepeatChange,
  onToggleWeekDay,
  repeat,
  weekDays,
}: TaskListCreateTaskModalRepeatSectionProps) {
  return (
    <div className={cn('flex flex-col gap-4', CREATE_TASK_MODAL_COLUMN_CLASS)}>
      <p
        id={`${formId}-repeat-heading`}
        className={cn(MODAL_HEADING_TYPO, 'text-left')}
      >
        반복 설정
      </p>
      <div
        className="flex flex-col gap-4"
        role="group"
        aria-labelledby={`${formId}-repeat-heading`}
      >
        <TaskListSelectDropdown<TaskListCreateTaskRepeatValue>
          items={TASK_LIST_CREATE_TASK_REPEAT_ITEMS}
          value={repeat}
          onChange={onRepeatChange}
          placeholder="선택"
          className={REPEAT_TRIGGER_LAYOUT_CLASS}
          buttonClassName={REPEAT_DROPDOWN_BUTTON_CLASS}
          variant="inlineExpand"
        />

        {repeat === 'weekly' ? (
          <div className="flex flex-col gap-2">
            <p
              id={`${formId}-weekday-heading`}
              className={cn(MODAL_HEADING_TYPO, 'text-left')}
            >
              반복 요일
            </p>
            <div aria-labelledby={`${formId}-weekday-heading`}>
              <TaskListRepeatWeekdayPicker
                selectedDays={weekDays}
                onToggleDay={onToggleWeekDay}
              />
            </div>
          </div>
        ) : null}

        {repeat === 'monthly' ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${formId}-monthday`}
              className={cn(MODAL_HEADING_TYPO, 'text-left')}
            >
              매월 반복 일
            </label>
            <Input
              id={`${formId}-monthday`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={monthDay}
              onChange={(e) => onMonthDayChange(e.target.value)}
              onBlur={onMonthDayBlur}
              className="max-w-30"
              aria-label="매월 반복할 날짜 1~31"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
