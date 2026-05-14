/**
 * 오른쪽 패널에서 할 일 수정, 완료 상태 변경, 삭제를 담당하는 훅입니다.
 */

'use client';

import type { UseTaskDetailTaskActionsParams } from '@/components/common/rightPanel/types';
import getRightPanelErrorMessage from '@/components/common/rightPanel/utils/getRightPanelErrorMessage';
import { useToast } from '@/components/common/toast';
import useRightPanel from '@/components/layout/hooks/useRightPanel';
import { useDeleteTaskMutation, useUpdateTaskMutation } from '@/hooks/useTask';

export default function useTaskDetailTaskActions({
  completionActionDoneValue,
  currentDoneState,
  draftDescription,
  draftTitle,
  onTaskCheckedChanged,
  onTaskDeleted,
  onTaskUpdated,
  recurringId,
  taskId,
  taskListId,
  teamId,
}: UseTaskDetailTaskActionsParams) {
  const { closeRightPanel } = useRightPanel();
  const { showToast } = useToast();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const handleSubmitTaskEdit = async () => {
    if (!draftTitle.trim()) {
      showToast('할 일 제목을 입력해주세요.', 'error');
      return false;
    }

    try {
      await updateTaskMutation.mutateAsync({
        body: {
          description: draftDescription,
          done: currentDoneState,
          name: draftTitle,
        },
        taskId,
        taskListId,
        teamId,
      });
      onTaskUpdated?.(draftTitle, draftDescription);
      showToast('할 일이 수정되었습니다.', 'success');
      return true;
    } catch (error) {
      showToast(
        getRightPanelErrorMessage(error, '할 일 수정에 실패했습니다.'),
        'error',
      );
      return false;
    }
  };

  const handleToggleCompletion = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        body: {
          done: completionActionDoneValue,
        },
        taskId,
        taskListId,
        teamId,
      });
      onTaskCheckedChanged?.(completionActionDoneValue);
      closeRightPanel();
      showToast(
        completionActionDoneValue
          ? '할 일이 완료되었습니다.'
          : '완료가 취소되었습니다.',
        'success',
      );
      return true;
    } catch (error) {
      showToast(
        getRightPanelErrorMessage(
          error,
          completionActionDoneValue
            ? '완료 처리에 실패했습니다.'
            : '완료 취소에 실패했습니다.',
        ),
        'error',
      );
      return false;
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTaskMutation.mutateAsync({
        recurringId,
        taskId,
        taskListId,
        teamId,
      });
      onTaskDeleted?.();
      closeRightPanel();
      showToast('삭제되었습니다.', 'error');
      return true;
    } catch (error) {
      showToast(
        getRightPanelErrorMessage(error, '할 일 삭제에 실패했습니다.'),
        'error',
      );
      return false;
    }
  };

  return {
    handleDeleteTask,
    handleSubmitTaskEdit,
    handleToggleCompletion,
    isTaskActionSubmitting:
      updateTaskMutation.isPending || deleteTaskMutation.isPending,
  };
}
