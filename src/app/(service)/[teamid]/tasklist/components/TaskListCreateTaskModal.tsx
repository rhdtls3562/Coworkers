/**
 * 플로팅 버튼으로 열리는 할 일 만들기 모달입니다.
 * 공용 Modal의 children(폼 본문)과 하단 버튼 props를 사용합니다.
 * 상단 제목·안내 문구는 피그마 16/14에 맞추어 children에서 렌더합니다.
 * 치수는 Tailwind·픽셀 토큰(h-[75px] 메모 등)으로 맞춥니다.
 */

'use client';

import TaskListCreateTaskModalDateTimeSection from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModalDateTimeSection';
import TaskListCreateTaskModalRepeatSection from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModalRepeatSection';
import {
  CREATE_TASK_FIELD_SHELL_CLASS,
  CREATE_TASK_MEMO_INNER_WRAPPER_CLASS,
  CREATE_TASK_MEMO_SHELL_CLASS,
  CREATE_TASK_MEMO_TEXTAREA_CLASS,
  CREATE_TASK_MODAL_COLUMN_CLASS,
  CREATE_TASK_TITLE_INPUT_INNER_CLASS,
  MODAL_HEADING_TYPO,
} from '@/app/(service)/[teamid]/tasklist/createTaskModalConstants';
import {
  clampMonthDay,
  useTaskListCreateTaskForm,
} from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCreateTaskForm';
import type { TaskListCreateTaskModalProps } from '@/app/(service)/[teamid]/tasklist/types';
import Input from '@/components/common/form/components/Input';
import Modal from '@/components/common/modal';
import { cn } from '@/utils/cn';

export default function TaskListCreateTaskModal({
  onClose,
  onSubmit,
}: TaskListCreateTaskModalProps) {
  const {
    calendarButtonRef,
    calendarRef,
    formId,
    handleDateChange,
    handleOpenDateCalendar,
    handleOpenTime,
    isCalendarOpen,
    isTimePopoverOpen,
    memo,
    monthDay,
    repeat,
    selected,
    setMemo,
    setMonthDay,
    setRepeat,
    setStartTime,
    setTitle,
    startTime,
    timePopoverContainerRef,
    title,
    toggleWeekDay,
    weekDays,
  } = useTaskListCreateTaskForm();

  const handleCreate = () => {
    onSubmit?.();
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      title="할 일 만들기"
      description={
        '할 일은 실제로 행동 가능한 작업 중심으로\n작성해주시면 좋습니다.'
      }
      primaryButtonText="만들기"
      onPrimaryButtonClick={handleCreate}
    >
      <div className="flex w-full min-w-0 flex-col gap-8 text-left">
        <div
          className={cn('flex flex-col gap-4', CREATE_TASK_MODAL_COLUMN_CLASS)}
        >
          <label
            htmlFor={`${formId}-title`}
            className={cn(MODAL_HEADING_TYPO, 'text-left')}
          >
            할 일 제목
          </label>
          <div className={CREATE_TASK_FIELD_SHELL_CLASS}>
            <Input
              id={`${formId}-title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="할 일 제목을 입력해주세요."
              className={CREATE_TASK_TITLE_INPUT_INNER_CLASS}
            />
          </div>
        </div>

        <TaskListCreateTaskModalDateTimeSection
          calendarButtonRef={calendarButtonRef}
          calendarRef={calendarRef}
          formId={formId}
          isCalendarOpen={isCalendarOpen}
          isTimePopoverOpen={isTimePopoverOpen}
          onDateChange={handleDateChange}
          onOpenDateCalendar={handleOpenDateCalendar}
          onOpenTime={handleOpenTime}
          selectedDate={selected}
          startTime={startTime}
          timePopoverContainerRef={timePopoverContainerRef}
          onStartTimeChange={setStartTime}
        />

        <TaskListCreateTaskModalRepeatSection
          formId={formId}
          monthDay={monthDay}
          onMonthDayBlur={() => setMonthDay((d) => clampMonthDay(d))}
          onMonthDayChange={setMonthDay}
          onRepeatChange={setRepeat}
          onToggleWeekDay={toggleWeekDay}
          repeat={repeat}
          weekDays={weekDays}
        />

        <div
          className={cn('flex flex-col gap-4', CREATE_TASK_MODAL_COLUMN_CLASS)}
        >
          <label
            htmlFor={`${formId}-memo`}
            className={cn(MODAL_HEADING_TYPO, 'text-left')}
          >
            할 일 메모
          </label>
          <div className={CREATE_TASK_MEMO_SHELL_CLASS}>
            <div className={CREATE_TASK_MEMO_INNER_WRAPPER_CLASS}>
              <textarea
                id={`${formId}-memo`}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요."
                autoComplete="off"
                className={CREATE_TASK_MEMO_TEXTAREA_CLASS}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
