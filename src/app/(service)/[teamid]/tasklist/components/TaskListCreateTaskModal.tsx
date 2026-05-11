/**
 * 플로팅 버튼으로 열리는 할 일 만들기 모달입니다.
 */

'use client';

import { createRecurring } from '@/api/taskApi';
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
import { useToast } from '@/components/common/toast';
import { cn } from '@/utils/cn';

export default function TaskListCreateTaskModal({
  onClose,
  onSubmit,
  groupId,
  taskListId,
}: TaskListCreateTaskModalProps) {
  const { showToast } = useToast();

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

  const isDisabled = title.trim().length === 0;

  const handleCreate = async () => {
    if (isDisabled) return;

    if (repeat === 'weekly' && weekDays.length === 0) {
      showToast('반복 요일을 선택해주세요.', 'error');
      return;
    }

    const frequencyMap = {
      once: 'ONCE',
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
    } as const;

    const body = {
      name: title.trim(),
      description: memo.trim(),
      startDate: selected.toISOString(),
      frequencyType: frequencyMap[repeat],
      ...(repeat === 'weekly' ? { weekDays } : {}),
      ...(repeat === 'monthly' ? { monthDay } : {}),
    };

    try {
      await createRecurring(String(groupId), taskListId, body);
      await onSubmit?.();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '할 일 생성 중 오류가 발생했습니다.';

      showToast(message, 'error');
    }
  };

  return (
    <Modal
      onClose={onClose}
      title="할 일 만들기"
      description={
        '할 일은 실제로 행동 가능한 작업 중심으로\n작성해주시면 좋습니다.'
      }
      primaryButtonText="만들기"
      isPrimaryButtonDisabled={isDisabled}
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
