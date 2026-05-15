/**
 * 오른쪽 패널 상세 화면의 보기/수정 상태 전체를 관리하는 컴포넌트입니다.
 */

'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { TaskDeleteConfirmModal } from '@/components/common/modal';
import TaskDetailPanelContentLayout from '@/components/common/rightPanel/components/TaskDetailPanelContentLayout';
import TaskDetailScheduleEditModal from '@/components/common/rightPanel/components/TaskDetailScheduleEditModal';
import useTaskDetailPanel from '@/components/common/rightPanel/hooks/useTaskDetailPanel';
import useTaskDetailScheduleEditor from '@/components/common/rightPanel/hooks/useTaskDetailScheduleEditor';
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
  scheduleEditConfig,
  startedAt,
  taskId,
  taskListId,
  teamId,
  title: initialTitle,
}: TaskDetailPanelContentProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startedAtLabelText =
    scheduleEditConfig?.frequencyType &&
    scheduleEditConfig.frequencyType !== 'ONCE'
      ? '일정 날짜'
      : '시작 날짜';
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
    hasTaskChanges,
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
    scheduleEditConfig,
    taskId,
    taskListId,
  });
  const {
    displayFrequency,
    displayStartedAt,
    handleCloseScheduleEditModal,
    handleOpenScheduleEditModal,
    handleSubmitScheduleEdit,
    hasScheduleEditCapability,
    isScheduleEditModalOpen,
    isScheduleSubmitting,
    scheduleEditConfig: currentScheduleEditConfig,
  } = useTaskDetailScheduleEditor({
    currentDescription: description,
    currentTitle: title,
    initialFrequencyLabel: frequency,
    initialStartedAtLabel: startedAt,
    scheduleEditConfig,
    taskListId,
    teamId,
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
        frequency={displayFrequency}
        draftCommentContent={draftCommentContent}
        draftDescription={draftDescription}
        draftTitle={draftTitle}
        editingCommentId={editingCommentId}
        hasScheduleEditCapability={hasScheduleEditCapability}
        hasTaskChanges={hasTaskChanges}
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
        onEditSchedule={handleOpenScheduleEditModal}
        onStartCommentEdit={handleStartCommentEdit}
        onStartEdit={handleStartTaskEdit}
        onSubmitCommentEdit={handleSubmitCommentEdit}
        onSubmitEdit={handleSubmitTaskEdit}
        onToggleCompletion={handleToggleCompletion}
        scrollContainerRef={scrollContainerRef}
        startedAt={displayStartedAt}
        startedAtLabelText={startedAtLabelText}
        title={title}
      />

      {isScheduleEditModalOpen && currentScheduleEditConfig ? (
        <TaskDetailScheduleEditModal
          initialSchedule={currentScheduleEditConfig}
          isSubmitting={isScheduleSubmitting}
          onClose={handleCloseScheduleEditModal}
          onSubmit={handleSubmitScheduleEdit}
        />
      ) : null}

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
