'use client';

/**
 * 내 히스토리 작업 카드의 수정, 삭제, 오른쪽 패널 열기 동작을 관리하는 훅입니다.
 */

import { useState } from 'react';

import type { UseHistoryTaskCardParams } from '@/app/(service)/myhistory/types';
import TaskDetailPanelContent from '@/components/common/rightPanel/components/TaskDetailPanelContent';
import { useToast } from '@/components/common/toast';
import useRightPanel from '@/components/layout/hooks/useRightPanel';
import { useMeQuery } from '@/hooks/useUser';

export default function useHistoryTaskCard({ task }: UseHistoryTaskCardParams) {
  const { openRightPanel } = useRightPanel();
  const { showToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: meData } = useMeQuery();
  const assigneeName =
    typeof meData === 'object' &&
    meData !== null &&
    'nickname' in meData &&
    typeof meData.nickname === 'string'
      ? meData.nickname
      : '';

  const handleEdit = () => {
    openRightPanel({
      content: (
        <TaskDetailPanelContent
          key={task.id}
          assigneeName={assigneeName}
          comments={[]}
          completionActionLabel="완료 취소하기"
          description={task.description}
          frequency={task.frequency}
          initialMode="edit"
          startedAt={task.startedAt}
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

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    showToast('삭제 되었습니다.', 'error');
  };

  return {
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleEdit,
    handleOpenDeleteModal,
    isDeleteModalOpen,
  } as const;
}
