'use client';

/**
 * 상세 페이지 댓글 한 건의 삭제 확인 모달과 댓글 삭제 mutation을 담당하는 훅입니다.
 */

import { useState } from 'react';

import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';
import { resolveBoardAuthenticatedContext } from '@/app/(service)/boards/[articleId]/utils/resolveBoardAuthenticatedContext';
import { useToast } from '@/components/common/toast';
import { useDeleteArticleCommentMutation } from '@/hooks/useArticleComment';

type UseBoardDetailCommentItemDeleteParams = {
  articleId: number;
  comment: Comment;
  onDeleteSuccess: () => void;
};

export function useBoardDetailCommentItemDelete({
  articleId,
  comment,
  onDeleteSuccess,
}: UseBoardDetailCommentItemDeleteParams) {
  const { showToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteMutation = useDeleteArticleCommentMutation();

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteMutation.isPending) {
      return;
    }

    const auth = resolveBoardAuthenticatedContext({
      showToast,
      teamId: TEAM_ID,
    });
    if (!auth) {
      return;
    }

    deleteMutation.mutate(
      {
        articleId,
        commentId: comment.id,
        teamId: auth.teamId,
        token: auth.token,
      },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          showToast('댓글이 삭제되었습니다.', 'success');
          onDeleteSuccess();
        },
        onError: () => {
          showToast('댓글 삭제에 실패했습니다. 다시 시도해주세요.', 'error');
        },
      },
    );
  };

  return {
    handleDelete,
    handleDeleteConfirm,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  };
}
