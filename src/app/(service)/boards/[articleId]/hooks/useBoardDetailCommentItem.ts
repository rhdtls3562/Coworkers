'use client';

import { useState } from 'react';

import {
  BOARD_DETAIL_DROPDOWN_ITEMS,
  BOARD_DETAIL_MENU,
} from '@/app/(service)/boards/[articleId]/constants';
import type { Comment } from '@/app/(service)/boards/[articleId]/types';
import { useToast } from '@/components/common/toast';

type UseBoardDetailCommentItemParams = {
  comment: Comment;
  currentUserId?: number | null;
};

export const useBoardDetailCommentItem = ({
  comment,
  currentUserId,
}: UseBoardDetailCommentItemParams) => {
  const { showToast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const isOwnComment = comment.writer.id === currentUserId;

  const handleEdit = () => {
    // TODO: 수정 기능 구현 로직
    setIsEditing(false);
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

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    showToast('댓글이 삭제되었습니다.', 'error');
  };

  const menuItems = BOARD_DETAIL_DROPDOWN_ITEMS.map((item) => ({
    ...item,
    onClick: () => {
      if (item.label === BOARD_DETAIL_MENU.EDIT) handleStartEdit();
      else if (item.label === BOARD_DETAIL_MENU.DELETE) handleDelete();
    },
  }));

  return {
    isOwnComment,
    isEditing,
    isDeleteModalOpen,
    menuItems,
    handleEdit,
    handleCancelEdit,
    editedContent,
    handleEditedContentChange,
    handleDeleteConfirm,
    setIsDeleteModalOpen,
  };
};
