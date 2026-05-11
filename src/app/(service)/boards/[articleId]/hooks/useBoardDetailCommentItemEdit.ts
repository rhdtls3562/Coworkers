'use client';

/**
 * 상세 페이지 댓글 한 건의 편집 UI 상태와 댓글 수정 mutation을 담당하는 훅입니다.
 */

import { useState } from 'react';

import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';
import { resolveBoardAuthenticatedContext } from '@/app/(service)/boards/[articleId]/utils/resolveBoardAuthenticatedContext';
import { useUpdateArticleCommentMutation } from '@/hooks/useArticleComment';

type UseBoardDetailCommentItemEditParams = {
  articleId: number;
  comment: Comment;
  isOwnComment: boolean;
};

export function useBoardDetailCommentItemEdit({
  articleId,
  comment,
  isOwnComment,
}: UseBoardDetailCommentItemEditParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const updateMutation = useUpdateArticleCommentMutation();

  const handleSubmitEdit = () => {
    if (updateMutation.isPending) {
      return;
    }

    const trimmed = editedContent.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed === comment.content) {
      setIsEditing(false);
      return;
    }

    const auth = resolveBoardAuthenticatedContext({ teamId: TEAM_ID });
    if (!auth) {
      return;
    }

    updateMutation.mutate(
      {
        articleId,
        body: { content: trimmed },
        commentId: comment.id,
        teamId: auth.teamId,
        token: auth.token,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleStartEdit = () => {
    if (!isOwnComment) return;
    setEditedContent(comment.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  const handleEditedContentChange = (content: string) => {
    setEditedContent(content);
  };

  return {
    editedContent,
    handleCancelEdit,
    handleEditedContentChange,
    handleStartEdit,
    handleSubmitEdit,
    isEditing,
  };
}
