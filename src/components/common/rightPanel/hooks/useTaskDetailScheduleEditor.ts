'use client';

/**
 * 오른쪽 패널의 시작 날짜/반복 설정 수정 모달 상태와 mutation 흐름을 관리합니다.
 * 모달의 수정하기는 로컬 draft 상태만 업데이트하며,
 * 실제 API 호출은 commitScheduleEdit를 통해 패널 수정하기 시점에 이루어집니다.
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
  // 모달에서 확인했지만 아직 서버에 저장되지 않은 일정 폼 값
  const [pendingFormValues, setPendingFormValues] =
    useState<TaskDetailScheduleFormValues | null>(null);

  const updateRecurringMutation = useTaskDetailScheduleRecurringMutation({
    taskListId,
    teamId,
  });
  const hasScheduleEditCapability = hasTaskDetailScheduleEditCapability(
    currentScheduleEditConfig,
  );
  const hasPendingScheduleChanges = pendingFormValues !== null;

  const handleOpenScheduleEditModal = () => {
    if (!hasScheduleEditCapability) {
      return;
    }

    setIsScheduleEditModalOpen(true);
  };

  const handleCloseScheduleEditModal = () => {
    setIsScheduleEditModalOpen(false);
  };

  /**
   * 모달의 수정하기 클릭 시 호출됩니다.
   * API 호출 없이 로컬 표시 상태만 업데이트하고 폼 값을 보류 상태로 저장합니다.
   * 실제 저장은 패널의 수정하기 버튼 클릭 시 commitScheduleEdit에서 처리합니다.
   */
  const handleSubmitScheduleEdit = async (
    values: TaskDetailScheduleFormValues,
  ): Promise<boolean> => {
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
    setPendingFormValues(values);
    setIsScheduleEditModalOpen(false);
    return true;
  };

  /**
   * 패널의 수정하기 클릭 시 호출됩니다.
   * 보류 중인 일정 변경을 서버에 실제로 저장합니다.
   */
  const commitScheduleEdit = async (
    titleToSave: string,
    descriptionToSave: string,
  ): Promise<boolean> => {
    if (!pendingFormValues || !currentScheduleEditConfig?.recurringId) {
      return true;
    }

    const recurringBody = buildTaskListRecurringBody({
      description: descriptionToSave,
      monthDay: pendingFormValues.monthDay,
      repeat: pendingFormValues.repeat,
      selectedDate: pendingFormValues.selectedDate,
      startTime: pendingFormValues.startTime,
      title: titleToSave,
      weekDays: pendingFormValues.weekDays,
    });

    try {
      await updateRecurringMutation.mutateAsync({
        body: recurringBody,
        recurringId: currentScheduleEditConfig.recurringId,
        taskListId,
        teamId,
      });

      setPendingFormValues(null);
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '일정 수정에 실패했습니다.',
        'error',
      );
      return false;
    }
  };

  return {
    commitScheduleEdit,
    displayFrequency,
    displayStartedAt,
    displayStartTime,
    handleCloseScheduleEditModal,
    handleOpenScheduleEditModal,
    handleSubmitScheduleEdit,
    hasPendingScheduleChanges,
    hasScheduleEditCapability,
    isScheduleEditModalOpen,
    isScheduleSubmitting: updateRecurringMutation.isPending,
    scheduleEditConfig: currentScheduleEditConfig,
  };
}
