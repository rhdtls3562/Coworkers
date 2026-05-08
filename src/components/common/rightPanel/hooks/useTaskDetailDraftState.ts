/**
 * 오른쪽 패널의 제목/설명/댓글 수정 draft 상태를 관리하는 훅입니다.
 */

'use client';

import { useState } from 'react';

import type {
  RightPanelComment,
  UseTaskDetailDraftStateParams,
} from '@/components/common/rightPanel/types';

export default function useTaskDetailDraftState({
  initialDescription,
  initialMode = 'view',
  initialTitle,
}: UseTaskDetailDraftStateParams) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [draftTitle, setDraftTitle] = useState(initialTitle);
  const [draftDescription, setDraftDescription] = useState(initialDescription);
  const [draftCommentContent, setDraftCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentOriginalContent, setEditingCommentOriginalContent] =
    useState('');
  const [isTaskEditing, setIsTaskEditing] = useState(initialMode === 'edit');

  const handleStartTaskEdit = () => {
    setDraftTitle(title);
    setDraftDescription(description);
    setEditingCommentId(null);
    setEditingCommentOriginalContent('');
    setDraftCommentContent('');
    setIsTaskEditing(true);
  };

  const handleCancelTaskEdit = () => {
    setDraftTitle(title);
    setDraftDescription(description);
    setIsTaskEditing(false);
  };

  const handleApplyTaskEdit = () => {
    setTitle(draftTitle);
    setDescription(draftDescription);
    setIsTaskEditing(false);
  };

  const handleStartCommentEdit = (comment: RightPanelComment) => {
    setIsTaskEditing(false);
    setEditingCommentId(comment.id);
    setEditingCommentOriginalContent(comment.content);
    setDraftCommentContent(comment.content);
  };

  const handleCancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditingCommentOriginalContent('');
    setDraftCommentContent('');
  };

  return {
    description,
    draftCommentContent,
    draftDescription,
    draftTitle,
    editingCommentId,
    editingCommentOriginalContent,
    handleApplyTaskEdit,
    handleCancelCommentEdit,
    handleCancelTaskEdit,
    handleStartCommentEdit,
    handleStartTaskEdit,
    isTaskEditing,
    setDescription,
    setDraftCommentContent,
    setDraftDescription,
    setDraftTitle,
    title,
  };
}
