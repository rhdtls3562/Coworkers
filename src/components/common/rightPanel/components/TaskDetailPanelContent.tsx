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
  onScheduleSaved,
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
  const startedTimeAtLabelText = '시작 시각';
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
  } = useTaskDetailScheduleEditor({
    currentDescription: description,
    currentTitle: title,
    initialFrequencyLabel: frequency,
    initialStartedAtLabel: startedAt,
    onScheduleSaved,
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

  // 제목/설명 변경 또는 일정 변경 중 하나라도 있으면 수정하기 버튼을 활성화한다.
  const combinedHasTaskChanges = hasTaskChanges || hasPendingScheduleChanges;
  // 두 mutation 중 하나라도 진행 중이면 버튼을 비활성화한다.
  const combinedIsSubmitting = isTaskActionSubmitting || isScheduleSubmitting;

  /**
   * 패널의 수정하기 버튼 클릭 시 제목/설명 저장과 일정 저장을 순서대로 실행합니다.
   * 제목/설명 저장이 실패하면 일정 저장은 실행하지 않습니다.
   */
  const handleSubmitAll = async (): Promise<boolean> => {
    // draft 값을 미리 캡처한다. handleSubmitTaskEdit 이후 상태가 초기화될 수 있다.
    const titleToSave = draftTitle;
    const descriptionToSave = draftDescription;

    // 1. 일정이 변경되었다면 서버에 일정 수정을 먼저 요청합니다.
    if (hasPendingScheduleChanges) {
      const ok = await commitScheduleEdit(titleToSave, descriptionToSave);
      if (!ok) return false;
    }

    // 2. 제목/설명이 변경되었거나, '일정만 변경된 경우'에도
    // 패널의 수정 모드를 정상 종료(뷰 전환)하고 동기화하기 위해 handleSubmitTaskEdit를 실행합니다.
    if (hasTaskChanges || hasPendingScheduleChanges) {
      const ok = await handleSubmitTaskEdit();
      if (!ok) return false;
    }

    return true;
  };

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
        hasTaskChanges={combinedHasTaskChanges}
        isCommentSubmitting={isCommentSubmitting}
        isSubmittingNewComment={isSubmittingNewComment}
        isSubmittingTaskAction={combinedIsSubmitting}
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
        onSubmitEdit={handleSubmitAll}
        onToggleCompletion={handleToggleCompletion}
        scrollContainerRef={scrollContainerRef}
        startedAt={displayStartedAt}
        startedTimeAtLabelText={startedTimeAtLabelText}
        startedAtLabelText={startedAtLabelText}
        startTime={displayStartTime}
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
