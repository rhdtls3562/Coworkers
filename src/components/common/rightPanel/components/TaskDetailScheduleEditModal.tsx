/**
 * 오른쪽 패널에서 시작 날짜와 반복 설정만 수정하는 전용 모달입니다.
 */

'use client';

import TaskListCreateTaskModalDateTimeSection from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModalDateTimeSection';
import TaskListCreateTaskModalRepeatSection from '@/app/(service)/[teamid]/tasklist/components/TaskListCreateTaskModalRepeatSection';
import Modal from '@/components/common/modal';
import useTaskDetailScheduleForm from '@/components/common/rightPanel/hooks/useTaskDetailScheduleForm';
import type { TaskDetailScheduleEditModalProps } from '@/components/common/rightPanel/types';

export default function TaskDetailScheduleEditModal({
  initialSchedule,
  isSubmitting,
  onClose,
  onSubmit,
}: TaskDetailScheduleEditModalProps) {
  const {
    calendarButtonRef,
    calendarRef,
    handleDateChange,
    handleMonthDayBlur,
    handleMonthDayChange,
    handleOpenDateCalendar,
    handleOpenTime,
    handleRepeatChange,
    hasScheduleChanges,
    isCalendarOpen,
    isTimePopoverOpen,
    monthDay,
    monthDayInput,
    repeat,
    selectedDate,
    setStartTime,
    startTime,
    timePopoverButtonRef,
    timePopoverContainerRef,
    toggleWeekDay,
    weekDays,
  } = useTaskDetailScheduleForm(initialSchedule);

  const handleSubmit = async () => {
    await onSubmit({
      monthDay,
      repeat,
      selectedDate,
      startTime,
      weekDays,
    });
  };

  return (
    <Modal
      bodyClassName="mt-6"
      description={'시작 날짜와 반복 설정을\n수정할 수 있습니다.'}
      isPrimaryButtonDisabled={isSubmitting || !hasScheduleChanges}
      onClose={onClose}
      onPrimaryButtonClick={handleSubmit}
      primaryButtonText="수정하기"
      title="할 일 수정"
    >
      <div className="flex w-full min-w-0 flex-col gap-8 text-left">
        <TaskListCreateTaskModalDateTimeSection
          calendarButtonRef={calendarButtonRef}
          calendarRef={calendarRef}
          formId="task-detail-schedule-edit"
          isCalendarOpen={isCalendarOpen}
          isTimePopoverOpen={isTimePopoverOpen}
          onDateChange={handleDateChange}
          onOpenDateCalendar={handleOpenDateCalendar}
          onOpenTime={handleOpenTime}
          onStartTimeChange={setStartTime}
          selectedDate={selectedDate}
          startTime={startTime}
          timePopoverButtonRef={timePopoverButtonRef}
          timePopoverContainerRef={timePopoverContainerRef}
        />

        <TaskListCreateTaskModalRepeatSection
          formId="task-detail-schedule-edit"
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
