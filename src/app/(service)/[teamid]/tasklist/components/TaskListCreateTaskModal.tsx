/**
 * 플로팅 버튼으로 열리는 할 일 만들기 모달입니다.
 */

'use client';

import TaskListCreateTaskModalDateTimeSection from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModalDateTimeSection';
import TaskListCreateTaskModalRepeatSection from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModalRepeatSection';
import TaskListCreateTaskModalTextFields from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModalTextFields';
import { useTaskListCreateTaskForm } from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCreateTaskForm';
import useTaskListCreateTaskMutation from '@/app/(service)/[teamid]/tasklist/hooks/useTaskListCreateTaskMutation';
import type { TaskListCreateTaskModalProps } from '@/app/(service)/[teamid]/tasklist/types';
import Modal from '@/components/common/modal';

export default function TaskListCreateTaskModal({
  initialSelectedDate,
  onClose,
  onSubmit,
  groupId,
  taskListId,
}: TaskListCreateTaskModalProps) {
  const {
    calendarButtonRef,
    calendarRef,
    formId,
    handleDateChange,
    handleMonthDayBlur,
    handleMonthDayChange,
    handleOpenDateCalendar,
    handleOpenTime,
    handleRepeatChange,
    isCalendarOpen,
    isTimePopoverOpen,
    memo,
    monthDay,
    monthDayInput,
    repeat,
    selected,
    setMemo,
    setStartTime,
    setTitle,
    startTime,
    timePopoverContainerRef,
    title,
    toggleWeekDay,
    weekDays,
  } = useTaskListCreateTaskForm(initialSelectedDate);

  const isDisabled = title.trim().length === 0;
  const { handleCreateTask } = useTaskListCreateTaskMutation({
    groupId,
    memo,
    monthDay,
    onClose,
    onSubmit,
    repeat,
    selectedDate: selected,
    startTime,
    taskListId,
    title,
    weekDays,
  });

  return (
    <Modal
      bodyClassName="mt-6"
      frameClassName="max-h-[calc(100dvh-2rem)]"
      mobilePosition="center"
      onClose={onClose}
      title="할 일 만들기"
      description={
        '할 일은 실제로 행동 가능한 작업 중심으로\n작성해주시면 좋습니다.'
      }
      primaryButtonText="만들기"
      isPrimaryButtonDisabled={isDisabled}
      onPrimaryButtonClick={handleCreateTask}
    >
      <div className="flex w-full min-w-0 flex-col gap-8 text-left">
        <TaskListCreateTaskModalTextFields
          formId={formId}
          memo={memo}
          onMemoChange={setMemo}
          onTitleChange={setTitle}
          title={title}
        />

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
          monthDay={monthDayInput}
          onMonthDayBlur={handleMonthDayBlur}
          onMonthDayChange={handleMonthDayChange}
          onRepeatChange={handleRepeatChange}
          onToggleWeekDay={toggleWeekDay}
          repeat={repeat}
          weekDays={weekDays}
        />
      </div>
    </Modal>
  );
}
