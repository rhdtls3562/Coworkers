'use client';

import { useCallback, useState } from 'react';

import type {
  TaskListBoardTask,
  TaskListTaskComment,
  TaskListTaskDetailApplyPatch,
  TaskListTaskDetailOpenMode,
} from '@/app/(service)/[teamid]/tasklist/types';

type UseTaskListTaskDetailPanelParams = {
  currentUserName: string;
  initialMode: TaskListTaskDetailOpenMode;
  task: TaskListBoardTask;
};

export default function useTaskListTaskDetailPanel({
  currentUserName,
  initialMode,
  task,
}: UseTaskListTaskDetailPanelParams) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [comments, setComments] = useState<TaskListTaskComment[]>(() =>
    task.comments.map((comment) => ({ ...comment })),
  );
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDescription, setDraftDescription] = useState(task.description);
  const [draftCommentContent, setDraftCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [isTaskEditing, setIsTaskEditing] = useState(
    () => initialMode === 'edit',
  );

  const handleStartTaskEdit = useCallback(() => {
    setDraftTitle(title);
    setDraftDescription(description);
    setEditingCommentId(null);
    setDraftCommentContent('');
    setIsTaskEditing(true);
  }, [description, title]);

  const handleCancelTaskEdit = useCallback(() => {
    setDraftTitle(title);
    setDraftDescription(description);
    setIsTaskEditing(false);
  }, [description, title]);

  const commitTaskEdit = useCallback((): TaskListTaskDetailApplyPatch => {
    const patch: TaskListTaskDetailApplyPatch = {
      description: draftDescription,
      title: draftTitle,
    };
    setTitle(draftTitle);
    setDescription(draftDescription);
    setIsTaskEditing(false);
    return patch;
  }, [draftDescription, draftTitle]);

  const handleStartCommentEdit = useCallback(
    (comment: TaskListTaskComment) => {
      if (comment.author !== currentUserName) {
        return;
      }

      setIsTaskEditing(false);
      setEditingCommentId(comment.id);
      setDraftCommentContent(comment.content);
    },
    [currentUserName],
  );

  const handleCancelCommentEdit = useCallback(() => {
    setEditingCommentId(null);
    setDraftCommentContent('');
  }, []);

  const handleSubmitCommentEdit = useCallback(() => {
    if (!editingCommentId) {
      return;
    }

    const edited = comments.find((comment) => comment.id === editingCommentId);
    if (!edited || edited.author !== currentUserName) {
      return;
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id !== editingCommentId) {
          return comment;
        }

        return {
          ...comment,
          content: draftCommentContent,
        };
      }),
    );
    setEditingCommentId(null);
    setDraftCommentContent('');
  }, [comments, currentUserName, draftCommentContent, editingCommentId]);

  const handleDeleteComment = useCallback(
    (commentId: string) => {
      const target = comments.find((comment) => comment.id === commentId);
      if (!target || target.author !== currentUserName) {
        return;
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));

      if (editingCommentId !== commentId) {
        return;
      }

      setEditingCommentId(null);
      setDraftCommentContent('');
    },
    [comments, currentUserName, editingCommentId],
  );

  const editingComment = editingCommentId
    ? (comments.find((comment) => comment.id === editingCommentId) ?? null)
    : null;
  const hasUnsavedTaskChanges =
    isTaskEditing && (draftTitle !== title || draftDescription !== description);
  const hasUnsavedCommentChanges =
    editingComment !== null && draftCommentContent !== editingComment.content;
  const hasUnsavedChanges = hasUnsavedTaskChanges || hasUnsavedCommentChanges;

  const handleDiscardUnsavedChanges = useCallback(() => {
    if (isTaskEditing) {
      handleCancelTaskEdit();
      return;
    }

    if (!editingCommentId) {
      return;
    }

    handleCancelCommentEdit();
  }, [
    editingCommentId,
    handleCancelCommentEdit,
    handleCancelTaskEdit,
    isTaskEditing,
  ]);

  return {
    comments,
    commitTaskEdit,
    description,
    draftCommentContent,
    draftDescription,
    draftTitle,
    editingCommentId,
    handleDiscardUnsavedChanges,
    handleCancelCommentEdit,
    handleCancelTaskEdit,
    handleDeleteComment,
    handleStartCommentEdit,
    handleStartTaskEdit,
    handleSubmitCommentEdit,
    hasUnsavedChanges,
    isTaskEditing,
    setDraftCommentContent,
    setDraftDescription,
    setDraftTitle,
    title,
  };
}
