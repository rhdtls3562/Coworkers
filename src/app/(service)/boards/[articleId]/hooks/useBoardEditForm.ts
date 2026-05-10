'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import type { QueryKeyId } from '@/api/queryKeys';
import useBoardFormFields from '@/app/(service)/boards/hooks/useBoardFormFields';
import {
  getArticleSubmitErrorMessage,
  normalizeArticleImageUrl,
} from '@/app/(service)/boards/utils/boardUtils';
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
    handleTitleBlur,
    handleTitleChange,
    imageFile,
    isSubmittable,
    setIsSubmitted,
    titleErrorMessage,
  } = useBoardFormFields({
    initialFormData: { content, image, title },
    requiresChange: true,
  });

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
      const token = getStoredAccessToken() ?? undefined;
      const uploadedImage = imageFile
        ? await uploadImageMutation.mutateAsync({ file: imageFile })
        : null;

      const imageForRequest = normalizeArticleImageUrl(
        uploadedImage ? uploadedImage.url : formData.image,
      );

      await updateArticleMutation.mutateAsync({
        articleId,
        body: {
          content: formData.content.trim(),
          image: imageForRequest,
          title: formData.title.trim(),
        },
        teamId: TEAM_ID,
        token,
      });

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
