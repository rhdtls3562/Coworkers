'use client';

/**
 * 댓글 편집·삭제 훅을 합치고, 본인 댓글용 드롭다운 메뉴 항목을 만드는 상세 댓글 행 훅입니다.
 */

import {
  BOARD_DETAIL_DROPDOWN_ITEMS,
  BOARD_DETAIL_MENU,
} from '@/app/(service)/boards/[articleId]/constants';
import { useBoardDetailCommentItemDelete } from '@/app/(service)/boards/[articleId]/hooks/useBoardDetailCommentItemDelete';
import { useBoardDetailCommentItemEdit } from '@/app/(service)/boards/[articleId]/hooks/useBoardDetailCommentItemEdit';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';

type UseBoardDetailCommentItemParams = {
  articleId: number;
  comment: Comment;
  currentUserId?: number | null;
  onDeleteSuccess: () => void;
};

export const useBoardDetailCommentItem = ({
  articleId,
  comment,
  currentUserId,
  onDeleteSuccess,
}: UseBoardDetailCommentItemParams) => {
  const isOwnComment = comment.writer.id === currentUserId;

  const edit = useBoardDetailCommentItemEdit({
    articleId,
    comment,
    isOwnComment,
  });

  const del = useBoardDetailCommentItemDelete({
    articleId,
    comment,
    onDeleteSuccess,
  });

  const menuItems = isOwnComment
    ? BOARD_DETAIL_DROPDOWN_ITEMS.map((item) => ({
        ...item,
        onClick: () => {
          if (item.label === BOARD_DETAIL_MENU.EDIT) edit.handleStartEdit();
          else if (item.label === BOARD_DETAIL_MENU.DELETE) del.handleDelete();
        },
      }))
    : [];

  return {
    isOwnComment,
    isEditing: edit.isEditing,
    isDeleteModalOpen: del.isDeleteModalOpen,
    menuItems,
    handleSubmitEdit: edit.handleSubmitEdit,
    handleCancelEdit: edit.handleCancelEdit,
    editedContent: edit.editedContent,
    handleEditedContentChange: edit.handleEditedContentChange,
    handleDeleteConfirm: del.handleDeleteConfirm,
    setIsDeleteModalOpen: del.setIsDeleteModalOpen,
  };
};
