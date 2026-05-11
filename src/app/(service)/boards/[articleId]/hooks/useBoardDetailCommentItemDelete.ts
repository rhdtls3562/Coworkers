'use client';

/**
 * 상세 페이지 댓글 한 건의 삭제 mutation을 담당하는 훅입니다.
 */

import { TEAM_ID } from '@/app/(service)/boards/[articleId]/constants';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';
import { resolveBoardAuthenticatedContext } from '@/app/(service)/boards/[articleId]/utils/resolveBoardAuthenticatedContext';
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
  const deleteMutation = useDeleteArticleCommentMutation();

  const handleDeleteConfirm = () => {
    if (deleteMutation.isPending) {
      return;
    }

    const auth = resolveBoardAuthenticatedContext({ teamId: TEAM_ID });
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
          onDeleteSuccess();
        },
      },
    );
  };

  return {
    handleDeleteConfirm,
  };
}
