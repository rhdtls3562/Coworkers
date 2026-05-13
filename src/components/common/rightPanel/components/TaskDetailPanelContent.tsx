/**
 * 오른쪽 패널 상세 화면의 보기/수정 상태 전체를 관리하는 컴포넌트입니다.
 */

'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { TaskDeleteConfirmModal } from '@/components/common/modal';
import TaskDetailPanelContentLayout from '@/components/common/rightPanel/components/TaskDetailPanelContentLayout';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  useLayoutEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [initialMode, isTaskEditing, taskId, taskListId]);

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
    <>
      <TaskDetailPanelContentLayout
        assigneeImage={editableAssigneeImage}
        assigneeName={assigneeName}
        commentCount={editableComments.length}
        comments={editableComments}
        completionActionLabel={completionActionLabel}
        currentUserImage={currentUserImage}
        description={description}
        draftCommentContent={draftCommentContent}
        draftDescription={draftDescription}
        draftTitle={draftTitle}
        editingCommentId={editingCommentId}
        frequency={frequency}
        isCommentSubmitting={isCommentSubmitting}
        isSubmittingNewComment={isSubmittingNewComment}
        isSubmittingTaskAction={isTaskActionSubmitting}
        isTaskEditing={isTaskEditing}
        onCancelCommentEdit={handleCancelCommentEdit}
        onChangeDraftCommentContent={setDraftCommentContent}
        onChangeDraftDescription={setDraftDescription}
        onChangeDraftTitle={setDraftTitle}
        onCreateComment={handleCreateComment}
        onDelete={handleOpenDeleteModal}
        onDeleteComment={handleDeleteComment}
        onStartCommentEdit={handleStartCommentEdit}
        onStartEdit={handleStartTaskEdit}
        onSubmitCommentEdit={handleSubmitCommentEdit}
        onSubmitEdit={handleSubmitTaskEdit}
        onToggleCompletion={handleToggleCompletion}
        scrollContainerRef={scrollContainerRef}
        startedAt={startedAt}
        title={title}
      />

      {isDeleteModalOpen && (
        <TaskDeleteConfirmModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          taskTitle={title}
        />
      )}
    </>
  );
}
