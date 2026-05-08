/**
 * 오른쪽 패널의 draft 상태와 서버 mutation 흐름을 합쳐서 관리하는 훅입니다.
 */

'use client';

import useTaskDetailComments from '@/components/common/rightPanel/hooks/useTaskDetailComments';
import useTaskDetailDraftState from '@/components/common/rightPanel/hooks/useTaskDetailDraftState';
import useTaskDetailTaskActions from '@/components/common/rightPanel/hooks/useTaskDetailTaskActions';
import type { UseTaskDetailPanelParams } from '@/components/common/rightPanel/types';

export default function useTaskDetailPanel({
  apiTeamId,
  completionActionDoneValue,
  initialDescription,
  initialMode,
  initialTitle,
  onTaskCheckedChanged,
  onTaskDeleted,
  onTaskUpdated,
  taskId,
  taskListId,
  groupId,
}: UseTaskDetailPanelParams) {
  const draftState = useTaskDetailDraftState({
    initialDescription,
    initialMode,
    initialTitle,
  });
  const commentsState = useTaskDetailComments({
    apiTeamId,
    groupId,
    taskId,
  });
  const taskActions = useTaskDetailTaskActions({
    completionActionDoneValue,
    currentDoneState: !completionActionDoneValue,
    draftDescription: draftState.draftDescription,
    draftTitle: draftState.draftTitle,
    onTaskCheckedChanged,
    onTaskDeleted,
    onTaskUpdated,
    taskId,
    taskListId,
    teamId: groupId,
  });

  const handleSubmitCommentEdit = async () => {
    if (!draftState.editingCommentId) {
      return;
    }

    const isUpdated = await commentsState.handleUpdateComment(
      draftState.editingCommentId,
      draftState.draftCommentContent.trim(),
    );

    if (!isUpdated) {
      return;
    }

    draftState.handleCancelCommentEdit();
  };

  const handleSubmitTaskEdit = async () => {
    const isUpdated = await taskActions.handleSubmitTaskEdit();

    if (!isUpdated) {
      return false;
    }

    draftState.handleApplyTaskEdit();
    return true;
  };

  const handleDeleteComment = async (commentId: string) => {
    const isDeleted = await commentsState.handleDeleteComment(commentId);

    if (!isDeleted || draftState.editingCommentId !== commentId) {
      return;
    }

    draftState.handleCancelCommentEdit();
  };

  const hasUnsavedTaskChanges =
    draftState.isTaskEditing &&
    (draftState.draftTitle !== draftState.title ||
      draftState.draftDescription !== draftState.description);
  const hasUnsavedCommentChanges =
    Boolean(draftState.editingCommentId) &&
    draftState.draftCommentContent !== draftState.editingCommentOriginalContent;

  return {
    comments: commentsState.comments,
    description: draftState.description,
    draftCommentContent: draftState.draftCommentContent,
    draftDescription: draftState.draftDescription,
    draftTitle: draftState.draftTitle,
    editingCommentId: draftState.editingCommentId,
    handleCancelCommentEdit: draftState.handleCancelCommentEdit,
    handleCreateComment: commentsState.handleCreateComment,
    handleDeleteComment,
    handleDiscardUnsavedChanges: draftState.editingCommentId
      ? draftState.handleCancelCommentEdit
      : draftState.handleCancelTaskEdit,
    handleDeleteTask: taskActions.handleDeleteTask,
    handleStartCommentEdit: draftState.handleStartCommentEdit,
    handleStartTaskEdit: draftState.handleStartTaskEdit,
    handleSubmitCommentEdit,
    handleSubmitTaskEdit,
    handleToggleCompletion: taskActions.handleToggleCompletion,
    hasUnsavedChanges: hasUnsavedTaskChanges || hasUnsavedCommentChanges,
    isCommentSubmitting: commentsState.isCommentSubmitting,
    isSubmittingNewComment: commentsState.isSubmittingNewComment,
    isTaskActionSubmitting: taskActions.isTaskActionSubmitting,
    isTaskEditing: draftState.isTaskEditing,
    setDraftCommentContent: draftState.setDraftCommentContent,
    setDraftDescription: draftState.setDraftDescription,
    setDraftTitle: draftState.setDraftTitle,
    title: draftState.title,
  };
}
