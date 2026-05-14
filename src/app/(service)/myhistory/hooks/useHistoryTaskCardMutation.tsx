/**
 * 내 히스토리 작업 카드의 수정, 삭제, 오른쪽 패널 열기 동작을 관리하는 훅입니다.
 */

import { useState } from 'react';

import {
  HISTORY_TASK_CARD_TEXT,
  MY_HISTORY_API_TEAM_ID,
} from '@/app/(service)/myhistory/constants';
import type { UseHistoryTaskCardParams } from '@/app/(service)/myhistory/types';
import TaskDetailPanelContent from '@/components/common/rightPanel/components/TaskDetailPanelContent';
import { useToast } from '@/components/common/toast';
import useRightPanel from '@/components/layout/hooks/useRightPanel';
import { useDeleteTaskMutation } from '@/hooks/useTask';
import { useMeQuery } from '@/hooks/useUser';

export default function useHistoryTaskCardMutation({
  task,
}: UseHistoryTaskCardParams) {
  const { openRightPanel } = useRightPanel();
  const { showToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: meData } = useMeQuery();
  const deleteTaskMutation = useDeleteTaskMutation();
  const assigneeName =
    typeof meData === 'object' &&
    meData !== null &&
    'nickname' in meData &&
    typeof meData.nickname === 'string'
      ? meData.nickname
      : '';
  const assigneeImage =
    typeof meData === 'object' &&
    meData !== null &&
    'image' in meData &&
    typeof meData.image === 'string'
      ? meData.image
      : null;

  const handleOpenDetailPanel = () => {
    openRightPanel({
      content: (
        <TaskDetailPanelContent
          key={task.id}
          apiTeamId={MY_HISTORY_API_TEAM_ID}
          assigneeImage={assigneeImage}
          assigneeName={assigneeName}
          completionActionDoneValue={!task.isCompleted}
          completionActionLabel={
            task.isCompleted ? '완료 취소하기' : '완료하기'
          }
          description={task.description}
          frequency={task.frequency}
          initialMode="view"
          scheduleEditConfig={task.scheduleEditConfig}
          startedAt={task.startedAt}
          taskId={task.id}
          taskListId={task.taskListId}
          teamId={task.teamId}
          title={task.title}
        />
      ),
    });
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const dropdownItems = [
    {
      label: HISTORY_TASK_CARD_TEXT.edit,
      onClick: handleOpenDetailPanel,
    },
    {
      label: HISTORY_TASK_CARD_TEXT.delete,
      onClick: handleOpenDeleteModal,
    },
  ];

  const handleConfirmDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync({
        recurringId: task.scheduleEditConfig?.recurringId,
        taskId: task.id,
        taskListId: task.taskListId,
        teamId: task.teamId,
      });
      setIsDeleteModalOpen(false);
      showToast(HISTORY_TASK_CARD_TEXT.deleteSuccess, 'error');
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : HISTORY_TASK_CARD_TEXT.deleteError,
        'error',
      );
    }
  };

  return {
    dropdownItems,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleOpenDetailPanel,
    isDeleteModalOpen,
  } as const;
}
