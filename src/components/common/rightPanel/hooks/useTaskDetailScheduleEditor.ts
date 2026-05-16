'use client';

/**
 * 오른쪽 패널의 시작 날짜/반복 설정 수정 모달 상태와 mutation 흐름을 관리합니다.
 */
import { useState } from 'react';

import { buildTaskListRecurringBody } from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskPayload';
import {
  createNextTaskDetailScheduleEditConfig,
  getTaskDetailScheduleDisplayValues,
  hasTaskDetailScheduleEditCapability,
} from '@/components/common/rightPanel/hooks/useTaskDetailScheduleEditor.utils';
import useTaskDetailScheduleRecurringMutation from '@/components/common/rightPanel/hooks/useTaskDetailScheduleRecurringMutation';
import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleFormValues,
  UseTaskDetailScheduleEditorParams,
  UseTaskDetailScheduleEditorReturn,
} from '@/components/common/rightPanel/types';
import { useToast } from '@/components/common/toast';

export default function useTaskDetailScheduleEditor({
  currentDescription,
  currentTitle,
  initialFrequencyLabel,
  initialStartedAtLabel,
  scheduleEditConfig,
  taskListId,
  teamId,
}: UseTaskDetailScheduleEditorParams): UseTaskDetailScheduleEditorReturn {
  const { showToast } = useToast();
  const [isScheduleEditModalOpen, setIsScheduleEditModalOpen] = useState(false);
  const [currentScheduleEditConfig, setCurrentScheduleEditConfig] = useState<
    TaskDetailScheduleEditConfig | undefined
  >(scheduleEditConfig);
  const [displayStartedAt, setDisplayStartedAt] = useState(
    initialStartedAtLabel,
  );
  const [displayFrequency, setDisplayFrequency] = useState(
    initialFrequencyLabel,
  );
  const [displayStartTime, setDisplayStartTime] = useState<string | null>(
    scheduleEditConfig
      ? getTaskDetailScheduleDisplayValues(scheduleEditConfig).startTime
      : null,
  );
  const updateRecurringMutation = useTaskDetailScheduleRecurringMutation({
    taskListId,
    teamId,
  });
  const hasScheduleEditCapability = hasTaskDetailScheduleEditCapability(
    currentScheduleEditConfig,
  );

  const handleOpenScheduleEditModal = () => {
    if (!hasScheduleEditCapability) {
      return;
    }

    setIsScheduleEditModalOpen(true);
  };

  const handleCloseScheduleEditModal = () => {
    setIsScheduleEditModalOpen(false);
  };

  const handleSubmitScheduleEdit = async (
    values: TaskDetailScheduleFormValues,
  ) => {
    if (!currentScheduleEditConfig?.recurringId) {
      return false;
    }

    const recurringBody = buildTaskListRecurringBody({
      description: currentDescription,
      monthDay: values.monthDay,
      repeat: values.repeat,
      selectedDate: values.selectedDate,
      startTime: values.startTime,
      title: currentTitle,
      weekDays: values.weekDays,
    });

    try {
      await updateRecurringMutation.mutateAsync({
        body: recurringBody,
        recurringId: currentScheduleEditConfig.recurringId,
        taskListId,
        teamId,
      });

      const nextScheduleEditConfig = createNextTaskDetailScheduleEditConfig(
        currentScheduleEditConfig,
        values,
        recurringBody.startDate,
      );
      const nextDisplayValues = getTaskDetailScheduleDisplayValues(
        nextScheduleEditConfig,
      );

      setCurrentScheduleEditConfig(nextScheduleEditConfig);
      setDisplayStartedAt(nextDisplayValues.startedAt);
      setDisplayFrequency(nextDisplayValues.frequency);
      setDisplayStartTime(nextDisplayValues.startTime);
      setIsScheduleEditModalOpen(false);
      showToast('할 일이 수정되었습니다.', 'success');
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '할 일 수정에 실패했습니다.',
        'error',
      );
      return false;
    }
  };

  return {
    displayFrequency,
    displayStartedAt,
    displayStartTime,
    handleCloseScheduleEditModal,
    handleOpenScheduleEditModal,
    handleSubmitScheduleEdit,
    hasScheduleEditCapability,
    isScheduleEditModalOpen,
    isScheduleSubmitting: updateRecurringMutation.isPending,
    scheduleEditConfig: currentScheduleEditConfig,
  };
}
