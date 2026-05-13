'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { TEAM_ID } from '@/app/(service)/boards/constants';
import useBoardFormFields from '@/app/(service)/boards/hooks/useBoardFormFields';
import useBoardFormUnsavedChangesGuard from '@/app/(service)/boards/hooks/useBoardFormUnsavedChangesGuard';
import {
  buildArticleMutationBody,
  getArticleSubmitErrorMessage,
} from '@/app/(service)/boards/utils/boardFormUtils';
import { useToast } from '@/components/common/toast';
import { ROUTES } from '@/constants/ROUTES';
import { useCreateArticleMutation } from '@/hooks/useArticle';
import { useUploadImageMutation } from '@/hooks/useImage';
import { getStoredAccessToken } from '@/utils/authSession';

export default function useBoardCreateForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const createArticleMutation = useCreateArticleMutation();
  const uploadImageMutation = useUploadImageMutation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    contentErrorMessage,
    formData,
    handleContentBlur,
    handleContentChange,
    handleDiscardChanges,
    handleImageChange,
    handleTitleBlur,
    handleTitleChange,
    hasFormChanged,
    imageFile,
    isSubmittable,
    setIsSubmitted,
    titleErrorMessage,
  } = useBoardFormFields();

  useBoardFormUnsavedChangesGuard({
    hasUnsavedChanges: hasFormChanged,
    intent: 'create',
    onDiscardChanges: handleDiscardChanges,
  });

  const isMutationPending =
    uploadImageMutation.isPending || createArticleMutation.isPending;
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
      const uploadedImage = imageFile
        ? await uploadImageMutation.mutateAsync({ file: imageFile })
        : null;

      await createArticleMutation.mutateAsync({
        body: buildArticleMutationBody({
          content: formData.content,
          image: uploadedImage ? uploadedImage.url : formData.image,
          title: formData.title,
        }),
        teamId: TEAM_ID,
        token,
      });

      showToast('게시글이 성공적으로 등록되었습니다.', 'success');
      router.replace(ROUTES.BOARDS);
    } catch (error: unknown) {
      showToast(getArticleSubmitErrorMessage(error, 'create'), 'error');
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
