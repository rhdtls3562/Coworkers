'use client';

/**
 * 모달에서 확인된 일정 폼 값을 보류 상태로 관리하고,
 * 패널 수정하기 시점에 서버에 저장하는 책임을 담당합니다.
 */

import { useState } from 'react';

import { buildTaskListRecurringBody } from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskPayload';
import useTaskDetailScheduleRecurringMutation from '@/components/common/rightPanel/hooks/useTaskDetailScheduleRecurringMutation';
import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleFormValues,
} from '@/components/common/rightPanel/types';
import { useToast } from '@/components/common/toast';

type UsePendingScheduleEditParams = {
  currentScheduleEditConfig?: TaskDetailScheduleEditConfig;
  onScheduleSaved?: (date: Date) => void;
  taskListId: string;
  teamId: string;
};

export default function usePendingScheduleEdit({
  currentScheduleEditConfig,
  onScheduleSaved,
  taskListId,
  teamId,
}: UsePendingScheduleEditParams) {
  const { showToast } = useToast();
  const [pendingFormValues, setPendingFormValues] =
    useState<TaskDetailScheduleFormValues | null>(null);

  const updateRecurringMutation = useTaskDetailScheduleRecurringMutation({
    taskListId,
    teamId,
  });

  const hasPendingScheduleChanges = pendingFormValues !== null;

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

      onScheduleSaved?.(pendingFormValues.selectedDate);
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
    hasPendingScheduleChanges,
    isScheduleSubmitting: updateRecurringMutation.isPending,
    setPendingFormValues,
  };
}
