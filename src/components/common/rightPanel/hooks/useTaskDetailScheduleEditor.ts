'use client';

/**
 * 오른쪽 패널의 시작 날짜/반복 설정 수정 모달 상태와 mutation 흐름을 관리합니다.
 * 모달의 수정하기는 로컬 draft 상태만 업데이트하며,
 * 실제 API 호출은 commitScheduleEdit를 통해 패널 수정하기 시점에 이루어집니다.
 */
import { useState } from 'react';

import { buildTaskListRecurringBody } from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskPayload';
import usePendingScheduleEdit from '@/components/common/rightPanel/hooks/usePendingScheduleEdit';
import {
  createNextTaskDetailScheduleEditConfig,
  getTaskDetailScheduleDisplayValues,
  hasTaskDetailScheduleEditCapability,
} from '@/components/common/rightPanel/hooks/useTaskDetailScheduleEditor.utils';
import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleFormValues,
  UseTaskDetailScheduleEditorParams,
  UseTaskDetailScheduleEditorReturn,
} from '@/components/common/rightPanel/types';

export default function useTaskDetailScheduleEditor({
  currentDescription,
  currentTitle,
  initialFrequencyLabel,
  initialStartedAtLabel,
  onScheduleSaved,
  scheduleEditConfig,
  taskListId,
  teamId,
}: UseTaskDetailScheduleEditorParams): UseTaskDetailScheduleEditorReturn {
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

  const {
    commitScheduleEdit,
    hasPendingScheduleChanges,
    isScheduleSubmitting,
    setPendingFormValues,
  } = usePendingScheduleEdit({
    currentScheduleEditConfig,
    onScheduleSaved,
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
    isScheduleSubmitting,
    scheduleEditConfig: currentScheduleEditConfig,
  };
}
