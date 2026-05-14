'use client';

/**
 * 오른쪽 패널의 시작 날짜/반복 설정 수정 모달 상태와 mutation 흐름을 관리합니다.
 */

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/queryKeys';
import { buildTaskListRecurringBody } from '@/app/(service)/[teamid]/tasklist/utils/taskListCreateTaskPayload';
import type {
  TaskDetailScheduleEditConfig,
  TaskDetailScheduleFormValues,
  UseTaskDetailScheduleEditorParams,
  UseTaskDetailScheduleEditorReturn,
} from '@/components/common/rightPanel/types';
import {
  formatTaskDetailFrequency,
  formatTaskDetailStartedAt,
} from '@/components/common/rightPanel/utils/taskDetailSchedule';
import { useToast } from '@/components/common/toast';
import { useUpdateRecurringMutation } from '@/hooks/useRecurring';

export default function useTaskDetailScheduleEditor({
  currentDescription,
  currentTitle,
  initialFrequencyLabel,
  initialStartedAtLabel,
  scheduleEditConfig,
  taskListId,
  teamId,
}: UseTaskDetailScheduleEditorParams): UseTaskDetailScheduleEditorReturn {
  const queryClient = useQueryClient();
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

  const updateRecurringMutation = useUpdateRecurringMutation({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.team.detail(teamId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.taskList.detail(teamId, taskListId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.completedTasks(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.completedTaskSummary(),
        }),
      ]);
    },
  });

  const hasScheduleEditCapability = Boolean(
    currentScheduleEditConfig?.recurringId &&
    (currentScheduleEditConfig.frequencyType !== 'WEEKLY' ||
      (currentScheduleEditConfig.weekDays?.length ?? 0) > 0),
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

      const nextStartedAtRaw = recurringBody.startDate;
      const nextFrequencyType =
        values.repeat === 'daily'
          ? 'DAILY'
          : values.repeat === 'monthly'
            ? 'MONTHLY'
            : values.repeat === 'weekly'
              ? 'WEEKLY'
              : 'ONCE';

      const nextScheduleEditConfig = {
        frequencyType: nextFrequencyType,
        recurringId: currentScheduleEditConfig.recurringId,
        startedAtRaw: nextStartedAtRaw,
        weekDays: values.repeat === 'weekly' ? values.weekDays : undefined,
      } satisfies TaskDetailScheduleEditConfig;

      setCurrentScheduleEditConfig(nextScheduleEditConfig);
      setDisplayStartedAt(formatTaskDetailStartedAt(nextStartedAtRaw));
      setDisplayFrequency(formatTaskDetailFrequency(nextScheduleEditConfig));
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
    handleCloseScheduleEditModal,
    handleOpenScheduleEditModal,
    handleSubmitScheduleEdit,
    hasScheduleEditCapability,
    isScheduleEditModalOpen,
    isScheduleSubmitting: updateRecurringMutation.isPending,
    scheduleEditConfig: currentScheduleEditConfig,
  };
}
