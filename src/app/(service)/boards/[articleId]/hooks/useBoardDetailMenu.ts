'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  BOARD_DETAIL_DROPDOWN_ITEMS,
  BOARD_DETAIL_MENU,
  TEAM_ID,
} from '@/app/(service)/boards/[articleId]/constants';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useDeleteArticleMutation } from '@/hooks/useArticle';
import { getStoredAccessToken } from '@/utils/authSession';

export const useBoardDetailMenu = (articleId: string, canManage: boolean) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToast();
  const deleteMutation = useDeleteArticleMutation();

  const handleEdit = () => {
    router.push(`${ROUTES.BOARDS}/${articleId}?edit=true`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!TEAM_ID) {
      showToast('팀 정보가 설정되지 않았습니다.', 'error');
      return;
    }

    if (deleteMutation.isPending) {
      return;
    }

    const token = getStoredAccessToken() ?? undefined;
    if (!token) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    deleteMutation.mutate(
      { articleId: Number(articleId), teamId: TEAM_ID, token },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          showToast('게시글이 삭제되었습니다.', 'success');
          router.push(ROUTES.BOARDS);
        },
        onError: () => {
          showToast('게시글 삭제에 실패했습니다. 다시 시도해주세요.', 'error');
        },
      },
    );
  };

  const menuItems = BOARD_DETAIL_DROPDOWN_ITEMS.map((item) => ({
    ...item,
    onClick: () => {
      if (item.label === BOARD_DETAIL_MENU.EDIT) handleEdit();
      else if (item.label === BOARD_DETAIL_MENU.DELETE) handleDelete();
    },
  }));

  return {
    handleCloseDeleteModal,
    handleConfirmDelete,
    isDeleteModalOpen,
    menuItems: canManage ? menuItems : [],
  };
};
