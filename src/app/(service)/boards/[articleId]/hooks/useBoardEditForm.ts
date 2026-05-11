'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import type { QueryKeyId } from '@/api/queryKeys';
import { executeBoardArticleEdit } from '@/app/(service)/boards/[articleId]/utils/executeBoardArticleEdit';
import useBoardFormFields from '@/app/(service)/boards/hooks/useBoardFormFields';
import useBoardFormUnsavedChangesGuard from '@/app/(service)/boards/hooks/useBoardFormUnsavedChangesGuard';
import { getArticleSubmitErrorMessage } from '@/app/(service)/boards/utils/boardFormUtils';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useUpdateArticleMutation } from '@/hooks/useArticle';
import { useUploadImageMutation } from '@/hooks/useImage';
import { getStoredAccessToken } from '@/utils/authSession';

const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? '';

type UseBoardEditFormParams = {
  articleId: QueryKeyId;
  content: string;
  image: string | null;
  title: string;
};

export default function useBoardEditForm({
  articleId,
  content,
  image,
  title,
}: UseBoardEditFormParams) {
  const router = useRouter();
  const { showToast } = useToast();
  const updateArticleMutation = useUpdateArticleMutation();
  const uploadImageMutation = useUploadImageMutation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    contentErrorMessage,
    formData,
    handleContentBlur,
    handleContentChange,
    handleImageChange,
    handleDiscardChanges,
    handleTitleBlur,
    handleTitleChange,
    hasFormChanged,
    imageFile,
    isSubmittable,
    setIsSubmitted,
    titleErrorMessage,
  } = useBoardFormFields({
    initialFormData: { content, image, title },
    requiresChange: true,
  });

  useBoardFormUnsavedChangesGuard({
    hasUnsavedChanges: hasFormChanged,
    intent: 'edit',
    onDiscardChanges: handleDiscardChanges,
  });

  const savedSuccessfullyRef = useRef(false);

  const isMutationPending =
    uploadImageMutation.isPending || updateArticleMutation.isPending;
  const isSubmitBusy = isLoading || isMutationPending;
  const isSubmitDisabled = isSubmitBusy || !isSubmittable;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!isSubmittable) {
      return;
    }

    if (!TEAM_ID) {
      showToast('팀 정보가 설정되지 않았습니다.', 'error');
      return;
    }

    if (isSubmitBusy) {
      return;
    }

    try {
      setIsLoading(true);
      const token = getStoredAccessToken();
      if (!token) {
        showToast('로그인이 필요합니다.', 'error');
        return;
      }

      await executeBoardArticleEdit({
        articleId,
        formData,
        imageFile,
        teamId: TEAM_ID,
        token,
        updateArticleMutateAsync: updateArticleMutation.mutateAsync,
        uploadImageMutateAsync: uploadImageMutation.mutateAsync,
      });

      savedSuccessfullyRef.current = true;
      showToast('게시글이 성공적으로 수정되었습니다.', 'success');
      router.push(ROUTES.BOARD_DETAIL(String(articleId)));
    } catch (error: unknown) {
      showToast(getArticleSubmitErrorMessage(error, 'update'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading: isSubmitBusy,
    isSubmitDisabled,
    titleErrorMessage,
    contentErrorMessage,
    handleTitleChange,
    handleContentChange,
    handleTitleBlur,
    handleContentBlur,
    handleImageChange,
    handleSubmit,
  };
}
