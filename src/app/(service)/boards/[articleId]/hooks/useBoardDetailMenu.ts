'use client';

/**
 * 게시글 상세 드롭다운 메뉴(수정·삭제 등) 상태와 라우팅·삭제 mutation 핸들러를 제공하는 훅입니다.
 */

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  BOARD_DETAIL_DROPDOWN_ITEMS,
  BOARD_DETAIL_MENU,
  TEAM_ID,
} from '@/app/(service)/boards/[articleId]/constants';
import { resolveBoardAuthenticatedContext } from '@/app/(service)/boards/[articleId]/utils/resolveBoardAuthenticatedContext';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useDeleteArticleMutation } from '@/hooks/useArticle';

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
      { articleId: Number(articleId), teamId: auth.teamId, token: auth.token },
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          showToast('게시글이 삭제되었습니다.', 'error');
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
