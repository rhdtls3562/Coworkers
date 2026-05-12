/**
 * 오른쪽 패널 상세 화면의 보기/수정 상태 전체를 관리하는 컴포넌트입니다.
 */

'use client';

import { useState } from 'react';

import { TaskDeleteConfirmModal } from '@/components/common/modal';
import TaskDetailPanelBody from '@/components/common/rightPanel/components/TaskDetailPanelBody';
import TaskDetailPanelFooter from '@/components/common/rightPanel/components/TaskDetailPanelFooter';
import TaskDetailPanelHeader from '@/components/common/rightPanel/components/TaskDetailPanelHeader';
import TaskDetailPanelMeta from '@/components/common/rightPanel/components/TaskDetailPanelMeta';
import useTaskDetailPanel from '@/components/common/rightPanel/hooks/useTaskDetailPanel';
import useUnsavedChangesToastGuard from '@/components/common/rightPanel/hooks/useUnsavedChangesToastGuard';
import type { TaskDetailPanelContentProps } from '@/components/common/rightPanel/types';

export default function TaskDetailPanelContent({
  apiTeamId,
  assigneeImage,
  assigneeName,
  completionActionDoneValue = true,
  completionActionLabel,
  description: initialDescription,
  frequency,
  initialMode,
  onTaskCheckedChanged,
  onTaskDeleted,
  onTaskUpdated,
  startedAt,
  taskId,
  taskListId,
  teamId,
  title: initialTitle,
}: TaskDetailPanelContentProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    assigneeImage: editableAssigneeImage,
    comments: editableComments,
    currentUserImage,
    description,
    draftCommentContent,
    draftDescription,
    draftTitle,
    handleCreateComment,
    handleDeleteTask,
    handleDeleteComment,
    handleDiscardUnsavedChanges,
    editingCommentId,
    handleCancelCommentEdit,
    handleStartCommentEdit,
    handleStartTaskEdit,
    handleSubmitCommentEdit,
    handleSubmitTaskEdit,
    handleToggleCompletion,
    hasUnsavedChanges,
    isCommentSubmitting,
    isSubmittingNewComment,
    isTaskActionSubmitting,
    isTaskEditing,
    setDraftCommentContent,
    setDraftDescription,
    setDraftTitle,
    title,
  } = useTaskDetailPanel({
    apiTeamId,
    assigneeImage,
    completionActionDoneValue,
    groupId: teamId,
    initialDescription: initialDescription,
    initialMode,
    initialTitle,
    onTaskCheckedChanged,
    onTaskDeleted,
    onTaskUpdated,
    taskId,
    taskListId,
  });

  useUnsavedChangesToastGuard({
    hasUnsavedChanges,
    onDiscardChanges: handleDiscardUnsavedChanges,
  });

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const isDeleted = await handleDeleteTask();

    if (!isDeleted) {
      return;
    }

    setIsDeleteModalOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-8 md:px-8 md:pb-10 md:pt-10">
        <TaskDetailPanelHeader
          draftTitle={draftTitle}
          isEditing={isTaskEditing}
          onChangeDraftTitle={setDraftTitle}
          onDelete={handleOpenDeleteModal}
          onStartEdit={handleStartTaskEdit}
          title={title}
        />

        <div className="mt-5 md:mt-6">
          <TaskDetailPanelMeta
            assigneeImage={editableAssigneeImage}
            assigneeName={assigneeName}
            frequency={frequency}
            startedAt={startedAt}
          />
        </div>

        <TaskDetailPanelBody
          commentCount={editableComments.length}
          comments={editableComments}
          currentUserImage={currentUserImage}
          description={description}
          draftCommentContent={draftCommentContent}
          draftDescription={draftDescription}
          editingCommentId={editingCommentId}
          isCommentSubmitting={isCommentSubmitting}
          isSubmittingNewComment={isSubmittingNewComment}
          isTaskEditing={isTaskEditing}
          onCancelCommentEdit={handleCancelCommentEdit}
          onChangeDraftCommentContent={setDraftCommentContent}
          onChangeDraftDescription={setDraftDescription}
          onCreateComment={handleCreateComment}
          onDeleteComment={handleDeleteComment}
          onStartCommentEdit={handleStartCommentEdit}
          onSubmitCommentEdit={handleSubmitCommentEdit}
        />
        <TaskDetailPanelFooter
          completionActionLabel={completionActionLabel}
          isEditing={isTaskEditing}
          isSubmitting={isTaskActionSubmitting}
          onToggleCompletion={handleToggleCompletion}
          onSubmitEdit={handleSubmitTaskEdit}
        />
      </div>

      {isDeleteModalOpen && (
        <TaskDeleteConfirmModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          taskTitle={title}
        />
      )}
    </div>
  );
}
