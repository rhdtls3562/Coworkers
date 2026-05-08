'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  BOARD_DETAIL_DROPDOWN_ITEMS,
  BOARD_DETAIL_MENU,
} from '@/app/(service)/boards/[articleId]/constants';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';

export const useBoardDetailMenu = (articleId: string, canManage: boolean) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleEdit = () => {
    router.push(`${ROUTES.BOARDS}/${articleId}?edit=true`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    router.push(ROUTES.BOARDS);
    showToast('게시글이 삭제되었습니다.', 'error');
  };

  const menuItems = BOARD_DETAIL_DROPDOWN_ITEMS.map((item) => ({
    ...item,
    onClick: () => {
      if (item.label === BOARD_DETAIL_MENU.EDIT) handleEdit();
      else if (item.label === BOARD_DETAIL_MENU.DELETE) handleDelete();
    },
  }));

  return {
    handleDeleteConfirm,
    isDeleteModalOpen,
    menuItems: canManage ? menuItems : [],
  };
};
